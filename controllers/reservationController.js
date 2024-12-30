// controllers/reservationController.js
const { reserveSeats, cancelReservation, updateSeats } = require('../models/Reservation');

// Middleware to authenticate the user based on JWT token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      print(token)
      return res.status(403).json({ error: token });
    }
    req.userId = decoded.id;
    next();
  });
};

// Reserve seats for a user
const reserve = async (req, res) => {
  const { seat_ids } = req.body;

  try {
    // Mark seats as reserved for the user
    await updateSeats(seat_ids, req.userId);
    const reservationId = await reserveSeats(req.userId, seat_ids);
    res.status(201).json({ message: 'Seats reserved successfully', reservationId });
  } catch (err) {
    res.status(500).json({ error: 'Error reserving seats' });
  }
};

// Cancel reservation
const cancel = async (req, res) => {
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
};

module.exports = { authenticate, reserve, cancel };
