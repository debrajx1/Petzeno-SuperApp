const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  author: { type: String, required: true },
  authorAvatar: String,
  userType: { type: String, enum: ['vet', 'shelter', 'store', 'user'], default: 'user' },
  category: { type: String, enum: ['Health', 'Adoption', 'Marketplace', 'Life', 'General'], default: 'General' },
  petName: String,
  text: { type: String, required: true },
  image: String,
  likes: [{ type: String }],
  comments: [{
    id: String,
    userId: String,
    userName: String,
    userAvatar: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
