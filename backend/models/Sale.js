const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
    min: 1,
  },
  revenue: {
    type: Number,
    required: true,
    min: 0,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sale', saleSchema);
