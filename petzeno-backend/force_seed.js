const mongoose = require('mongoose');
require('dotenv').config();

const MOCK_USERS = [
  { email: 'vet@petzeno.com', password: 'password123', name: 'Dr. Sarah Jenkins', role: 'vet', status: 'verified', businessName: 'City Pet Hospital' },
  { email: 'shelter@petzeno.com', password: 'password123', name: 'Mark Wilson', role: 'shelter', status: 'verified', businessName: 'Happy Paws Rescue' },
  { email: 'store@petzeno.com', password: 'password123', name: 'John Doe', role: 'store', status: 'verified', businessName: 'Pet Superstore' },
  { email: 'admin@petzeno.com', password: 'password123', name: 'Super Admin', role: 'admin', status: 'verified' },
];

async function seed() {
  console.log('Attempting to connect to:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED TO ATLAS!');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      status: String,
      businessName: String
    }));

    await User.deleteMany({});
    await User.create(MOCK_USERS);
    
    console.log('SUCCESS: Seeded 4 Production Accounts into Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION FAILED:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n--- DIAGNOSIS ---');
      console.log('1. This is a network-level block (common in corporate/college WiFi).');
      console.log('2. Your ISP is blocking the MongoDB Atlas DNS/Port.');
      console.log('3. WORKAROUND: Try using a mobile hotspot or a different network.');
    }
    process.exit(1);
  }
}

seed();
