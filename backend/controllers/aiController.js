const {
  generateWithAI,
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildSuggestionsPrompt,
} = require('../utils/aiHelpers');

// @desc    Generate product description
// @route   POST /api/ai/description
// @access  Private
const generateDescription = async (req, res) => {
  try {
    const product = req.body;
    const prompt = buildDescriptionPrompt(product);
    const description = await generateWithAI(prompt, product);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate SEO tags
// @route   POST /api/ai/tags
// @access  Private
const generateTags = async (req, res) => {
  try {
    const product = req.body;
    const prompt = buildTagsPrompt(product);
    const result = await generateWithAI(prompt, product);
    let tags;
    try {
      tags = JSON.parse(result);
    } catch {
      tags = result.split(',').map((t) => t.trim());
    }
    res.json({ tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate marketing caption
// @route   POST /api/ai/caption
// @access  Private
const generateCaption = async (req, res) => {
  try {
    const product = req.body;
    const prompt = buildCaptionPrompt(product);
    const caption = await generateWithAI(prompt, product);
    res.json({ caption });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI suggestions (pricing, trending, inventory)
// @route   POST /api/ai/suggestions
// @access  Private
const generateSuggestions = async (req, res) => {
  try {
    const product = req.body;
    const prompt = buildSuggestionsPrompt(product);
    const result = await generateWithAI(prompt, product);
    let suggestions;
    try {
      suggestions = JSON.parse(result);
    } catch {
      suggestions = { suggestion: result };
    }
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateDescription, generateTags, generateCaption, generateSuggestions };
