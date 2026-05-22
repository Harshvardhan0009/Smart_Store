// AI Helper utilities for generating content
// Uses smart product-aware mock responses by default; set OPENAI_API_KEY in .env for real AI

const generateWithAI = async (prompt, product = {}) => {
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
      console.error('OpenAI API error, falling back to smart mock:', error.message);
      return generateSmartMock(prompt, product);
    }
  }

  return generateSmartMock(prompt, product);
};

// ─── Category-aware content templates ──────────────────────────────────────

const categoryData = {
  Electronics: {
    adjectives: ['cutting-edge', 'high-performance', 'smart', 'next-generation', 'wireless'],
    benefits: ['seamless connectivity', 'lightning-fast performance', 'long battery life', 'crystal-clear display'],
    emojis: ['⚡', '📱', '💻', '🔌', '🎧'],
    hashtags: ['#TechLife', '#SmartTech', '#Electronics', '#Innovation', '#Gadgets'],
  },
  Fashion: {
    adjectives: ['stylish', 'premium', 'trendy', 'versatile', 'elegant'],
    benefits: ['all-day comfort', 'lasting durability', 'timeless style', 'perfect fit'],
    emojis: ['👗', '✨', '💃', '🛍️', '👕'],
    hashtags: ['#Fashion', '#StyleGoals', '#OOTD', '#TrendAlert', '#FashionForward'],
  },
  'Home & Office': {
    adjectives: ['smart', 'ergonomic', 'modern', 'space-saving', 'durable'],
    benefits: ['improved productivity', 'enhanced comfort', 'sleek design', 'easy setup'],
    emojis: ['🏠', '💡', '🖥️', '📦', '🛋️'],
    hashtags: ['#HomeDecor', '#OfficeSetup', '#WorkFromHome', '#HomeGoals', '#InteriorDesign'],
  },
  Fitness: {
    adjectives: ['pro-grade', 'lightweight', 'durable', 'high-performance', 'ergonomic'],
    benefits: ['faster recovery', 'improved endurance', 'better form', 'peak performance'],
    emojis: ['💪', '🏋️', '🧘', '🏃', '🔥'],
    hashtags: ['#FitnessGoals', '#WorkoutLife', '#HealthyLiving', '#FitLife', '#GymTime'],
  },
  Kitchen: {
    adjectives: ['premium', 'professional', 'eco-friendly', 'non-toxic', 'durable'],
    benefits: ['effortless cooking', 'easy cleaning', 'long-lasting quality', 'safe materials'],
    emojis: ['🍳', '🥗', '🍴', '👨‍🍳', '✨'],
    hashtags: ['#KitchenGoals', '#Cooking', '#FoodLovers', '#ChefLife', '#HomeChef'],
  },
  Lifestyle: {
    adjectives: ['premium', 'eco-conscious', 'stylish', 'versatile', 'everyday'],
    benefits: ['sustainable living', 'everyday convenience', 'stylish design', 'lasting quality'],
    emojis: ['🌿', '✨', '💎', '🌟', '🛍️'],
    hashtags: ['#LifestyleGoals', '#SustainableLiving', '#EcoFriendly', '#DailyEssentials', '#LuxuryLife'],
  },
  default: {
    adjectives: ['premium', 'high-quality', 'reliable', 'versatile', 'innovative'],
    benefits: ['exceptional quality', 'great value', 'long-lasting durability', 'outstanding performance'],
    emojis: ['🌟', '✨', '💎', '🔥', '⭐'],
    hashtags: ['#BestSeller', '#MustHave', '#TopRated', '#SmartStore', '#Shopping'],
  },
};

const getCategoryInfo = (category) => {
  return categoryData[category] || categoryData.default;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Smart description generator ────────────────────────────────────────────

const generateSmartDescription = (product) => {
  const { name = 'Product', category = 'General', price = 0, stock = 0 } = product;
  const info = getCategoryInfo(category);
  const adj1 = pick(info.adjectives);
  const adj2 = pick(info.adjectives.filter(a => a !== adj1));
  const benefit1 = pick(info.benefits);
  const benefit2 = pick(info.benefits.filter(b => b !== benefit1));
  const valueNote = price < 1000 ? 'at an unbeatable price' : price < 3000 ? 'offering exceptional value' : 'for the discerning buyer';

  const templates = [
    `Introducing the ${name} — a ${adj1} ${category.toLowerCase()} product built for those who refuse to settle. Designed with ${benefit1} and ${benefit2}, this ${adj2} item delivers everything you need ${valueNote}. Elevate your everyday experience with performance that speaks for itself.`,
    `The ${name} redefines what you expect from a ${category.toLowerCase()} product. Engineered for ${benefit1}, its ${adj1} construction ensures ${benefit2} that lasts. Whether you're a first-time buyer or a seasoned enthusiast, this ${adj2} pick is the smart choice ${valueNote}.`,
    `Meet your new favourite — the ${name}. Crafted with ${adj1} precision and designed for ${benefit1}, it brings ${benefit2} to your daily routine. A ${adj2} essential in the ${category} space, it's the upgrade you've been waiting for ${valueNote}.`,
  ];

  return pick(templates);
};

// ─── Smart tags generator ────────────────────────────────────────────────────

const generateSmartTags = (product) => {
  const { name = '', category = 'General', price = 0, stock = 0 } = product;
  const info = getCategoryInfo(category);
  const words = name.toLowerCase().split(' ').filter(w => w.length > 2);

  const baseTags = [
    ...words,
    category.toLowerCase().replace(/\s+/g, '-'),
    pick(info.adjectives),
    pick(info.adjectives),
    'best seller',
    'top rated',
  ];

  if (price < 999) baseTags.push('budget friendly', 'affordable');
  else if (price < 2999) baseTags.push('great value', 'mid range');
  else baseTags.push('premium', 'luxury');

  if (stock <= 10) baseTags.push('limited stock', 'hurry');
  else baseTags.push('in stock', 'fast delivery');

  // Deduplicate and pick 8
  const unique = [...new Set(baseTags)].slice(0, 8);
  return JSON.stringify(unique);
};

// ─── Smart caption generator ─────────────────────────────────────────────────

const generateSmartCaption = (product) => {
  const { name = 'Product', category = 'General', price = 0, stock = 0 } = product;
  const info = getCategoryInfo(category);
  const emoji1 = pick(info.emojis);
  const emoji2 = pick(info.emojis.filter(e => e !== emoji1));
  const hashtag1 = pick(info.hashtags);
  const hashtag2 = pick(info.hashtags.filter(h => h !== hashtag1));
  const urgency = stock <= 10 ? `Only ${stock} left — grab yours before it's gone!` : `Shop now and experience the difference!`;

  const templates = [
    `${emoji1} Meet the ${name}! Your ultimate ${category} upgrade is here. ${urgency} ${emoji2} ${hashtag1} ${hashtag2} #SmartStore`,
    `${emoji1} Upgrade your life with the ${name}. Premium ${category.toLowerCase()} quality at ₹${price.toLocaleString()}. ${urgency} ${emoji2} ${hashtag1} #BestDeals`,
    `${emoji2} The ${name} is here to change the game! ${pick(info.adjectives).charAt(0).toUpperCase() + pick(info.adjectives).slice(1)} quality, unbeatable price. ${urgency} ${emoji1} ${hashtag1} ${hashtag2}`,
  ];

  return pick(templates);
};

// ─── Smart suggestions generator ─────────────────────────────────────────────

const generateSmartSuggestions = (product) => {
  const { name = 'Product', category = 'General', price = 0, stock = 0 } = product;
  const info = getCategoryInfo(category);

  const pricingTip = price < 999
    ? `Consider raising the price of ${name} by 10–15% — products in the ${category} category at this quality level typically command ₹${Math.round(price * 1.12).toLocaleString()}.`
    : price > 3000
    ? `${name} is priced at a premium. Consider offering a limited-time bundle deal to boost conversions.`
    : `${name} is competitively priced. A 5% seasonal discount could increase order volume by 20-25%.`;

  const trendingTip = `Products in the "${category}" category have seen a ${Math.floor(Math.random() * 20) + 10}% rise in search volume this month. ${name} is well-positioned to capitalise on this trend.`;

  const inventoryTip = stock <= 5
    ? `⚠️ Critical: Only ${stock} units of ${name} left. Reorder immediately to prevent stockout — estimated to sell out in ${stock * 2} days at current velocity.`
    : stock <= 15
    ? `Low stock warning: ${stock} units remaining. Consider restocking ${name} within the next week to maintain consistent availability.`
    : `Stock levels for ${name} look healthy at ${stock} units. Review sales velocity in 2 weeks to plan the next reorder.`;

  const marketingTip = `Bundle ${name} with complementary ${category} items to increase average order value by 20-30%. Consider featuring it in your next email campaign with a "${pick(info.adjectives)}" angle.`;

  return JSON.stringify({ pricingSuggestion: pricingTip, trendingInsight: trendingTip, inventoryTip, marketingTip });
};

// ─── Main mock dispatcher ─────────────────────────────────────────────────────

const generateSmartMock = (prompt, product) => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('description')) return generateSmartDescription(product);
  if (lowerPrompt.includes('seo') || lowerPrompt.includes('tags')) return generateSmartTags(product);
  if (lowerPrompt.includes('caption') || lowerPrompt.includes('marketing')) return generateSmartCaption(product);
  if (lowerPrompt.includes('pricing') || lowerPrompt.includes('suggestion')) return generateSmartSuggestions(product);

  return `Smart AI content for ${product.name || 'your product'}. Connect your OpenAI API key in .env for real AI generation.`;
};

// ─── Prompt builders (used when OpenAI key is present) ───────────────────────

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
  generateSmartMock,
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildSuggestionsPrompt,
};
