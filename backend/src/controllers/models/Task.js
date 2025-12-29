// backend/src/models/Task.js
const pool = require('../config/database');

class Task {
  static async create(taskData) {
    const { title, description, reward_amount, difficulty, category, max_completions, requirements, expiry_date } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, reward_amount, difficulty, category, max_completions, requirements, expiry_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      JSON.stringify(title),
      JSON.stringify(description),
      reward_amount,
      difficulty,
      category,
      max_completions,
      JSON.stringify(requirements),
      expiry_date
    ]);
    
    return result.rows[0];
  }

  static async getAvailableTasks(userId, language = 'en') {
    const query = `
      SELECT t.*, 
             CASE WHEN ut.id IS NOT NULL THEN true ELSE false END as user_completed
      FROM tasks t
      LEFT JOIN user_tasks ut ON t.id = ut.task_id AND ut.user_id = $1
      WHERE t.is_active = true 
        AND t.current_completions < t.max_completions
        AND (t.expiry_date IS NULL OR t.expiry_date > CURRENT_TIMESTAMP)
        AND ut.id IS NULL
      ORDER BY t.reward_amount DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows.map(task => ({
      ...task,
      title: task.title[language] || task.title.en,
      description: task.description[language] || task.description.en
    }));
  }

  static async assignTaskToUser(userId, taskId) {
    const query = `
      INSERT INTO user_tasks (user_id, task_id, status)
      VALUES ($1, $2, 'in_progress')
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, taskId]);
    return result.rows[0];
  }

  static async completeTask(userTaskId, userId, verificationProof) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update user task
      const updateQuery = `
        UPDATE user_tasks 
        SET status = 'pending_verification', 
            verification_proof = $1, 
            completed_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND user_id = $3
        RETURNING *
      `;
      await client.query(updateQuery, [JSON.stringify(verificationProof), userTaskId, userId]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async verifyAndReward(userTaskId, isApproved, adminNotes) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get task details
      const taskQuery = `
        SELECT ut.user_id, t.reward_amount, t.id as task_id
        FROM user_tasks ut
        JOIN tasks t ON ut.task_id = t.id
        WHERE ut.id = $1
      `;
      const taskResult = await client.query(taskQuery, [userTaskId]);
      const { user_id, reward_amount, task_id } = taskResult.rows[0];

      if (isApproved) {
        // Update task status
        await client.query(`
          UPDATE user_tasks 
          SET status = 'completed', verified_at = CURRENT_TIMESTAMP, admin_review_notes = $1
          WHERE id = $2
        `, [adminNotes, userTaskId]);

        // Add reward to user balance
        await client.query(`
          UPDATE users SET balance = balance + $1 WHERE id = $2
        `, [reward_amount, user_id]);

        // Record earning
        await client.query(`
          INSERT INTO earnings (user_id, amount, type, source_type, source_id, description)
          VALUES ($1, $2, 'task_reward', 'task', $3, 'Task completion reward')
        `, [user_id, reward_amount, task_id]);

        // Update task completion count
        await client.query(`
          UPDATE tasks SET current_completions = current_completions + 1 WHERE id = $1
        `, [task_id]);
      } else {
        await client.query(`
          UPDATE user_tasks 
          SET status = 'rejected', admin_review_notes = $1
          WHERE id = $2
        `, [adminNotes, userTaskId]);
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Task;
