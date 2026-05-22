const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateDescription,
  generateTags,
  generateCaption,
  generateSuggestions,
} = require('../controllers/aiController');

router.post('/description', protect, generateDescription);
router.post('/tags', protect, generateTags);
router.post('/caption', protect, generateCaption);
router.post('/suggestions', protect, generateSuggestions);

module.exports = router;
