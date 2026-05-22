// AI Helper utilities for generating content
// Uses mock responses by default; set OPENAI_API_KEY in .env for real AI

const generateWithAI = async (prompt) => {
  // If OpenAI key is configured, use it
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error, falling back to mock:', error.message);
      return generateMockResponse(prompt);
    }
  }

  // Fall back to smart mock responses
  return generateMockResponse(prompt);
};

const generateMockResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('description')) {
    return `Discover the perfect blend of quality and innovation with this premium product. Crafted with attention to detail, it delivers exceptional performance and style. Whether you're a professional or enthusiast, this product exceeds expectations with its cutting-edge features and durable construction. Experience the difference that quality makes — upgrade your everyday routine today.`;
  }

  if (lowerPrompt.includes('seo') || lowerPrompt.includes('tags')) {
    return JSON.stringify([
      'premium quality',
      'best seller',
      'top rated',
      'free shipping',
      'limited edition',
      'trending now',
      'customer favorite',
      'eco friendly'
    ]);
  }

  if (lowerPrompt.includes('caption') || lowerPrompt.includes('marketing')) {
    return `🔥 Elevate your game with our latest must-have! Premium quality meets unbeatable value. Don't miss out — limited stock available! Shop now and join thousands of happy customers. ✨ #SmartStore #TrendingNow #BestDeals`;
  }

  if (lowerPrompt.includes('pricing') || lowerPrompt.includes('suggestion')) {
    return JSON.stringify({
      pricingSuggestion: 'Consider a 10-15% price increase based on market demand. Your current pricing is below the category average.',
      trendingInsight: 'Products in this category have seen a 23% increase in search volume this month.',
      inventoryTip: 'Based on current sales velocity, consider restocking within 2 weeks to avoid stockouts.',
      marketingTip: 'Bundle this product with complementary items for a 20% boost in average order value.'
    });
  }

  return 'AI-generated content for your store. Customize this by connecting your OpenAI API key.';
};

const buildDescriptionPrompt = (product) => {
  return `You are an e-commerce copywriting expert. Generate a compelling, SEO-friendly product description (2-3 sentences) for:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Key Features: ${product.features || 'Premium quality, durable, modern design'}
Keep it concise, engaging, and conversion-focused.`;
};

const buildTagsPrompt = (product) => {
  return `Generate 8 SEO tags as a JSON array of strings for this e-commerce product:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Return only the JSON array, no explanation.`;
};

const buildCaptionPrompt = (product) => {
  return `Write a short, catchy marketing caption (1-2 lines) with relevant emojis for social media promotion of:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Make it engaging and include a call to action.`;
};

const buildSuggestionsPrompt = (product) => {
  return `You are an e-commerce AI advisor. Provide JSON with these keys: pricingSuggestion, trendingInsight, inventoryTip, marketingTip for:
Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Stock: ${product.stock} units
Return only valid JSON.`;
};

module.exports = {
  generateWithAI,
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildSuggestionsPrompt,
};
