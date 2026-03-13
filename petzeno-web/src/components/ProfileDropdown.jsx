import React from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, User, Shield, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function ProfileDropdown({ user, onLogout }) {
  const menuItems = [
    { icon: User, label: 'My Profile', path: '/dashboard/settings' },
    { icon: Settings, label: 'Preferences', path: '/dashboard/settings' },
    { icon: Shield, label: 'Security', path: '/dashboard/settings' },
    { icon: CreditCard, label: 'Billing', path: '/dashboard/settings' },
  ];

  return (
    <motion.div 
      className={styles.dropdown}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className={styles.dropdownHeader}>
        <div className={styles.avatarLarge}>
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className={styles.largeAvatarImg} />
          ) : (
            user.name?.charAt(0) || 'U'
          )}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name || 'Anonymous'}</span>
          <span className={styles.userEmail}>{user.email || 'user@petzeno.com'}</span>
        </div>
      </div>
      
      <div className={styles.dropdownBody}>
        {menuItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={styles.dropdownItem}
          >
            <item.icon size={18} className={styles.itemIcon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.dropdownFooter}>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
}
