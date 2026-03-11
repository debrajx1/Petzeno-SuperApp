const express = require('express');
const router = express.Router();
const SOSAlert = require('../models/SOSAlert');
const mongoose = require('mongoose');

// 1. MOBILE: Report SOS
router.post('/report', async (req, res) => {
  try {
    const alert = await SOSAlert.create(req.body);
    console.log('REAL-TIME SOS RECEIVED:', alert.userName, 'at', alert.location.address);
    res.status(201).json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. DASHBOARD: Get all active alerts
router.get('/active', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      // Return a mock SOS for demo if DB is down
      return res.json([{
        _id: 'mock_sos_1',
        userName: 'Rahul Sharma',
        location: { address: 'Sector 62, Noida' },
        status: 'active',
        severity: 'critical',
        petDetails: { name: 'Buddy', species: 'Dog' },
        timestamp: new Date()
      }]);
    }
    const alerts = await SOSAlert.find({ status: { $ne: 'resolved' } }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. DASHBOARD: Respond to alert
router.post('/respond/:id', async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id, 
      { status: 'responding', responderId: req.body.responderId },
      { new: true }
    );
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
