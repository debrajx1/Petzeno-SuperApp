import React, { useState, useEffect } from 'react';
import { Check, X, Mail, Phone, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockData } from '../lib/api';
import styles from './AdminRequests.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({ id: null, msg: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/requests`);
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch admin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionStatus({ id, msg: 'AUTHORIZING KEY...' });
    try {
      const response = await fetch(`${API_BASE}/auth/admin/approve/${id}`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        setActionStatus({ id, msg: 'PARTNER VERIFIED ✓' });
        setTimeout(() => {
          setRequests(requests.filter(r => r._id !== id));
          setActionStatus({ id: null, msg: '' });
        }, 2000);
      }
    } catch (err) {
      setActionStatus({ id, msg: 'CONNECTION ERROR' });
      setTimeout(() => setActionStatus({ id: null, msg: '' }), 3000);
    }
  };

  if (loading) return <div className={styles.loading}>Connecting to secure vault...</div>;

  return (
    <motion.div 
      className={styles.container}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.header}>
        <h1 className={styles.title}>Partner Verification</h1>
        <p className={styles.subtitle}>Audit and authorize new provider nodes in the Petzeno ecosystem.</p>
      </motion.header>

      <motion.div 
        className={styles.requestGrid}
        variants={container}
      >
        <AnimatePresence mode="popLayout">
          {requests.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              <h3>Queue Clear</h3>
              <p>All partner applications have been successfully audited.</p>
            </motion.div>
          ) : (
            requests.map(request => (
              <motion.div 
                layout
                key={request._id} 
                variants={item}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <div className={styles.roleBadge}>{request.role}</div>
                  <div className={styles.time}><Clock size={14} /> {new Date(request.createdAt).toLocaleDateString()}</div>
                </div>
                
                <h2 className={styles.businessName}>{request.businessName || 'Unnamed Entity'}</h2>
                <div className={styles.applicantInfo}>
                  <div className={styles.infoItem}><UserCheck size={16} /> {request.name}</div>
                  <div className={styles.infoItem}><Mail size={16} /> {request.email}</div>
                  {request.phone && <div className={styles.infoItem}><Phone size={16} /> {request.phone}</div>}
                </div>

                {request.message && (
                  <div className={styles.messageBox}>
                    <strong>Verification Memo:</strong>
                    <p>{request.message}</p>
                  </div>
                )}

                <div className={styles.actions}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={styles.approveBtn}
                    onClick={() => handleApprove(request._id)}
                    disabled={actionStatus.id === request._id}
                  >
                    {actionStatus.id === request._id ? 'Processing...' : <><ShieldCheck size={18} /> Authorize Key</>}
                  </motion.button>
                  <button className={styles.rejectBtn}>
                    <X size={18} /> Reject
                  </button>
                </div>

                <AnimatePresence>
                  {actionStatus.id === request._id && (
                    <motion.div 
                      className={styles.actionNote}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      {actionStatus.msg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
