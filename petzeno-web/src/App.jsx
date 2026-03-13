import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Clinics from './pages/Clinics';
import Shelters from './pages/Shelters';
import Stores from './pages/Stores';
import Community from './pages/Community';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminRequests from './pages/AdminRequests';
import Settings from './pages/Settings';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes - Protected (Simulated Verified Access) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="clinics" element={<Clinics defaultTab="Patients" />} />
          <Route path="appointments" element={<Clinics defaultTab="Appointments" />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="stores" element={<Stores />} />
          <Route path="orders" element={<Stores defaultTab="Orders" />} />
          <Route path="community" element={<Community />} />
          <Route path="admin-requests" element={<AdminRequests />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
