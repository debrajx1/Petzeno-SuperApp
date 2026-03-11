import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Home, ShoppingBag, Users, Settings, ShieldCheck } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/dashboard/overview', name: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/clinics', name: 'Clinics', icon: Stethoscope },
  { path: '/dashboard/shelters', name: 'Shelters', icon: Home },
  { path: '/dashboard/stores', name: 'Stores', icon: ShoppingBag },
  { path: '/dashboard/community', name: 'Community', icon: Users },
  { path: '/dashboard/admin-requests', name: 'Verification', icon: ShieldCheck },
];

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('petzeno_user') || '{}');
  const role = user.role || 'guest';

  const filteredNavItems = navItems.filter(item => {
    if (role === 'admin') return true;
    if (item.name === 'Overview' || item.name === 'Community') return true;
    if (role === 'vet' && item.name === 'Clinics') return true;
    if (role === 'shelter' && item.name === 'Shelters') return true;
    if (role === 'store' && item.name === 'Stores') return true;
    if (role === 'admin' && item.name === 'Verification') return true; // Redundant but explicit
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem('petzeno_user');
  };

  return (
    <aside className={`${styles.sidebar} glass-effect`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🐾</div>
        <span className={styles.logoText}>Petzeno</span>
      </div>
      
      <nav className={styles.nav}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}><Icon size={20} /></span>
              <span className={styles.navText}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/dashboard/settings" className={styles.navItem}>
          <span className={styles.icon}><Settings size={20} /></span>
          <span className={styles.navText}>Settings</span>
        </NavLink>
        <NavLink to="/" onClick={handleLogout} className={`${styles.navItem} ${styles.logout}`}>
          <div className={styles.icon}>🚪</div>
          <span className={styles.navText}>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
