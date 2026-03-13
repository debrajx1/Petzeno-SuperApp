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
import { format } from 'date-fns';
import { getCurrentUser } from '../lib/api';
import styles from './Clinics.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const SOSCard = ({ alert, onRespond }) => (
  <div className={`${styles.sosCard} ${styles[alert.severity || 'high']} glass-effect`}>
    <div className={styles.sosHeader}>
      <div className={styles.sosType}>
        <AlertCircle size={18} />
        <span>CRITICAL SOS</span>
      </div>
      <span className={styles.sosTime}>{format(new Date(), 'HH:mm')}</span>
    </div>
    <div className={styles.sosUser}>
      <div className={styles.userAvatar}>👤</div>
      <div className={styles.userInfo}>
        <h4>{alert.userName}</h4>
        <p>{alert.petDetails?.name} • {alert.petDetails?.species}</p>
      </div>
    </div>
    <div className={styles.sosLocation}>
      <MapPin size={14} />
      <span>{alert.location?.address || 'Near Sector 62, Noida'}</span>
    </div>
    <div className={styles.sosActions}>
      <button 
        className={styles.respondBtn} 
        onClick={() => onRespond(alert._id)}
        disabled={alert.status === 'responding'}
      >
        {alert.status === 'responding' ? 'RESPONDING...' : 'TAKE ACTION'}
      </button>
    </div>
  </div>
);

export default function Clinics() {
  const user = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState('Overview');
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
    <div className={styles.clinicContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>Veterinary Hub</h1>
          <p className={styles.pageSubtext}>Real-time emergency monitoring and patient management.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryAction}>
            <Plus size={18} />
            <span>Schedule New</span>
          </button>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainContent}>
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
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="5" className={styles.emptyTable}>No pending appointments found.</td></tr>
                ) : appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>
                      <div className={styles.patientCell}>
                        <div className={styles.patientAvatar}>🐶</div>
                        <div>
                          <p className={styles.petName}>{apt.petName}</p>
                          <p className={styles.ownerName}>Mobile User</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.timeCell}>
                        <span><Calendar size={12} /> {apt.date}</span>
                        <span><Clock size={12} /> {apt.time}</span>
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
                        {apt.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(apt._id, 'completed')} className={styles.completeBtn}>Finish</button>
                        )}
                        <button className={styles.moreBtn}><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.emergencySection}>
            <div className={styles.sectionHeader}>
            <h3>
              <ShieldAlert size={18} />
              Live SOS Monitor
            </h3>
            <span className={styles.livePulse}></span>
          </div>
          
          <div className={styles.sosList}>
            {sosAlerts.length === 0 ? (
              <div className={styles.placeholderState}>
                <Activity size={48} opacity={0.2} />
                <p>Status Green: No Active Emergencies</p>
              </div>
            ) : sosAlerts.map(alert => (
              <SOSCard key={alert._id} alert={alert} onRespond={handleRespond} />
            ))}
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}
