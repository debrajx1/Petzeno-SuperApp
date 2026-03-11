const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: String,
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['active', 'responding', 'resolved'],
    default: 'active'
  },
  severity: {
    type: String,
    enum: ['critical', 'medium', 'low'],
    default: 'critical'
  },
  petDetails: {
    name: String,
    species: String
  },
  responderId: String, // ID of the Vet/Rescuer who accepted the alert
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
