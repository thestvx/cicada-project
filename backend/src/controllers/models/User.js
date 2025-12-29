// backend/src/models/User.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { name, email, phone, password, language_preference, referred_by } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    const referral_code = this.generateReferralCode();

    const query = `
      INSERT INTO users (name, email, phone, password_hash, language_preference, referral_code, referred_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, phone, balance, language_preference, referral_code, created_at
    `;
    
    const result = await pool.query(query, [
      name, email, phone, password_hash, language_preference, referral_code, referred_by
    ]);
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, name, email, phone, balance, verification_status, 
             language_preference, kyc_status, referral_code, two_factor_enabled,
             is_active, role, created_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateBalance(userId, amount, type = 'add') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const userQuery = 'SELECT balance FROM users WHERE id = $1 FOR UPDATE';
      const userResult = await client.query(userQuery, [userId]);
      const currentBalance = parseFloat(userResult.rows[0].balance);
      
      const newBalance = type === 'add' 
        ? currentBalance + parseFloat(amount)
        : currentBalance - parseFloat(amount);

      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }

      const updateQuery = 'UPDATE users SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
      await client.query(updateQuery, [newBalance, userId]);

      // Log transaction
      const transactionQuery = `
        INSERT INTO transactions (user_id, type, amount, balance_before, balance_after)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(transactionQuery, [
        userId, type === 'add' ? 'credit' : 'debit', amount, currentBalance, newBalance
      ]);

      await client.query('COMMIT');
      return newBalance;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static generateReferralCode() {
    return 'CIC' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
