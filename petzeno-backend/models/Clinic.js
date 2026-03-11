const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctor: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  patientsToday: { type: Number, default: 0 },
  address: String,
  contact: String
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
