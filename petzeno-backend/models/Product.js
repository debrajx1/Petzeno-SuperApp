const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  unit: { type: String, default: 'unit' },
  imageUrl: String,
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: String,
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' }
}, { timestamps: true });

// Auto-update status based on stock
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock < 10) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
