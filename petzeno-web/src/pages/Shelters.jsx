import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Heart, MapPin, Bone, Phone } from 'lucide-react';
import { getListings } from '../lib/mockDb';
import styles from './Shelters.module.css';

export default function Shelters() {
  const [activeTab, setActiveTab] = useState('Available Pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Pets
        const petRes = await fetch('http://localhost:5000/api/listings?type=adoption');
        if (petRes.ok) setPets(await petRes.json());

        // Fetch Applications
        const appRes = await fetch('http://localhost:5000/api/adoptions/applications');
        if (appRes.ok) setApplications(await appRes.json());

      } catch (err) {
        console.error('Error fetching shelter data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReviewApp = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/adoptions/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      }
    } catch (err) {
      console.error('App review failed:', err);
    }
  };

  return (
    <div className={styles.shelterContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Adoption & Shelters</h1>
          <p className={styles.pageSubtext}>Manage pet listings, adoption applications, and shelter capacity.</p>
        </div>
        <button className={styles.primaryAction}>
          <Heart size={18} />
          Add New Pet
        </button>
      </header>

      <div className={styles.tabsContainer}>
        {['Available Pets', 'Applications', 'Shelter Capacity'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search pets by name, breed, or ID..." className={styles.searchInput} />
        </div>
        <div className={styles.filterGroup}>
          <button className={styles.filterBtn}>
            <MapPin size={18} />
            All Locations
          </button>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {activeTab === 'Available Pets' && (
        <div className={styles.petsGrid}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Loading pets...</div>
          ) : pets.map(pet => (
            <div key={pet._id || pet.id} className={`${styles.petCard} glass-effect`}>
              <div className={styles.petImagePlaceholder}>
                <span className={styles.emoji}>{pet.imageUrl || pet.image}</span>
                <span className={`${styles.statusBadge} ${styles[pet.status.replace(/\s+/g, '').toLowerCase()]}`}>
                  {pet.status}
                </span>
              </div>
              <div className={styles.petInfo}>
                <div className={styles.petHeader}>
                  <h3 className={styles.petName}>{pet.name}</h3>
                  <span className={styles.petType}>{pet.type}</span>
                </div>
                <div className={styles.petDetails}>
                  <p><Bone size={14} /> {pet.breed} • {pet.age}</p>
                  <p><MapPin size={14} /> {pet.location}</p>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.secondaryBtn}>View Profile</button>
                  {pet.status === 'Available' && (
                    <button className={styles.primaryBtn}>Review Apps</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Applications' && (
        <div className={styles.tableWrapper} style={{ backgroundColor: 'transparent', padding: 0 }}>
          <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px' }}>Applicant</th>
                <th style={{ padding: '12px' }}>Pet Name</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No applications received yet.</td></tr>
              ) : applications.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600' }}>{app.userName}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{app.userEmail}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{app.petName}</td>
                  <td style={{ padding: '12px' }}>{app.userPhone}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`${styles.statusBadge} ${styles[app.status.toLowerCase()]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {app.status === 'pending' && (
                        <button 
                          className={styles.secondaryBtn}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          onClick={() => handleReviewApp(app._id, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      <button className={styles.textLink}>Review</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab !== 'Available Pets' && activeTab !== 'Applications' && (
        <div className={`${styles.placeholderContent} glass-effect`}>
          <p>{activeTab} module is currently under development.</p>
        </div>
      )}
    </div>
  );
}
