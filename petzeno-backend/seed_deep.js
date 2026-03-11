const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Shelter = require('./models/Shelter');
const Store = require('./models/Store');
const SOSAlert = require('./models/SOSAlert');
const Listing = require('./models/Listing');
const Appointment = require('./models/Appointment');
const Order = require('./models/Order');
const AdoptionApplication = require('./models/AdoptionApplication');
const CommunityPost = require('./models/CommunityPost');

const VET_ID = "65f1234567890abcdef12345";
const STORE_ID = "65f1234567890abcdef67890";
const SHELTER_ID = "65f1234567890abcdef99999";

const SEED_DATA = {
  users: [
    { _id: VET_ID, email: 'vet@petzeno.com', password: 'password123', name: 'Dr. Jane Smith', role: 'vet', status: 'verified', businessName: 'Global Vet Clinic' },
    { _id: SHELTER_ID, email: 'shelter@petzeno.com', password: 'password123', name: 'Mike Ross', role: 'shelter', status: 'verified', businessName: 'Happy Paws Shelter' },
    { _id: STORE_ID, email: 'store@petzeno.com', password: 'password123', name: 'Linda Chen', role: 'store', status: 'verified', businessName: 'Pet Mart' },
  ],
  clinics: [
    { name: 'Global Vet Clinic', location: 'Noida Sector 62', patientsToday: 12, rating: 4.8, type: 'Multispeciality' }
  ],
  listings: [
    { type: 'adoption', name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: '2 yrs', location: 'Happy Paws Shelter', status: 'Available', imageUrl: '🐕', businessId: SHELTER_ID, businessName: 'Happy Paws Shelter' },
    { type: 'adoption', name: 'Luna', species: 'Cat', breed: 'Persian', age: '1 yr', location: 'Happy Paws Shelter', status: 'Available', imageUrl: '🐈', businessId: SHELTER_ID, businessName: 'Happy Paws Shelter' },
  ],
  appointments: [
    { userId: 'dev_user_123', petId: 'pet_001', petName: 'Bruno', businessId: VET_ID, businessName: 'Global Vet Clinic', date: '2026-03-24', time: '10:30', type: 'Vaccination', status: 'upcoming', notes: 'Boosters needed' }
  ],
  orders: [
    { userId: 'dev_user_123', businessId: STORE_ID, totalAmount: 1249, status: 'pending', shippingAddress: '123 Tech Park, Noida', items: [{ name: 'Premium Dog Food', quantity: 1, price: 1249 }] }
  ],
  applications: [
    { listingId: new mongoose.Types.ObjectId(), shelterId: SHELTER_ID, userId: 'dev_user_123', userName: 'Rahul', petName: 'Max', status: 'pending', message: 'I love Golden Retrievers!' }
  ],
  sos: [
    { userId: 'user_001', userName: 'Rahul', location: { address: 'Tech Park, Noida' }, status: 'active', severity: 'critical', petDetails: { name: 'Bruno', species: 'Dog' } }
  ]
};

async function seedDeepIntegration() {
  try {
    console.log('Connecting to MongoDB Atlas for Deep Integration Seed...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('CONNECTED!');

    // Clear all
    await Promise.all([
      User.deleteMany({}),
      Clinic.deleteMany({}),
      Shelter.deleteMany({}),
      Store.deleteMany({}),
      SOSAlert.deleteMany({}),
      Listing.deleteMany({}),
      Appointment.deleteMany({}),
      Order.deleteMany({}),
      AdoptionApplication.deleteMany({}),
      CommunityPost.deleteMany({})
    ]);

    // Insert
    await User.insertMany(SEED_DATA.users);
    await Clinic.insertMany(SEED_DATA.clinics);
    await Listing.insertMany(SEED_DATA.listings);
    await Appointment.insertMany(SEED_DATA.appointments);
    await Order.insertMany(SEED_DATA.orders);
    await SOSAlert.insertMany(SEED_DATA.sos);

    console.log('DEEP PRODUCTION SEED COMPLETE! 🚀🏆💎');
    process.exit(0);
  } catch (err) {
    console.error('SEED FAILED:', err.message);
    process.exit(1);
  }
}

seedDeepIntegration();
