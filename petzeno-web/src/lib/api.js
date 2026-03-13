// Professional API layer for PetZeno Dashboard
// Connects the frontend to the Node.js Express Backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetcher for collection data
 */
export async function getMockData(collectionName) {
  try {
    const response = await fetch(`${API_URL}/${collectionName}`);
    if (!response.ok) throw new Error(`Backend fetch failed for ${collectionName}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${collectionName}:`, err);
    return [];
  }
}

/**
 * Community Posts
 */
export const getCommunityPosts = async (category, userType) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (userType) params.append('userType', userType);
  const url = `${API_URL}/community${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
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

/**
 * Listings (Adoption / LostFound)
 */
export const getListings = async (type, businessId) => {
  let url = `${API_URL}/listings`;
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (businessId) params.append('businessId', businessId);
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await fetch(url);
  return await response.json();
};

export const createListing = async (listingData) => {
  const response = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  return await response.json();
};

export const updateListing = async (id, listingData) => {
  const response = await fetch(`${API_URL}/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  return await response.json();
};

export const deleteListing = async (id) => {
  const response = await fetch(`${API_URL}/listings/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};

/**
 * Authentication
 */
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

/**
 * Store Products & Inventory
 */
export const getProducts = async (businessId) => {
  const response = await fetch(`${API_URL}/products${businessId ? `?businessId=${businessId}` : ''}`);
  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};

/**
 * Orders
 */
export const getOrders = async (businessId) => {
  const response = await fetch(`${API_URL}/orders${businessId ? `?businessId=${businessId}` : ''}`);
  return await response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return await response.json();
};

export const updateProfile = async (id, userData) => {
  const response = await fetch(`${API_URL}/auth/profile/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (data.success && data.user) {
    // Sync local session
    const currentUser = getCurrentUser();
    localStorage.setItem('petzeno_user', JSON.stringify({ ...currentUser, ...data.user }));
  }
  return data;
};

/**
 * Safe Session Management
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('petzeno_user');
    if (!userStr || userStr === 'undefined') return null;
    return JSON.parse(userStr);
  } catch (err) {
    console.error('Session parse error:', err);
    return null;
  }
};
