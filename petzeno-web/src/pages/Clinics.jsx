import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users, Calendar, Clock, MapPin, CheckCircle, MoreVertical } from 'lucide-react';
import { getMockData } from '../lib/mockDb';
import { format } from 'date-fns';
import styles from './Clinics.module.css';

const appointmentsData = [
  { id: 'APT-1001', petName: 'Max', species: 'Dog', owner: 'Sarah Connor', date: new Date(2023, 9, 24, 10, 30), reason: 'Vaccination', status: 'Pending', doc: 'Dr. Jane Smith' },
  { id: 'APT-1002', petName: 'Luna', species: 'Cat', owner: 'John Wick', date: new Date(2023, 9, 24, 11, 0), reason: 'General Checkup', status: 'Confirmed', doc: 'Dr. Alan Grant' },
  { id: 'APT-1003', petName: 'Charlie', species: 'Dog', owner: 'Emily Blunt', date: new Date(2023, 9, 24, 13, 15), reason: 'Dental Cleaning', status: 'Confirmed', doc: 'Dr. Jane Smith' },
  { id: 'APT-1004', petName: 'Bella', species: 'Rabbit', owner: 'Peter Parker', date: new Date(2023, 9, 24, 14, 45), reason: 'Skin Allergy', status: 'Pending', doc: 'Dr. Alan Grant' },
  { id: 'APT-1005', petName: 'Rocky', species: 'Dog', owner: 'Bruce Wayne', date: new Date(2023, 9, 25, 9, 0), reason: 'Surgery Follow-up', status: 'Completed', doc: 'Dr. Jane Smith' },
];

export default function Clinics() {
  const [activeTab, setActiveTab] = useState('Appointments');
  const [appointments, setAppointments] = useState(appointmentsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments');
        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match table format
          const transformed = data.map(apt => ({
            id: apt._id,
            petName: apt.petName,
            species: 'Dog', // Defaulting to Dog for now as per schema
            owner: 'Mobile User',
            date: new Date(`${apt.date}T${apt.time}:00`),
            reason: apt.notes || apt.type,
            status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1), // Capitalize
            doc: 'Dr. Jane Smith'
          }));
          if (transformed.length > 0) setAppointments(transformed);
        }
      } catch (err) {
        console.log('Using local appointment data');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 10000); // Polling for real-time
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) } : a));
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className={styles.clinicsContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clinic Management</h1>
          <p className={styles.pageSubtext}>Manage your veterinary appointments and doctor schedules.</p>
        </div>
        <button className={styles.primaryAction}>
          <Plus size={18} />
          New Appointment
        </button>
      </header>

      <div className={styles.tabsContainer}>
        {['Appointments', 'Doctors', 'Health Cards'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={`${styles.contentArea} glass-effect`}>
        {activeTab === 'Appointments' && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search by pet or owner name..." className={styles.searchInput} />
              </div>
              <button className={styles.filterBtn}>
                <Filter size={18} />
                Filter
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading appointments...</td></tr>
                  ) : appointments.map(apt => (
                    <tr key={apt.id}>
                      <td className={styles.aptId}>{apt.id}</td>
                      <td>
                        <div className={styles.patientInfo}>
                          <span className={styles.petName}>{apt.petName}</span>
                          <span className={styles.species}>{apt.species} • {apt.owner}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.dateTime}>
                          <span className={styles.date}><Calendar size={14} />{format(apt.date, 'MMM dd, yyyy')}</span>
                          <span className={styles.time}><Clock size={14} />{format(apt.date, 'hh:mm a')}</span>
                        </div>
                      </td>
                      <td>{apt.reason}</td>
                      <td>{apt.doc}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[apt.status.toLowerCase()]}`}>
                          {(apt.status === 'Confirmed' || apt.status === 'Upcoming') && <CheckCircle size={12} />}
                          {apt.status === 'Pending' && <Clock size={12} />}
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {apt.status === 'Upcoming' && (
                            <button 
                              className={styles.secondaryBtn}
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                            >
                              Confirm
                            </button>
                          )}
                          <button className={styles.iconAction}><MoreVertical size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab !== 'Appointments' && (
          <div className={styles.placeholderContent}>
            <p>{activeTab} module is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
