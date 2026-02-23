const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Reservation = require("../models/reservation");

exports.createReservation = async (req, res, next) => {
  try {
    const { restaurant_id, date, table_count } = req.body;

    // ตรวจร้านว่ามีจริงไหม
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    /// ตรวจว่าจองซ้ำไหม
    const existed = await Reservation.findOne({
    user_id: req.user.id,
    restaurant_id,
    date: new Date(date)
    });
    if (existed) {
  return res.status(400).json({
    success: false,
    message: 'You already have a reservation for this restaurant on this date'
  });
}

    // จำกัดโต๊ะไม่เกิน 3
    if (table_count > 3) {
      return res.status(400).json({
        success: false,
        message: 'You can reserve up to 3 tables only'
      });
    }

    const reservation = await Reservation.create({
      user_id: req.user.id,
      restaurant_id,
      date,
      table_count
    });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (err) {
    next(err);
  }
};
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      user_id: req.user.id
    }).populate('restaurant_id');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate('user_id', 'name email')
      .populate('restaurant_id');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    next(err);
  }
};
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // user แก้ได้เฉพาะของตัวเอง
    if (
      reservation.user_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // จำกัดโต๊ะ
    if (req.body.table_count > 3) {
      return res.status(400).json({
        success: false,
        message: 'You can reserve up to 3 tables only'
      });
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // user ลบได้เฉพาะของตัวเอง
    if (
      reservation.user_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};