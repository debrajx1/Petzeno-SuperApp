const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    sku: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The Store
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  shippingAddress: String,
  paymentStatus: { type: String, default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
