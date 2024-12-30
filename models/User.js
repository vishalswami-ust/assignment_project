// models/User.js
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Create a new user
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);
  return result.rows[0].id;
}

// Get user by username
async function getUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

module.exports = { createUser, getUserByUsername };
