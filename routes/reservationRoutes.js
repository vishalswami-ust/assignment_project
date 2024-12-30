const express = require('express');
const { reserveSeats, cancelReservation, updateSeats } = require('../models/Reservation');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure you are loading .env variables

const router = express.Router();

// Middleware to check JWT token
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  console.log("Received Token: ", token);  // Debugging: log received token

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  // Ensure the token starts with "Bearer "
  if (!token.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Invalid token format' });
  }

  // Extract the token part
  const actualToken = token.split(' ')[1];

  // Decode and verify the token
  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);  // Debugging: log the error if verification fails
      return res.status(403).json({ error: 'Invalid token' });
    }

    console.log("Decoded JWT Payload: ", decoded);  // Debugging: log the decoded token

    req.userId = decoded.id;  // Assuming your token payload contains `id`
    next();
  });
}

// Reserve seats
router.post('/reserve', authenticate, async (req, res) => {
  const { seat_ids } = req.body;
  try {
    await updateSeats(seat_ids, req.userId);
    const reservationId = await reserveSeats(req.userId, seat_ids);
    res.status(201).json({ message: 'Seats reserved successfully', reservationId });
  } catch (err) {
    res.status(500).json({ error: 'Error reserving seats' });
  }
});

// Cancel reservation
router.delete('/cancel', authenticate, async (req, res) => {
  const { reservation_id } = req.body;
  try {
    const success = await cancelReservation(reservation_id);
    if (success) {
      res.status(200).json({ message: 'Reservation canceled successfully' });
    } else {
      res.status(400).json({ error: 'Reservation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error canceling reservation' });
  }
});

module.exports = router;
