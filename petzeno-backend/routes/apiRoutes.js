const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const Shelter = require('../models/Shelter');
const Store = require('../models/Store');
const CommunityPost = require('../models/CommunityPost');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const AdoptionApplication = require('../models/AdoptionApplication');
const mongoose = require('mongoose');

// In-memory persistent storage for session when DB is down
const IN_MEMORY_DB = {
  community: [],
  listings: []
};

const MOCK_FALLBACK = {
  users: [
    { email: 'vet@petzeno.com', password: 'password123', name: 'Dr. Sarah Jenkins', role: 'vet', status: 'verified', businessName: 'City Pet Hospital' },
    { email: 'shelter@petzeno.com', password: 'password123', name: 'Mark Wilson', role: 'shelter', status: 'verified', businessName: 'Happy Paws Rescue' },
    { email: 'store@petzeno.com', password: 'password123', name: 'John Doe', role: 'store', status: 'verified', businessName: 'Pet Superstore' },
    { email: 'admin@petzeno.com', password: 'password123', name: 'Super Admin', role: 'admin', status: 'verified' },
  ],
  clinics: [
    { name: 'City Pet Hospital', doctor: 'Dr. Sarah Jenkins', status: 'Open', patientsToday: 12 },
    { name: 'Downtown Vet Clinic', doctor: 'Dr. Mark Lee', status: 'Closed', patientsToday: 0 },
  ],
  shelters: [
    { name: 'Happy Paws Rescue', location: 'North District', availablePets: 24, recentAdoptions: 3 },
    { name: 'Safe Haven Shelters', location: 'East Side', availablePets: 15, recentAdoptions: 1 },
  ],
  stores: [
    { name: 'Pet Superstore', manager: 'John Doe', lowStockItems: 5, totalOrders: 142 },
    { name: 'Healthy Tails Supplies', manager: 'Jane Smith', lowStockItems: 0, totalOrders: 89 },
  ],
  community: [
    { authorId: 'user_001', author: 'Jane Cooper', petName: 'Max', text: 'My Golden Retriever Max just completed his basic obedience training! So proud of him. 🐕', likes: ['user_002'], authorAvatar: '👩‍💼' },
    { authorId: 'user_002', author: 'Mark Wilson', petName: 'Luna', text: 'Looking for a dog-friendly cafe in Noida. Any suggestions? ☕', likes: [], authorAvatar: '👨‍🎨' }
  ],
  listings: [
    { type: 'adoption', name: 'Bella', species: 'Dog', breed: 'Golden Retriever', age: '2 yrs', location: 'City Center Shelter', status: 'Available', imageUrl: '🐶' },
    { type: 'lost-found', name: 'Unknown Cat', species: 'Cat', breed: 'Siamese Mix', location: 'Sector 62', status: 'Found', description: 'Very friendly cat found near the park.' }
  ]
};

// Get Clinics
router.get('/clinics', async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.json(clinics.length > 0 ? clinics : MOCK_FALLBACK.clinics);
  } catch (err) {
    res.json(MOCK_FALLBACK.clinics);
  }
});

// Get Shelters
router.get('/shelters', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters.length > 0 ? shelters : MOCK_FALLBACK.shelters);
  } catch (err) {
    res.json(MOCK_FALLBACK.shelters);
  }
});

// Get Stores
router.get('/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores.length > 0 ? stores : MOCK_FALLBACK.stores);
  } catch (err) {
    res.json(MOCK_FALLBACK.stores);
  }
});

// Get Community Posts
router.get('/community', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let posts = isConnected ? await CommunityPost.find().sort({ createdAt: -1 }) : [];
    
    // Fallback or Merge
    const allPosts = posts.length > 0 ? posts : [...IN_MEMORY_DB.community, ...MOCK_FALLBACK.community];
    res.json(allPosts);
  } catch (err) {
    res.json([...IN_MEMORY_DB.community, ...MOCK_FALLBACK.community]);
  }
});

// Post to Community
router.post('/community', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let newPost;
    if (isConnected) {
      newPost = await CommunityPost.create(req.body);
    } else {
      newPost = { ...req.body, _id: 'mem_' + Date.now(), createdAt: new Date() };
      IN_MEMORY_DB.community.unshift(newPost);
      console.log('DB Down: Saved post to In-Memory DB');
    }
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Listings (Adoption / LostFound)
router.get('/listings', async (req, res) => {
  const { type } = req.query;
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let listings = isConnected ? await Listing.find(type ? { type } : {}) : [];
    
    const fallbackListings = [...IN_MEMORY_DB.listings, ...MOCK_FALLBACK.listings];
    const finalResult = listings.length > 0 ? listings : fallbackListings;
    
    res.json(type ? finalResult.filter(l => l.type === type) : finalResult);
  } catch (err) {
    const fallback = [...IN_MEMORY_DB.listings, ...MOCK_FALLBACK.listings];
    res.json(type ? fallback.filter(l => l.type === type) : fallback);
  }
});

// Create Listing
router.post('/listings', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let newListing;
    if (isConnected) {
      newListing = await Listing.create(req.body);
    } else {
      newListing = { ...req.body, _id: 'mem_list_' + Date.now(), createdAt: new Date() };
      IN_MEMORY_DB.listings.unshift(newListing);
      console.log('DB Down: Saved listing to In-Memory DB');
    }
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- APPOINTMENTS (VET) ---

// Create Appointment (Mobile)
router.post('/appointments', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) return res.status(503).json({ message: 'DB not connected' });
    
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Appointments (Dashboard / Mobile)
router.get('/appointments', async (req, res) => {
  const { businessId, userId } = req.query;
  try {
    const query = {};
    if (businessId) query.businessId = businessId;
    if (userId) query.userId = userId;

    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Status (Dashboard)
router.patch('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ORDERS (STORE) ---

// Create Order (Mobile)
router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Orders (Dashboard)
router.get('/orders', async (req, res) => {
  const { businessId } = req.query;
  try {
    const orders = await Order.find(businessId ? { businessId } : {}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Order Status (Dashboard)
router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- ADOPTIONS (SHELTER) ---

// Apply for Adoption (Mobile)
router.post('/adoptions/apply', async (req, res) => {
  try {
    const application = await AdoptionApplication.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Applications (Dashboard)
router.get('/adoptions/applications', async (req, res) => {
  const { shelterId } = req.query;
  try {
    const apps = await AdoptionApplication.find(shelterId ? { shelterId } : {}).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update Application Status (Dashboard)
router.patch('/adoptions/applications/:id', async (req, res) => {
  try {
    const app = await AdoptionApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Seed Data Route
router.get('/seed', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const dbUri = process.env.MONGODB_URI || 'not-set';
  const maskedUri = dbUri.replace(/:([^@]+)@/, ':****@');

  if (!isConnected) {
    console.warn('Seed failed: Not connected to MongoDB.');
    return res.status(503).json({ 
      success: false, 
      message: 'Database not connected. Check your Atlas IP Whitelist and MONGODB_URI.',
      connectionStatus: 'disconnected',
      uri: maskedUri
    });
  }

  try {
    console.log('Seeding real MongoDB Atlas...');
    await Clinic.deleteMany({});
    await Shelter.deleteMany({});
    await Store.deleteMany({});
    await CommunityPost.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    await Clinic.create(MOCK_FALLBACK.clinics);
    await Shelter.create(MOCK_FALLBACK.shelters);
    await Store.create(MOCK_FALLBACK.stores);
    await CommunityPost.create(MOCK_FALLBACK.community);
    await Listing.create(MOCK_FALLBACK.listings);
    await User.create(MOCK_FALLBACK.users);

    res.json({ success: true, message: 'Full database seeded successfully in Atlas!' });
  } catch (err) {
    console.error('Seed Error:', err.message);
    res.status(500).json({ success: false, message: 'Seed failed: ' + err.message });
  }
});


module.exports = { router, MOCK_FALLBACK, IN_MEMORY_DB };
