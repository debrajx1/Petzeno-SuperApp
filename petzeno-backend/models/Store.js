const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: String, required: true },
  lowStockItems: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  address: String,
  contact: String
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
