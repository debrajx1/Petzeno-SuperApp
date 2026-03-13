import React, { useState } from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../lib/api';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import styles from './Header.module.css';

export default function Header() {
  const user = getCurrentUser() || {};
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const roleDisplay = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Provider';

  const handleLogout = () => {
    localStorage.removeItem('petzeno_user');
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Sidebar toggle and search removed for ultra-clean elite look */}
      </div>
      
      <div className={styles.rightSection}>
        <div style={{ position: 'relative' }}>
          <motion.button 
            className={`${styles.iconBtn} ${showNotifications ? styles.active : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            <span className={styles.badge}>2</span>
          </motion.button>
          
          <AnimatePresence>
            {showNotifications && <NotificationDropdown />}
          </AnimatePresence>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div 
            className={`${styles.profileBtn} ${showProfile ? styles.active : ''}`}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className={styles.verifiedBadge}>
              <ShieldCheck size={14} />
              <span>Verified</span>
            </div>
            <div className={styles.profileText}>
              <span className={styles.profileName}>{user.name || 'Anonymous User'}</span>
              <span className={styles.profileRole}>{roleDisplay}</span>
            </div>
            <div className={styles.avatarWrapper}>
              {user.name?.charAt(0) || 'U'}
              <div className={styles.activeGlow}></div>
            </div>
          </div>

          <AnimatePresence>
            {showProfile && <ProfileDropdown user={user} onLogout={handleLogout} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
