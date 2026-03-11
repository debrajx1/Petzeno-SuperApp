const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  availablePets: { type: Number, default: 0 },
  recentAdoptions: { type: Number, default: 0 },
  address: String,
  contact: String
}, { timestamps: true });

module.exports = mongoose.model('Shelter', shelterSchema);
