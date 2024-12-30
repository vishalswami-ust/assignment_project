// models/Reservation.js
const pool = require('../config/db');

// Reserve seats for a user
async function reserveSeats(user_id, seat_ids) {
  const result = await pool.query('INSERT INTO reservations(user_id, seat_ids) VALUES($1, $2) RETURNING id', [user_id, seat_ids]);
  return result.rows[0].id;
}

// Cancel reservation
async function cancelReservation(reservation_id) {
  const result = await pool.query('DELETE FROM reservations WHERE id = $1', [reservation_id]);
  return result.rowCount > 0;
}

// Mark seats as reserved
async function updateSeats(seat_ids, user_id) {
  for (let seat_id of seat_ids) {
    await pool.query('UPDATE seats SET is_reserved = true, reserved_by_user_id = $1 WHERE id = $2', [user_id, seat_id]);
  }
}

module.exports = { reserveSeats, cancelReservation, updateSeats };
