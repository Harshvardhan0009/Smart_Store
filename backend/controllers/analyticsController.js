const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Get analytics summary (total revenue, total products, total sales)
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSales = await Sale.countDocuments();

    const revenueAgg = await Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$revenue' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

    res.json({
      totalProducts,
      totalSales,
      totalRevenue,
      lowStockCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue data over time (last 7 months)
// @route   GET /api/analytics/revenue
// @access  Private
const getRevenue = async (req, res) => {
  try {
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    const revenueData = await Sale.aggregate([
      { $match: { saleDate: { $gte: sevenMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' },
          },
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantitySold' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = revenueData.map((item) => ({
      month: months[item._id.month - 1],
      year: item._id.year,
      revenue: item.revenue,
      sales: item.sales,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantitySold' },
          totalRevenue: { $sum: '$revenue' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock products (stock <= 10)
// @route   GET /api/analytics/low-stock
// @access  Private
const getLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select('name category stock price')
      .sort({ stock: 1 })
      .limit(10);

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getRevenue, getTopProducts, getLowStock };
