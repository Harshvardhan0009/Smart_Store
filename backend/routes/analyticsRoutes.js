const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getRevenue,
  getTopProducts,
  getLowStock,
} = require('../controllers/analyticsController');

router.get('/summary', protect, getSummary);
router.get('/revenue', protect, getRevenue);
router.get('/top-products', protect, getTopProducts);
router.get('/low-stock', protect, getLowStock);

module.exports = router;
