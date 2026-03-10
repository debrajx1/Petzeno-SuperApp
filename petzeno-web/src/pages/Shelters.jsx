import React, { useState } from 'react';
import { Search, Filter, Heart, MapPin, Bone, Phone } from 'lucide-react';
import styles from './Shelters.module.css';

const MOCK_PETS = [
  { id: 1, name: 'Bella', type: 'Dog', breed: 'Golden Retriever', age: '2 yrs', location: 'City Center Shelter', status: 'Available', image: '🐶' },
  { id: 2, name: 'Luna', type: 'Cat', breed: 'Siamese', age: '1 yr', location: 'Northside Rescue', status: 'Pending Adoption', image: '🐱' },
  { id: 3, name: 'Charlie', type: 'Dog', breed: 'Beagle Mix', age: '4 mos', location: 'City Center Shelter', status: 'Available', image: '🐕' },
  { id: 4, name: 'Milo', type: 'Cat', breed: 'Domestic Shorthair', age: '3 yrs', location: 'Eastway Animal Haven', status: 'Adopted', image: '🐈' },
  { id: 5, name: 'Max', type: 'Dog', breed: 'German Shepherd', age: '5 yrs', location: 'City Center Shelter', status: 'Available', image: '🐕‍🦺' },
  { id: 6, name: 'Daisy', type: 'Rabbit', breed: 'Holland Lop', age: '1 yr', location: 'Small Pet Rescue', status: 'Available', image: '🐰' },
];

export default function Shelters() {
  const [activeTab, setActiveTab] = useState('Available Pets');

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
          {MOCK_PETS.map(pet => (
            <div key={pet.id} className={`${styles.petCard} glass-effect`}>
              <div className={styles.petImagePlaceholder}>
                <span className={styles.emoji}>{pet.image}</span>
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

      {activeTab !== 'Available Pets' && (
        <div className={`${styles.placeholderContent} glass-effect`}>
          <p>{activeTab} module is currently under development.</p>
        </div>
      )}
    </div>
  );
}
