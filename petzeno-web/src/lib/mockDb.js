// A mock implementation of Firestore to run the app without 
// This was a mock database layer for the hackathon
// Now it's a proxy that fetches data from our real Node.js Express Backend
const API_URL = 'https://petzeno-backend.onrender.com/api';

export async function getMockData(collectionName) {
  try {
    const response = await fetch(`${API_URL}/${collectionName}`);
    if (!response.ok) throw new Error('Backend fetch failed');
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${collectionName}:`, err);
    return [];
  }
}

// Community Posts
export const getCommunityPosts = async () => {
  const response = await fetch(`${API_URL}/community`);
  return await response.json();
};

export const createCommunityPost = async (postData) => {
  const response = await fetch(`${API_URL}/community`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return await response.json();
};

// Listings (Adoption / LostFound)
export const getListings = async (type) => {
  const response = await fetch(`${API_URL}/listings${type ? `?type=${type}` : ''}`);
  return await response.json();
};

// Auth
export const loginProvider = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

export const requestAccess = async (requestData) => {
  const response = await fetch(`${API_URL}/auth/register-interest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  return await response.json();
};
