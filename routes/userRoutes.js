// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/User');
require('dotenv').config();

const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userId = await createUser(username, password);
    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    res.status(500).json({ error: 'Error signing up user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
