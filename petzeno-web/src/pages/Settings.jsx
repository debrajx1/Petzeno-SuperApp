import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  ChevronRight, 
  Camera,
  Mail,
  Phone,
  Settings as SettingsIcon,
  Globe,
  Sparkles,
  Moon,
  Sun,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, updateProfile } from '../lib/api';
import styles from './Settings.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Settings() {
  const user = getCurrentUser() || {};
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || ''
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    security: true
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const navItems = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'security', name: 'Security & Auth', icon: Lock },
    { id: 'notifications', name: 'Push Notifications', icon: Bell },
    { id: 'appearance', name: 'Interface Theme', icon: Palette },
    { id: 'language', name: 'Region & Language', icon: Globe },
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(user.id || 'mock_id', profileData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <p className={styles.sectionDesc}>Update your public identity and verified node details across the network.</p>
            </div>

            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  {profileData.name?.[0] || 'U'}
                </div>
                <button className={styles.editAvatar}><Camera size={16} /></button>
              </div>
              <div className={styles.headerInfo}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{profileData.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                  {user.role} Nodes • Active
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  placeholder="Your Name"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Professional Email</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={e => setProfileData({...profileData, email: e.target.value})} 
                  placeholder="email@example.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contact Number</label>
                <input 
                  type="tel" 
                  value={profileData.phone} 
                  onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hub Location</label>
                <input 
                  type="text" 
                  value={profileData.location} 
                  onChange={e => setProfileData({...profileData, location: e.target.value})} 
                  placeholder="City, Sector, Country"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Node Bio / Business Description</label>
                <textarea 
                  rows="4" 
                  value={profileData.bio} 
                  onChange={e => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell the network about your services..."
                ></textarea>
              </div>
              <div className={styles.saveActions}>
                <AnimatePresence>
                  {success && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0 }}
                      style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <ShieldCheck size={18} /> Profile Synced
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  className={styles.primaryBtn}
                >
                  {loading ? 'Synchronizing...' : 'Save Changes'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Security Hub</h2>
              <p className={styles.sectionDesc}>Multi-layered encryption and access control for your executive account.</p>
            </div>
            <div className={styles.securityList}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h4>Passphrase Management</h4>
                  <p>Last verified cryptographic update 2 days ago.</p>
                </div>
                <button className={styles.actionBtn}>Key Update</button>
              </div>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h4>Biometric / 2FA Access</h4>
                  <p>Shield your node with hardware-level authentication.</p>
                </div>
                <button className={styles.actionBtn}>Authorize</button>
              </div>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <h4>Network Activity Audit</h4>
                  <p>Review every login instance and IP trace.</p>
                </div>
                <button className={styles.actionBtn}>View Logs</button>
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Push Alerts</h2>
              <p className={styles.sectionDesc}>Configure how the network communicates critical events.</p>
            </div>
            <div className={styles.toggleList}>
              {[
                { label: 'Real-time Push Alerts', key: 'push', desc: 'Instant desktop & mobile notifications for incoming requests.' },
                { label: 'Email Intelligence', key: 'email', desc: 'Weekly analytics and critical account summaries.' },
                { label: 'SMS Response', key: 'sms', desc: 'Emergency alerts sent directly to your verified number.' },
                { label: 'Security Breach Alerts', key: 'security', desc: 'Immediate notification of unusual node activity.' }
              ].map(notif => (
                <div key={notif.key} className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>{notif.label}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{notif.desc}</p>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${notifications[notif.key] ? styles.active : ''}`}
                    onClick={() => toggleNotification(notif.key)}
                  >
                    <div className={styles.toggleThumb}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Interface Engine</h2>
              <p className={styles.sectionDesc}>Customize the visual aesthetic of your Petzeno experience.</p>
            </div>
            <div className={styles.themeGrid}>
              {[
                { id: 'dark', name: 'Elite Midnight', icon: Moon, desc: 'Optimized for focus & OLED screens.' },
                { id: 'light', name: 'Cloud White', icon: Sun, desc: 'High clarity for bright environments.' }
              ].map(t => (
                <div 
                  key={t.id} 
                  className={`${styles.themeCard} ${theme === t.id ? styles.active : ''}`}
                  onClick={() => handleThemeChange(t.id)}
                >
                  <t.icon size={24} color={theme === t.id ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                  <span className={styles.themeLabel}>{t.name}</span>
                  <p style={{ margin: 0, fontSize: '0.8rem', textAlign: 'center', opacity: 0.7 }}>{t.desc}</p>
                  {theme === t.id && <Zap size={12} fill="var(--color-primary)" color="var(--color-primary)" style={{ marginTop: '8px' }} />}
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <div className={styles.placeholder} style={{ padding: '40px', textAlign: 'center' }}>
            <Globe size={48} color="var(--color-primary)" opacity={0.3} style={{ marginBottom: '20px' }} />
            <h3>Region Sync active</h3>
            <p>Your node is currently optimized for Indian Subcontinent frequency.</p>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className={styles.settingsContainer}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.pageHeader}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>System Control</h1>
          <p className={styles.subtitle}>Audit your identity and fine-tune your node's parameters.</p>
        </div>
      </motion.header>

      <div className={styles.settingsGrid}>
        <motion.nav variants={item} className={styles.settingsNav}>
          {navItems.map((nav) => {
            const Icon = nav.icon;
            return (
              <button
                key={nav.id}
                className={`${styles.navItem} ${activeSection === nav.id ? styles.active : ''}`}
                onClick={() => setActiveSection(nav.id)}
              >
                <Icon size={20} />
                <span>{nav.name}</span>
                {activeSection === nav.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </motion.nav>

        <motion.main variants={item} className={styles.settingsContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}
