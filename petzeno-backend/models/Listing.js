const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  type: { type: String, enum: ['adoption', 'lost-found'], required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: String,
  age: String,
  location: String,
  description: String,
  status: { type: String, default: 'Available' },
  imageUrl: String,
  price: Number, // For store items
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessName: String,
  contactPhone: String,
  contactEmail: String
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
