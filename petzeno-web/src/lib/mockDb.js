// A mock implementation of Firestore to run the app without actual Firebase (to bypass Credit Card / Blaze Plan requirement)

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

export const getMockData = (collectionName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB[collectionName] || []);
    }, 500); // Simulate network delay
  });
};

export const addMockData = (collectionName, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = { id: Date.now().toString(), ...data };
      if (!MOCK_DB[collectionName]) MOCK_DB[collectionName] = [];
      MOCK_DB[collectionName].push(newItem);
      resolve(newItem);
    }, 500);
  });
};
