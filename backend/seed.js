const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    price: 2499,
    stock: 45,
    description: 'Premium wireless earbuds with noise cancellation, Bluetooth 5.3, and 30-hour battery life.',
    tags: ['earbuds', 'wireless', 'bluetooth', 'noise cancellation'],
    caption: '🎧 Immersive sound, zero wires. Experience audio freedom!',
    aiGenerated: true,
  },
  {
    name: 'Organic Cotton T-Shirt',
    category: 'Fashion',
    price: 799,
    stock: 120,
    description: 'Soft, breathable organic cotton t-shirt. Perfect for everyday comfort and sustainable style.',
    tags: ['organic', 'cotton', 'sustainable', 'comfortable'],
    caption: '👕 Style meets sustainability. Feel good, look great!',
    aiGenerated: true,
  },
  {
    name: 'Smart LED Desk Lamp',
    category: 'Home & Office',
    price: 1899,
    stock: 8,
    description: 'Adjustable LED desk lamp with 5 brightness levels, USB charging port, and eye-care technology.',
    tags: ['led', 'desk lamp', 'smart', 'usb charging'],
    caption: '💡 Illuminate your workspace. Smart lighting for smart people!',
    aiGenerated: false,
  },
  {
    name: 'Stainless Steel Water Bottle',
    category: 'Lifestyle',
    price: 599,
    stock: 200,
    description: 'Double-walled insulated water bottle. Keeps drinks cold for 24h and hot for 12h.',
    tags: ['water bottle', 'insulated', 'stainless steel', 'eco friendly'],
    caption: '💧 Stay hydrated in style. Hot or cold, we got you!',
    aiGenerated: true,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 3499,
    stock: 5,
    description: 'RGB mechanical keyboard with Cherry MX switches, anti-ghosting, and programmable macros.',
    tags: ['gaming', 'mechanical', 'rgb', 'keyboard'],
    caption: '⌨️ Level up your gaming setup. Every keystroke matters!',
    aiGenerated: true,
  },
  {
    name: 'Yoga Mat Premium',
    category: 'Fitness',
    price: 1299,
    stock: 3,
    description: 'Extra thick, non-slip yoga mat with alignment lines. Perfect for yoga, pilates, and meditation.',
    tags: ['yoga', 'fitness', 'non-slip', 'eco friendly'],
    caption: '🧘 Find your balance. Premium comfort for every pose!',
    aiGenerated: false,
  },
  {
    name: 'Portable Power Bank 20000mAh',
    category: 'Electronics',
    price: 1599,
    stock: 75,
    description: 'Fast-charging power bank with dual USB ports. Charge 3 devices simultaneously.',
    tags: ['power bank', 'portable', 'fast charging', 'usb'],
    caption: '🔋 Never run out of power. Your devices\' best friend!',
    aiGenerated: true,
  },
  {
    name: 'Bamboo Cutting Board Set',
    category: 'Kitchen',
    price: 899,
    stock: 50,
    description: 'Set of 3 bamboo cutting boards in different sizes. Anti-bacterial and knife-friendly.',
    tags: ['bamboo', 'kitchen', 'cutting board', 'eco friendly'],
    caption: '🍳 Cook like a pro. Sustainable kitchen essentials!',
    aiGenerated: false,
  },
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Product.deleteMany();
    await Sale.deleteMany();
    console.log('Cleared existing products and sales.');

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${createdProducts.length} sample products.`);

    // Generate sample sales data for the last 7 months
    const sales = [];
    const now = new Date();

    for (let monthOffset = 6; monthOffset >= 0; monthOffset--) {
      const saleDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, Math.floor(Math.random() * 28) + 1);

      // Generate 3-6 sales per month
      const salesThisMonth = Math.floor(Math.random() * 4) + 3;

      for (let i = 0; i < salesThisMonth; i++) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty = Math.floor(Math.random() * 10) + 1;

        sales.push({
          productId: randomProduct._id,
          quantitySold: qty,
          revenue: qty * randomProduct.price,
          saleDate: new Date(saleDate.getTime() + Math.random() * 86400000 * 25),
        });
      }
    }

    await Sale.insertMany(sales);
    console.log(`Inserted ${sales.length} sample sales records.`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
