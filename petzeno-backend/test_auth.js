const { MOCK_FALLBACK } = require('./routes/apiRoutes');
const email = 'vet@petzeno.com';
const role = 'vet';
const user = MOCK_FALLBACK.users.find(u => u.email === email && u.role === role);
console.log('Test User Found:', user ? user.name : 'NOT FOUND');
if (user && user.password === 'password123') {
  console.log('Auth Logic: SUCCESS');
} else {
  console.log('Auth Logic: FAILED');
}
