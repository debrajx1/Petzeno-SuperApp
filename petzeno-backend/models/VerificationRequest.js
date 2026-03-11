const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['vet', 'shelter', 'store'], required: true },
  businessName: { type: String, required: true },
  phone: String,
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);
