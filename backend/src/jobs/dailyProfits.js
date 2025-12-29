// backend/src/jobs/dailyProfits.js
const cron = require('node-cron');
const pool = require('../config/database');
const logger = require('../utils/logger');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  logger.info('Starting daily profit distribution');

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    // Get all active investments
    const investmentsQuery = `
      SELECT ui.*, ip.daily_profit_rate
      FROM user_investments ui
      JOIN investment_plans ip ON ui.plan_id = ip.id
      WHERE ui.status = 'active'
        AND ui.end_date > CURRENT_TIMESTAMP
        AND (ui.last_profit_date IS NULL OR ui.last_profit_date < CURRENT_DATE)
    `;
    const investments = await client.query(investmentsQuery);

    for (const investment of investments.rows) {
      const profitAmount = investment.amount * investment.daily_profit_rate;

      // Update user balance
      await client.query(`
        UPDATE users SET balance = balance + $1 WHERE id = $2
      `, [profitAmount, investment.user_id]);

      // Update investment
      await client.query(`
        UPDATE user_investments 
        SET total_earned = total_earned + $1, last_profit_date = CURRENT_DATE
        WHERE id = $2
      `, [profitAmount, investment.id]);

      // Record earning
      await client.query(`
        INSERT INTO earnings (user_id, amount, type, source_type, source_id, description)
        VALUES ($1, $2, 'daily_profit', 'investment', $3, 'Daily investment profit')
      `, [investment.user_id, profitAmount, investment.id]);

      logger.info(`Profit distributed: User ${investment.user_id}, Amount ${profitAmount}`);
    }

    await client.query('COMMIT');
    logger.info('Daily profit distribution completed');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Daily profit distribution failed:', error);
  } finally {
    client.release();
  }
});
