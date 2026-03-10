import React from 'react';
import { Bell, Search, UserCircle, Menu } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={`${styles.header} glass-effect`}>
      <div className={styles.leftSection}>
        <button className={styles.iconBtnMobile}>
          <Menu size={24} />
        </button>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input type="text" placeholder="Search pets, appointments, clinics..." className={styles.searchInput} />
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <button className={styles.iconBtn}>
          <Bell size={24} />
          <span className={styles.badge}>3</span>
        </button>
        <div className={styles.profileBtn}>
          <UserCircle size={32} />
          <div className={styles.profileText}>
            <span className={styles.profileName}>Dr. Jane Smith</span>
            <span className={styles.profileRole}>Vet Clinic</span>
          </div>
        </div>
      </div>
    </header>
  );
}
