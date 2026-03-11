import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Calendar, Clock, Plus, CheckCircle, XCircle } from 'lucide-react';
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
    // In a real app this would fetch "appointments", for mock DB we'll just use the static list for clinics tab
    // since the mock DB currently only holds clinics, shelters, and stores metadata.
    // Let's pretend we fetched this:
    setTimeout(() => {
      setAppointments(appointmentsData);
      setLoading(false);
    }, 600);
  }, []);

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
                          {apt.status === 'Confirmed' && <CheckCircle size={12} />}
                          {apt.status === 'Pending' && <Clock size={12} />}
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.iconAction}><MoreVertical size={18} /></button>
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
