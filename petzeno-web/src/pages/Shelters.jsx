import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  MapPin, 
  Bone, 
  Phone, 
  Mail, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  X,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getListings, createListing, updateListing, deleteListing, getMockData, getCurrentUser } from '../lib/api';
import styles from './Shelters.module.css';

export default function Shelters() {
  const user = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState('Available Pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  
  // Form State
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    location: '',
    description: '',
    status: 'Available',
    imageUrl: '🐶'
  });

  useEffect(() => {
    fetchData();
  }, [user.id, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Available Pets') {
        const data = await getListings('adoption', user.id);
        setPets(Array.isArray(data) ? data : []);
      } else if (activeTab === 'Applications') {
        const data = await getMockData('adoptions/applications');
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    const data = { ...petForm, type: 'adoption', businessId: user.id, businessName: user.businessName };
    try {
      if (editingPet) {
        await updateListing(editingPet._id, data);
      } else {
        await createListing(data);
      }
      setShowPetModal(false);
      setEditingPet(null);
      setPetForm({ name: '', species: 'Dog', breed: '', age: '', location: '', description: '', status: 'Available', imageUrl: '🐶' });
      fetchData();
    } catch (err) {
      console.error('Pet save failed:', err);
    }
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Remove this pet from listings?')) {
      try {
        await deleteListing(id);
        fetchData();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleReviewApp = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/adoptions/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('App review failed:', err);
    }
  };

  return (
    <div className={styles.shelterContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Adoption Center</h1>
          <p className={styles.pageSubtext}>Find forever homes for your rescued pets and manage applications.</p>
        </div>
        <button className={styles.primaryAction} onClick={() => { setEditingPet(null); setShowPetModal(true); }}>
          <Heart size={18} fill="currentColor" />
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

      {activeTab === 'Available Pets' && (
        <>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Search by name, breed or ID..." className={styles.searchInput} />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              Filters
            </button>
          </div>

          <div className={styles.petsGrid}>
            {loading ? (
              <div className={styles.loadingState}>Connecting to Adoption Database...</div>
            ) : pets.length === 0 ? (
              <div className={styles.emptyState}>No pets listed. Click "Add New Pet" to start.</div>
            ) : pets.map(pet => (
              <div key={pet._id} className={`${styles.petCard} glass-effect`}>
                <div className={styles.petImage}>
                  <span>{pet.imageUrl || '🐾'}</span>
                  <span className={`${styles.statusBadge} ${styles[pet.status?.toLowerCase() || 'available']}`}>{pet.status}</span>
                </div>
                <div className={styles.petContent}>
                  <div className={styles.petMainInfo}>
                    <h3>{pet.name}</h3>
                    <p className={styles.petBreed}>{pet.breed} • {pet.age}</p>
                  </div>
                  <div className={styles.petLocation}>
                    <MapPin size={14} />
                    <span>{pet.location}</span>
                  </div>
                  <div className={styles.petActions}>
                    <button className={styles.editBtn} onClick={() => { setEditingPet(pet); setPetForm(pet); setShowPetModal(true); }}>
                      <Edit3 size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeletePet(pet._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'Applications' && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant Details</th>
                <th>Pet Interested</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className={styles.loadingCell}>Loading applications...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan="5" className={styles.emptyCell}>No applications received yet.</td></tr>
              ) : applications.map(app => (
                <tr key={app._id}>
                  <td>
                    <div className={styles.applicantInfo}>
                      <div className={styles.applicantName}>{app.userName}</div>
                      <div className={styles.applicantContact}>
                        <span><Mail size={12} /> {app.userEmail}</span>
                        <span><Phone size={12} /> {app.userPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.petInterest}>
                      <span className={styles.heartIcon}><Heart size={14} fill="var(--color-danger)" color="var(--color-danger)" /></span>
                      {app.petName}
                    </div>
                  </td>
                  <td><div className={styles.appDate}>{new Date(app.createdAt).toLocaleDateString()}</div></td>
                  <td>
                    <span className={`${styles.appStatus} ${styles[app.status]}`}>
                      {app.status === 'pending' && <Clock size={12} />}
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.appActions}>
                      {app.status === 'pending' ? (
                        <>
                          <button onClick={() => handleReviewApp(app._id, 'approved')} className={styles.approveBtn} title="Approve"><Check size={18} /></button>
                          <button onClick={() => handleReviewApp(app._id, 'rejected')} className={styles.rejectBtn} title="Reject"><X size={18} /></button>
                        </>
                      ) : (
                        <button className={styles.viewBtn} title="View Details"><Eye size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Shelter Capacity' && (
        <div className={styles.placeholderContent}>
          <div className={styles.analyticsIcon}>📊</div>
          <h3>Shelter Management Module</h3>
          <p>Capacity tracking and occupancy charts are coming in the next update.</p>
        </div>
      )}

      {showPetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingPet ? 'Update Pet Profile' : 'List New Pet'}</h2>
              <button onClick={() => { setShowPetModal(false); setEditingPet(null); }} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleSavePet} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Pet Name</label>
                  <input type="text" required value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} placeholder="e.g. Buddy" />
                </div>
                <div className={styles.formGroup}>
                  <label>Species</label>
                  <select value={petForm.species} onChange={e => setPetForm({...petForm, species: e.target.value})}>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Rabbit</option>
                    <option>Bird</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Breed</label>
                  <input type="text" value={petForm.breed} onChange={e => setPetForm({...petForm, breed: e.target.value})} placeholder="e.g. Beagle" />
                </div>
                <div className={styles.formGroup}>
                  <label>Age</label>
                  <input type="text" value={petForm.age} onChange={e => setPetForm({...petForm, age: e.target.value})} placeholder="e.g. 2 years" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input type="text" required value={petForm.location} onChange={e => setPetForm({...petForm, location: e.target.value})} placeholder="e.g. Green Valley Sanctuary" />
              </div>
              <div className={styles.formGroup}>
                <label>About this Pet</label>
                <textarea rows="3" value={petForm.description} onChange={e => setPetForm({...petForm, description: e.target.value})} placeholder="Tell potential adopters about this pet's personality..."></textarea>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowPetModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>{editingPet ? 'Save Profile' : 'List for Adoption'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
