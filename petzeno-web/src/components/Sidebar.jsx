import React from 'react';
import logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Home, 
  ShoppingBag, 
  Users, 
  Settings, 
  ShieldCheck, 
  ClipboardList, 
  Package, 
  Activity, 
  LogOut 
} from 'lucide-react';
import { getCurrentUser } from '../lib/api';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/dashboard/overview', name: 'Overview', icon: LayoutDashboard, roles: ['vet', 'shelter', 'store', 'admin'] },
  { path: '/dashboard/clinics', name: 'Vet Records', icon: Stethoscope, roles: ['vet', 'admin'] },
  { path: '/dashboard/shelters', name: 'Adoptions', icon: Home, roles: ['shelter', 'admin'] },
  { path: '/dashboard/stores', name: 'Inventory', icon: ShoppingBag, roles: ['store', 'admin'] },
  { path: '/dashboard/appointments', name: 'Appointments', icon: ClipboardList, roles: ['vet', 'admin'] },
  { path: '/dashboard/orders', name: 'Orders', icon: Package, roles: ['store', 'admin'] },
  { path: '/dashboard/community', name: 'Community', icon: Users, roles: ['vet', 'shelter', 'store', 'admin'] },
  { path: '/dashboard/admin-requests', name: 'Verification', icon: ShieldCheck, roles: ['admin'] },
];

export default function Sidebar() {
  const user = getCurrentUser() || {};
  const role = user.role || 'guest';

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('petzeno_user');
  };

  return (
    <aside className={`${styles.sidebar} glass-effect`}>
      <div className={styles.logo}>
        <img src={logo} alt="Petzeno" className={styles.logoImage} />
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
          <span className={styles.icon}><LogOut size={20} /></span>
          <span className={styles.navText}>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
