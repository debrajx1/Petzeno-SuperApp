import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Activity,
  History,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { getCurrentUser } from '../lib/api';
import styles from './Clinics.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const SOSCard = ({ alert, onRespond }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={styles.sosCard}
  >
    <div className={styles.sosHeader}>
      <div className={styles.sosType}>
        <div className="radar-pulse" style={{ width: '8px', height: '8px' }}></div>
        <span>CRITICAL SOS</span>
      </div>
      <span className={styles.sosTime}>{format(new Date(), 'HH:mm')}</span>
    </div>
    <div className={styles.sosUser}>
      <div className={styles.userAvatar}>👤</div>
      <div className={styles.userInfo}>
        <h4>{alert.userName}</h4>
        <p>{alert.petDetails?.name || 'Unknown Pet'} • {alert.petDetails?.species || 'Pet'}</p>
      </div>
    </div>
    <div className={styles.sosLocation}>
      <MapPin size={14} />
      <span>{alert.location?.address || 'Geolocation Pending'}</span>
    </div>
    <button 
      className={styles.respondBtn} 
      onClick={() => onRespond(alert._id)}
      disabled={alert.status === 'responding'}
    >
      {alert.status === 'responding' ? 'RESPONDER ASSIGNED' : 'INITIATE RESCUE'}
    </button>
  </motion.div>
);

export default function Clinics({ defaultTab }) {
  const user = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState(defaultTab || 'Overview');
  const [appointments, setAppointments] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [appRes, sosRes] = await Promise.all([
        fetch(`${API_BASE}/appointments${user.role !== 'admin' ? `?businessId=${user.id}` : ''}`),
        fetch(`${API_BASE}/sos/active`)
      ]);

      const appData = await appRes.json();
      const sosData = await sosRes.json();

      setAppointments(Array.isArray(appData) ? appData : []);
      setSosAlerts(Array.isArray(sosData) ? sosData : []);
    } catch (err) {
      console.error('Vet data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRespond = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sos/respond/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responderId: user.id })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Response failed:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <motion.div 
      className={styles.clinicContainer}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Veterinary Hub</h1>
          <p className={styles.pageSubtext}>Real-time emergency monitoring and health logistics.</p>
        </div>
        {/* Header actions removed for cleaner look */}
      </motion.header>

      <div className={styles.dashboardGrid}>
        <motion.div variants={item} className={styles.mainContent}>
          <div className={styles.tabsContainer}>
            {['Overview', 'Appointments', 'Patients'].map(tab => (
              <button 
                key={tab} 
                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Schedule</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <motion.tbody>
                {activeTab === 'Appointments' ? (
                  appointments.length === 0 ? (
                    <tr><td colSpan="5" className={styles.emptyTable}>No pending appointments found.</td></tr>
                  ) : appointments.map((apt, idx) => (
                    <motion.tr 
                      key={apt._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td>
                        <div className={styles.patientCell}>
                          <div className={styles.patientAvatar}>🐶</div>
                          <div>
                            <p className={styles.petName}>{apt.petName}</p>
                            <p className={styles.ownerName}>Verified Client</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.timeCell}>
                          <span><Calendar size={14} style={{ opacity: 0.6 }} /> {apt.date}</span>
                          <span><Clock size={14} style={{ opacity: 0.6 }} /> {apt.time}</span>
                        </div>
                      </td>
                      <td><span className={styles.reasonBadge}>{apt.notes || 'General Checkup'}</span></td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          {apt.status === 'upcoming' && (
                            <button onClick={() => handleStatusUpdate(apt._id, 'confirmed')} className={styles.confirmBtn}>Confirm</button>
                          )}
                          <button className={styles.moreBtn}><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : activeTab === 'Patients' ? (
                  // Mock Patient Records for "Vet Records" view
                  [
                    { id: 1, name: 'Buddy', species: 'Golden Retriever', lastVisit: '2023-10-25', status: 'Stable' },
                    { id: 2, name: 'Luna', species: 'Persian Cat', lastVisit: '2023-10-20', status: 'Recovering' },
                    { id: 3, name: 'Max', species: 'German Shepherd', lastVisit: '2023-10-15', status: 'Critical' }
                  ].map((p, idx) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td>
                        <div className={styles.patientCell}>
                          <div className={styles.patientAvatar}>{p.species.includes('Cat') ? '🐱' : '🐶'}</div>
                          <div>
                            <p className={styles.petName}>{p.name}</p>
                            <p className={styles.ownerName}>{p.species}</p>
                          </div>
                        </div>
                      </td>
                      <td>{p.lastVisit}</td>
                      <td>Record Sync Active</td>
                      <td>
                        <span className={`${styles.statusBadge} ${p.status === 'Critical' ? styles.pending : styles.confirmed}`}>
                          {p.status}
                        </span>
                      </td>
                      <td><button className={styles.moreBtn}><History size={16} /></button></td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyTable}>
                      <div className={styles.overviewSummary}>
                        <h3>Hub Performance Nominal</h3>
                        <p>You have {appointments.length} appointments today and {sosAlerts.length} live emergency frequencies tracked.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </motion.div>

        <motion.aside variants={item} className={styles.sidebar}>
          <div className={styles.emergencySection}>
            <div className={styles.sectionHeader}>
            <h3>
              <ShieldAlert size={18} />
              Emergency Monitor
            </h3>
            <div className="radar-pulse"></div>
          </div>
          
          <div className={styles.sosList}>
            <AnimatePresence mode="popLayout">
              {sosAlerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.placeholderState}
                >
                  <Activity size={48} color="var(--color-success)" opacity={0.3} />
                  <p>Status Nominal. <br/>Monitoring live frequencies...</p>
                </motion.div>
              ) : sosAlerts.map(alert => (
                <SOSCard key={alert._id} alert={alert} onRespond={handleRespond} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
      </div>
    </motion.div>
  );
}
