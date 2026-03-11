const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');

// 1. PROVIDER: Request Access (Registration Interest)
router.post('/register-interest', async (req, res) => {
  try {
    const { email, name, role, businessName, phone, message } = req.body;
    
    // Check if already requested
    const existing = await VerificationRequest.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted a request. Our team will contact you.' });
    }

    const request = await VerificationRequest.create({ email, name, role, businessName, phone, message });
    res.status(201).json({ success: true, message: 'Request submitted! Petzeno team will verify your details and reach out via email.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. ADMIN: Get all pending requests
router.get('/admin/requests', async (req, res) => {
  try {
    const requests = await VerificationRequest.find({ status: 'pending' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. ADMIN: Approve Request
router.post('/admin/approve/:id', async (req, res) => {
  try {
    const request = await VerificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Create real User account
    const newUser = await User.create({
      email: request.email,
      password: 'temp_password_' + Math.floor(1000 + Math.random() * 9000), // In real production, this would be an encrypted random string
      name: request.name,
      role: request.role,
      businessName: request.businessName,
      status: 'verified'
    });

    request.status = 'approved';
    await request.save();

    res.json({ 
      success: true, 
      message: `Approved! User created with password: ${newUser.password}. In production, this would be sent to ${request.email} securely.` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Simple Login (Simulation for Hackathon)
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Check if connected to MongoDB
    const isConnected = mongoose.connection.readyState === 1;
    let user;

    if (isConnected) {
      user = await User.findOne({ email, role });
    } else {
      // Fallback: Check in seeded mock data if DB is down
      const { MOCK_FALLBACK } = require('./apiRoutes'); // Import mock users
      user = MOCK_FALLBACK.users.find(u => u.email === email && u.role === role);
      console.log('DB Down: Using Fallback Auth for', email);
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not verified or credentials invalid.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid access key.' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id || 'mock_id_' + Date.now(),
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        businessName: user.businessName
      }
    });
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
