import React, { useState, useEffect } from 'react';
import { Check, X, Mail, Phone, Clock, UserCheck } from 'lucide-react';
import { getMockData } from '../lib/mockDb';
import styles from './AdminRequests.module.css';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState({ id: null, msg: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://petzeno-backend.onrender.com/api/auth/admin/requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch admin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionStatus({ id, msg: 'Approving...' });
    try {
      const response = await fetch(`https://petzeno-backend.onrender.com/api/auth/admin/approve/${id}`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        setActionStatus({ id, msg: result.message });
        setTimeout(() => {
          setRequests(requests.filter(r => r._id !== id));
          setActionStatus({ id: null, msg: '' });
        }, 3000);
      }
    } catch (err) {
      setActionStatus({ id, msg: 'Error: Connection failed' });
    }
  };

  if (loading) return <div className={styles.loading}>Loading applications...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Partner Verification Queue</h1>
        <p className={styles.subtitle}>Review and approve new provider applications for the Petzeno ecosystem.</p>
      </header>

      <div className={styles.requestGrid}>
        {requests.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No pending requests</h3>
            <p>All partner applications have been processed.</p>
          </div>
        ) : (
          requests.map(request => (
            <div key={request._id} className={`${styles.card} glass-effect`}>
              <div className={styles.cardTop}>
                <div className={styles.roleBadge}>{request.role}</div>
                <div className={styles.time}><Clock size={14} /> {new Date(request.createdAt).toLocaleDateString()}</div>
              </div>
              
              <h2 className={styles.businessName}>{request.businessName}</h2>
              <div className={styles.applicantInfo}>
                <div className={styles.infoItem}><UserCheck size={16} /> {request.name}</div>
                <div className={styles.infoItem}><Mail size={16} /> {request.email}</div>
                {request.phone && <div className={styles.infoItem}><Phone size={16} /> {request.phone}</div>}
              </div>

              {request.message && (
                <div className={styles.messageBox}>
                  <strong>Message:</strong>
                  <p>{request.message}</p>
                </div>
              )}

              <div className={styles.actions}>
                <button 
                  className={styles.approveBtn}
                  onClick={() => handleApprove(request._id)}
                  disabled={actionStatus.id === request._id}
                >
                  {actionStatus.id === request._id ? 'Processing...' : <><Check size={18} /> Approve & Generate Key</>}
                </button>
                <button className={styles.rejectBtn}>
                  <X size={18} /> Reject
                </button>
              </div>

              {actionStatus.id === request._id && (
                <div className={styles.actionNote}>{actionStatus.msg}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
