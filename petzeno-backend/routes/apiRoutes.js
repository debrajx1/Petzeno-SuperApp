const express = require('express');
const router = express.Router();

// Mock Data from Web Dashboard to serve via API
const MOCK_DB = {
  clinics: [
    { id: '1', name: 'City Pet Hospital', doctor: 'Dr. Sarah Jenkins', status: 'Open', patientsToday: 12 },
    { id: '2', name: 'Downtown Vet Clinic', doctor: 'Dr. Mark Lee', status: 'Closed', patientsToday: 0 },
  ],
  shelters: [
    { id: '1', name: 'Happy Paws Rescue', location: 'North District', availablePets: 24, recentAdoptions: 3 },
    { id: '2', name: 'Safe Haven Shelters', location: 'East Side', availablePets: 15, recentAdoptions: 1 },
  ],
  stores: [
    { id: '1', name: 'Pet Superstore', manager: 'John Doe', lowStockItems: 5, totalOrders: 142 },
    { id: '2', name: 'Healthy Tails Supplies', manager: 'Jane Smith', lowStockItems: 0, totalOrders: 89 },
  ]
};

// Get Clinics
router.get('/clinics', (req, res) => {
  // In future: Replace with Mongoose Model.find()
  res.json(MOCK_DB.clinics);
});

// Get Shelters
router.get('/shelters', (req, res) => {
  res.json(MOCK_DB.shelters);
});

// Get Stores
router.get('/stores', (req, res) => {
  res.json(MOCK_DB.stores);
});

module.exports = router;
