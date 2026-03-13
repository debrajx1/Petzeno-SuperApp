import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import styles from './Header.module.css';

const mockNotifications = [
  { 
    id: 1, 
    type: 'SOS', 
    icon: AlertTriangle, 
    title: 'Emergency: Shelter Low on Supplies', 
    time: '2 mins ago', 
    color: '#EF4444', 
    unread: true 
  },
  { 
    id: 2, 
    type: 'Adoption', 
    icon: Heart, 
    title: 'New Adoption Application for Luna', 
    time: '1 hour ago', 
    color: '#FF7B54', 
    unread: true 
  },
  { 
    id: 3, 
    type: 'Security', 
    icon: ShieldCheck, 
    title: 'System Security Audit Completed', 
    time: '3 hours ago', 
    color: '#10B981', 
    unread: false 
  },
  { 
    id: 4, 
    type: 'Update', 
    icon: Mail, 
    title: 'Dr. Ajay replied to your message', 
    time: '5 hours ago', 
    color: '#3B82F6', 
    unread: false 
  },
];

export default function NotificationDropdown() {
  return (
    <motion.div 
      className={styles.dropdown}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className={styles.dropdownHeader}>
        <h3 className={styles.dropdownTitle}>Notifications</h3>
        <span className={styles.unreadCount}>2 New</span>
      </div>
      
      <div className={styles.dropdownBody}>
        {mockNotifications.map((notif, idx) => (
          <motion.div 
            key={notif.id} 
            className={`${styles.notificationItem} ${notif.unread ? styles.unread : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={styles.notifIcon} style={{ background: `${notif.color}15`, color: notif.color }}>
              <notif.icon size={18} />
            </div>
            <div className={styles.notifContent}>
              <p className={styles.notifTitle}>{notif.title}</p>
              <span className={styles.notifTime}>{notif.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.dropdownFooter}>
        <button className={styles.viewAllBtn}>Mark all as read</button>
      </div>
    </motion.div>
  );
}
