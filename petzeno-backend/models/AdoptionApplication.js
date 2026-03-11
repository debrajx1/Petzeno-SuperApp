const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: String,
  userPhone: String,
  petName: String,
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'approved', 'rejected'], 
    default: 'pending' 
  },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
