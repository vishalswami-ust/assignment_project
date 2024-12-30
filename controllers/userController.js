// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/User');
require('dotenv').config();

// User signup
const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create the user
    const userId = await createUser(username, password);
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    res.status(500).json({ error: 'Error signing up user' });
  }
};

// User login
const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  // Compare password with hashed password in DB
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
};

module.exports = { signup, login };
