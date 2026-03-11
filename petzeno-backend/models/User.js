const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['vet', 'shelter', 'store', 'admin'], default: 'vet' },
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  businessName: String,
  businessId: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
