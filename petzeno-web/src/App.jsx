import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Clinics from './pages/Clinics';
import Shelters from './pages/Shelters';
import Stores from './pages/Stores';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="clinics" element={<Clinics />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="stores" element={<Stores />} />
          <Route path="community" element={<Community />} />
          <Route path="*" element={<Overview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
