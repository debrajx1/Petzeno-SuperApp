const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerificationRequest = require('../models/VerificationRequest');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

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

    const tempPassword = 'temp_password_' + Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create real User account
    const newUser = await User.create({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      role: request.role,
      businessName: request.businessName,
      status: 'verified'
    });

    request.status = 'approved';
    await request.save();

    res.json({ 
      success: true, 
      message: `Approved! User created with password: ${tempPassword}. In production, this would be sent to ${request.email} securely.` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Professional Login with JWT
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  const { MOCK_FALLBACK } = require('./apiRoutes');
  const isConnected = mongoose.connection.readyState === 1;
  
  try {
    let user;
    if (isConnected) {
      user = await User.findOne({ email, role });
    } else {
      console.log('DB Down: Using MOCK_FALLBACK for Auth');
      user = MOCK_FALLBACK.users.find(u => u.email === email && u.role === role);
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not verified or credentials invalid.' });
    }

    if (isConnected) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== user.password) { 
        return res.status(401).json({ success: false, message: 'Invalid access key.' });
      }
    } else {
      // In Fallback Mode, just check plain text password
      if (password !== user.password) {
        return res.status(401).json({ success: false, message: 'Invalid access key.' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id || 'mock_id', email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id || 'mock_id',
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
