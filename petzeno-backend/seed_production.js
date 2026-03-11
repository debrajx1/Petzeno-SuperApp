const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Shelter = require('./models/Shelter');
const Store = require('./models/Store');
const SOSAlert = require('./models/SOSAlert');

const SEED_DATA = {
  users: [
    { email: 'vet@petzeno.com', password: 'password123', name: 'Dr. Jane Smith', role: 'vet', status: 'verified', businessName: 'Global Vet Clinic' },
    { email: 'shelter@petzeno.com', password: 'password123', name: 'Mike Ross', role: 'shelter', status: 'verified', businessName: 'Happy Paws Shelter' },
    { email: 'store@petzeno.com', password: 'password123', name: 'Linda Chen', role: 'store', status: 'verified', businessName: 'Pet Mart' },
  ],
  clinics: [
    { name: 'Global Vet Clinic', location: 'Noida Sector 62', patientsToday: 12, rating: 4.8, type: 'Multispeciality' },
    { name: 'City Pet Care', location: 'Indirapuram', patientsToday: 8, rating: 4.5, type: 'Emergency' }
  ],
  sos: [
    { userId: 'user_001', userName: 'Rahul', location: { address: 'Tech Park, Bangalore' }, status: 'active', severity: 'critical', petDetails: { name: 'Max', species: 'Dog' } }
  ]
};

async function seedProduction() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED! Seeding production-ready data...');

    // Clear existing
    await User.deleteMany({ email: { $in: SEED_DATA.users.map(u => u.email) } });
    await Clinic.deleteMany({});
    await SOSAlert.deleteMany({});

    // Seed
    await User.insertMany(SEED_DATA.users);
    await Clinic.insertMany(SEED_DATA.clinics);
    await SOSAlert.insertMany(SEED_DATA.sos);

    console.log('PRODUCTION SEED COMPLETE! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('SEED FAILED:', err.message);
    process.exit(1);
  }
}

seedProduction();
