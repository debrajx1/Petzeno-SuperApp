import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Home, ShoppingBag, Users, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/overview', name: 'Overview', icon: LayoutDashboard },
  { path: '/clinics', name: 'Clinics', icon: Stethoscope },
  { path: '/shelters', name: 'Shelters', icon: Home },
  { path: '/stores', name: 'Stores', icon: ShoppingBag },
  { path: '/community', name: 'Community', icon: Users },
];

export default function Sidebar() {
  return (
    <aside className={`${styles.sidebar} glass-effect`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🐾</div>
        <span className={styles.logoText}>Petzeno</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={20} className={styles.icon} />
              <span className={styles.navText}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/settings" className={styles.navItem}>
          <Settings size={20} className={styles.icon} />
          <span className={styles.navText}>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
