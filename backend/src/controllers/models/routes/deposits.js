// backend/src/routes/deposits.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');
const User = require('../models/User');

// Create deposit
router.post('/', auth, [
  body('amount').isFloat({ min: 10 }),
  body('payment_method').isIn(['stripe', 'bank_transfer', 'paypal'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, payment_method, payment_token } = req.body;
    const userId = req.user.userId;

    // Create deposit record
    const depositQuery = `
      INSERT INTO deposits (user_id, amount, payment_method, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `;
    const depositResult = await pool.query(depositQuery, [userId, amount, payment_method]);
    const deposit = depositResult.rows[0];

    // Process payment based on method
    if (payment_method === 'stripe') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          payment_method: payment_token,
          confirm: true,
          metadata: { deposit_id: deposit.id, user_id: userId }
        });

        if (paymentIntent.status === 'succeeded') {
          await pool.query(`
            UPDATE deposits 
            SET status = 'completed', transaction_id = $1, gateway_response = $2, processed_at = CURRENT_TIMESTAMP
            WHERE id = $3
          `, [paymentIntent.id, JSON.stringify(paymentIntent), deposit.id]);

          await User.updateBalance(userId, amount, 'add');

          res.json({
            success: true,
            message: 'Deposit successful',
            deposit: { ...deposit, status: 'completed' }
          });
        } else {
          await pool.query(`
            UPDATE deposits SET status = 'failed', gateway_response = $1 WHERE id = $2
          `, [JSON.stringify(paymentIntent), deposit.id]);

          res.status(400).json({ success: false, message: 'Payment failed' });
        }
      } catch (stripeError) {
        await pool.query(`
          UPDATE deposits SET status = 'failed', gateway_response = $1 WHERE id = $2
        `, [JSON.stringify({ error: stripeError.message }), deposit.id]);

        res.status(400).json({ success: false, message: stripeError.message });
      }
    } else {
      res.json({
        success: true,
        message: 'Deposit pending manual approval',
        deposit
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user deposits
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM deposits 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);

    const countQuery = 'SELECT COUNT(*) FROM deposits WHERE user_id = $1';
    const countResult = await pool.query(countQuery, [userId]);

    res.json({
      success: true,
      deposits: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
