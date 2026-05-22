const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (user only)
const placeOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Build order items with current product prices
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/mine
// @access  Private (user only)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id
// @access  Private (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
