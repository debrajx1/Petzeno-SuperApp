import { Bell, Search, UserCircle, Menu, ShieldCheck } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('petzeno_user') || '{}');
  const roleDisplay = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Provider';

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
          <div className={styles.verifiedBadge}>
            <ShieldCheck size={14} />
            <span>Verified {roleDisplay}</span>
          </div>
          <UserCircle size={32} />
          <div className={styles.profileText}>
            <span className={styles.profileName}>{user.name || 'Anonymous User'}</span>
            <span className={styles.profileRole}>{user.businessName || 'Petzeno Partner'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
