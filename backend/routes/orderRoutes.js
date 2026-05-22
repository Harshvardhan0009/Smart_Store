const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly, userOnly } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, userOnly, placeOrder);
router.get('/mine', protect, userOnly, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
