const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  petId: { type: String, required: true },
  petName: { type: String, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The Vet
  businessName: String,
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true },
  type: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'confirmed', 'cancelled', 'completed'], 
    default: 'upcoming' 
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
