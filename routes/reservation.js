// routes/reservations.js
const express = require('express');
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  deleteReservation
} = require('../controllers/reservation');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// user
router.post('/', protect, authorize('user','admin'), createReservation);
router.get('/', protect, authorize('user','admin'), getMyReservations);
router.put('/:id', protect, authorize('user','admin'), updateReservation);
router.delete('/:id', protect, authorize('user','admin'), deleteReservation);

// admin
router.get('/', protect, authorize('admin'), getAllReservations);

module.exports = router;