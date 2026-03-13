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
import { motion, AnimatePresence } from 'framer-motion';
import { getListings, createListing, updateListing, deleteListing, getMockData, getCurrentUser } from '../lib/api';
import styles from './Shelters.module.css';

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
    <motion.div 
      className={styles.shelterContainer}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Adoption Hub</h1>
          <p className={styles.pageSubtext}>Find forever homes and manage shelter logistics.</p>
        </div>
        <motion.button 
          variants={item}
          className={styles.primaryAction} 
          onClick={() => { setEditingPet(null); setShowPetModal(true); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Add New Pet
        </motion.button>
      </motion.header>

      <motion.div variants={item} className={styles.tabsContainer}>
        {['Available Pets', 'Applications', 'Shelter Capacity'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'Available Pets' ? (
          <motion.div 
            key="pets-grid"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Quantum search for pets..." className={styles.searchInput} />
              </div>
              <button className={styles.filterBtn}>
                <Filter size={16} />
                Intelligence Filters
              </button>
            </div>

            <motion.div 
              className={styles.petsGrid}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {loading ? (
                <div className={styles.loadingState}>Syncing listing database...</div>
              ) : pets.length === 0 ? (
                <div className={styles.emptyState}>No listings found in your area.</div>
              ) : pets.map(pet => (
                  <motion.div 
                    layout
                    key={pet._id} 
                    variants={item}
                    whileHover={{ y: -10 }}
                    className={styles.petCard}
                  >
                    <div className={styles.petImage}>
                      <span className={styles.petAvatar}>{pet.imageUrl || '🐾'}</span>
                      <div className={styles.badgeContainer}>
                        <span className={`${styles.statusBadge} ${styles[pet.status?.toLowerCase() || 'available']}`}>
                          {pet.status}
                        </span>
                      </div>
                    </div>
                    <div className={styles.petContent}>
                      <div className={styles.petMainInfo}>
                        <h3 className={styles.petName}>{pet.name}</h3>
                        <p className={styles.petBreed}>{pet.breed} • <span className={styles.petAge}>{pet.age}</span></p>
                      </div>
                      <div className={styles.petMetadata}>
                        <div className={styles.metaItem}>
                          <MapPin size={14} />
                          <span>{pet.location}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Bone size={14} />
                          <span>Verified Health</span>
                        </div>
                      </div>
                      <div className={styles.petActions}>
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} 
                          whileTap={{ scale: 0.9 }} 
                          className={styles.editBtn} 
                          onClick={() => { setEditingPet(pet); setPetForm(pet); setShowPetModal(true); }}
                        >
                          <Edit3 size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                          whileTap={{ scale: 0.9 }} 
                          className={styles.deleteBtn} 
                          onClick={() => handleDeletePet(pet._id)}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : activeTab === 'Applications' ? (
          <motion.div 
            key="apps-table"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={styles.tableWrapper}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Engagement</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className={styles.loadingCell}>Loading records...</td></tr>
                ) : applications.length === 0 ? (
                  <tr><td colSpan="5" className={styles.emptyCell}>Zero pending applications.</td></tr>
                ) : applications.map((app, idx) => (
                  <motion.tr 
                    key={app._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td>
                      <div className={styles.applicantInfo}>
                        <div className={styles.applicantName}>{app.userName}</div>
                        <div className={styles.applicantContact}>
                          <span><Mail size={12} /> {app.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.petInterest}>
                        <Heart size={14} fill="var(--color-primary)" color="var(--color-primary)" />
                        {app.petName}
                      </div>
                    </td>
                    <td><div className={styles.appDate}>{new Date(app.createdAt).toLocaleDateString()}</div></td>
                    <td>
                      <span className={`${styles.appStatus} ${styles[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.appActions}>
                        {app.status === 'pending' ? (
                          <>
                            <button onClick={() => handleReviewApp(app._id, 'approved')} className={styles.approveBtn}><Check size={18} /></button>
                            <button onClick={() => handleReviewApp(app._id, 'rejected')} className={styles.rejectBtn}><X size={18} /></button>
                          </>
                        ) : (
                          <button className={styles.viewBtn}><Eye size={18} /></button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div 
            key="capacity"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.placeholderContent}
          >
            <div className={styles.analyticsIcon}>📊</div>
            <h3>Shelter Logistics Hub</h3>
            <p>Predictive capacity modeling and spatial charts are being indexed...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPetModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h2>{editingPet ? 'Refine Profile' : 'Quantum Pet Listing'}</h2>
                <button onClick={() => { setShowPetModal(false); setEditingPet(null); }} className={styles.closeBtn}>&times;</button>
              </div>
              <form onSubmit={handleSavePet} className={styles.modalForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Designated Name</label>
                    <input type="text" required value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Classification</label>
                    <select value={petForm.species} onChange={e => setPetForm({...petForm, species: e.target.value})}>
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Exotic</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Breed Origin</label>
                    <input type="text" value={petForm.breed} onChange={e => setPetForm({...petForm, breed: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Age/Ecycle</label>
                    <input type="text" value={petForm.age} onChange={e => setPetForm({...petForm, age: e.target.value})} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Sanctuary Location</label>
                  <input type="text" required value={petForm.location} onChange={e => setPetForm({...petForm, location: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Personality Signature</label>
                  <textarea rows="3" value={petForm.description} onChange={e => setPetForm({...petForm, description: e.target.value})}></textarea>
                </div>
                <div className={styles.modalFooter}>
                  <button type="submit" className={styles.saveBtn}>{editingPet ? 'Update Record' : 'Authorize Listing'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
