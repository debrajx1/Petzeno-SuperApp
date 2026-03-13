import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, Heart, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginProvider, requestAccess } from '../lib/api';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('vet');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration Request State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    role: 'vet',
    businessName: '',
    phone: '',
    message: ''
  });
  const [requestStatus, setRequestStatus] = useState({ loading: false, success: false, error: '' });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    setMousePos({ x: moveX, y: moveY });
  };

  const roles = [
    { id: 'vet', name: 'Veterinary', icon: Heart },
    { id: 'shelter', name: 'Shelter', icon: Home },
    { id: 'store', name: 'Pet Store', icon: ShoppingBag }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await loginProvider({ email, password, role });
      if (result.success) {
        localStorage.setItem('petzeno_user', JSON.stringify(result.user));
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection to backend failed. Make sure server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestStatus({ loading: true, success: false, error: '' });
    try {
      const result = await requestAccess(requestData);
      if (result.success) {
        setRequestStatus({ loading: false, success: true, error: '' });
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestStatus({ loading: false, success: false, error: '' });
        }, 5000);
      } else {
        setRequestStatus({ loading: false, success: false, error: result.message });
      }
    } catch (err) {
      setRequestStatus({ loading: false, success: false, error: 'Database connection error' });
    }
  };

  return (
    <div className={styles.loginPage} onMouseMove={handleMouseMove}>
      {/* ===== 3D Immersive Background ===== */}
      <div className={styles.bgContainer}>
        <motion.div 
          className={`${styles.orb} ${styles.orb1}`}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [mousePos.x * 2, mousePos.x * 2.2, mousePos.x * 2],
            y: [mousePos.y * 2, mousePos.y * 2.1, mousePos.y * 2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`${styles.orb} ${styles.orb2}`}
          animate={{ 
            scale: [1, 1.3, 1],
            x: [-mousePos.x * 1.5, -mousePos.x * 1.6, -mousePos.x * 1.5],
            y: [-mousePos.y * 1.5, -mousePos.y * 1.4, -mousePos.y * 1.5]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`${styles.orb} ${styles.orb3}`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.cardHeader}>
          <motion.div 
            className={styles.logo}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Heart color="var(--color-primary)" fill="var(--color-primary)" size={28} />
            <span>PetZeno</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Provider Gateway
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Elite access for premium pet service providers worldwide.
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className={styles.errorMessage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Access Role</label>
            <div className={styles.roleSwitcher}>
              <motion.div 
                className={styles.roleIndicator}
                animate={{ 
                  x: roles.findIndex(r => r.id === role) * 100 + '%'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`${styles.roleTile} ${role === r.id ? styles.active : ''}`}
                    onClick={() => setRole(r.id)}
                  >
                    <Icon size={18} className={styles.roleIcon} />
                    <span>{r.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Professional Identity</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="identity@petzeno.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Master Security Key</label>
            <div className={styles.inputWrapper}>
              <Key size={18} className={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            className={styles.loginBtn} 
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Authenticating...' : 'Authorize & Enter'} 
            <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className={styles.divider}>
          <span>PARTNER NETWORK</span>
        </div>

        <div className={styles.requestSection}>
          <div className={styles.requestBadge}>
            <ShieldCheck size={16} />
            <span>Identity Verification</span>
          </div>
          <p>Don't have a secure access key yet? Initiate a manual verification request.</p>
          <motion.button
            type="button"
            className={styles.requestBtn}
            onClick={() => setShowRequestModal(true)}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            Initiate Verification Request
          </motion.button>
        </div>
      </motion.div>

      {showRequestModal && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modalContent}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <div className={styles.modalHeader}>
              <h2>Gateway Access Request</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowRequestModal(false)}
              >
                &times;
              </button>
            </div>

            {requestStatus.success ? (
              <div className={styles.successState}>
                <motion.div 
                  className={styles.successIcon}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  ✅
                </motion.div>
                <h3>Request Under Review</h3>
                <p>Our global verification team will process your application within 24 standard business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className={styles.modalForm}>
                <p>Provide your professional credentials for the verification queue.</p>
                
                <div className={styles.modalGrid}>
                  <div className={styles.modalInputWrapper}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={requestData.name}
                      onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.modalInputWrapper}>
                    <label>Work Email</label>
                    <input
                      type="email"
                      required
                      value={requestData.email}
                      onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.modalInputWrapper}>
                    <label>Business Role</label>
                    <select
                      value={requestData.role}
                      onChange={(e) => setRequestData({ ...requestData, role: e.target.value })}
                      className={styles.modalSelect}
                    >
                      <option value="vet">Veterinarian</option>
                      <option value="shelter">Shelter Operator</option>
                      <option value="store">Retail Manager</option>
                    </select>
                  </div>
                  <div className={styles.modalInputWrapper}>
                    <label>Entity/Clinic Name</label>
                    <input
                      type="text"
                      required
                      value={requestData.businessName}
                      onChange={(e) => setRequestData({ ...requestData, businessName: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.modalInputWrapper}>
                  <label>Verification Notes (Licenses, Website, Portfolio)</label>
                  <textarea
                    rows="3"
                    value={requestData.message}
                    onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className={styles.submitRequestBtn}
                  disabled={requestStatus.loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {requestStatus.loading ? 'Processing...' : 'Submit to Identity Queue'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      <motion.div 
        className={styles.securityTag}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Lock size={14} />
        <span>Quantum-Resistant Identity Verification</span>
      </motion.div>
    </div>
  );
}
