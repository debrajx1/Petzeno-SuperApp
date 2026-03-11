import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { loginProvider, requestAccess } from '../lib/mockDb';
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
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logo}>
            <Heart color="var(--color-primary)" fill="var(--color-primary)" size={24} />
            <span>PetZeno</span>
          </div>
          <h1>Provider Gateway</h1>
          <p>Verified access only for service providers.</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Login As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
              <option value="vet">Veterinary Specialist</option>
              <option value="shelter">Shelter Administrator</option>
              <option value="store">Pet Store Manager</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Verification Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="doctor@petzeno.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Access Key</label>
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

          <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify and Enter Dashboard'} <ArrowRight size={18} />
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div className={styles.requestSection}>
          <div className={styles.requestBadge}>
            <ShieldCheck size={16} />
            <span>New Provider?</span>
          </div>
          <p>Your team needs to be manually verified before gaining dashboard access.</p>
          <button 
            type="button" 
            className={styles.requestBtn}
            onClick={() => setShowRequestModal(true)}
          >
            Request Access Credentials
          </button>
        </div>
      </div>

      {showRequestModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Partner Verification Request</h2>
              <button 
                className={styles.closeBtn} 
                onClick={() => setShowRequestModal(false)}
              >
                &times;
              </button>
            </div>
            
            {requestStatus.success ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✅</div>
                <h3>Application Received!</h3>
                <p>The Petzeno team will verify your credentials and email you the access key within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className={styles.modalForm}>
                <p>Please provide your professional details for verification.</p>
                {requestStatus.error && <p className={styles.errorText}>{requestStatus.error}</p>}
                
                <div className={styles.modalGrid}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={requestData.name}
                      onChange={(e) => setRequestData({...requestData, name: e.target.value})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Work Email</label>
                    <input 
                      type="email" 
                      required 
                      value={requestData.email}
                      onChange={(e) => setRequestData({...requestData, email: e.target.value})}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Business Role</label>
                    <select 
                      value={requestData.role}
                      onChange={(e) => setRequestData({...requestData, role: e.target.value})}
                    >
                      <option value="vet">Veterinarian</option>
                      <option value="shelter">Shelter Operator</option>
                      <option value="store">Retail Manager</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Clinic/Store Name</label>
                    <input 
                      type="text" 
                      required 
                      value={requestData.businessName}
                      onChange={(e) => setRequestData({...requestData, businessName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Additional Information (License No, Website, etc.)</label>
                  <textarea 
                    rows="3"
                    value={requestData.message}
                    onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className={styles.submitRequestBtn}
                  disabled={requestStatus.loading}
                >
                  {requestStatus.loading ? 'Submitting...' : 'Submit Verification Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className={styles.securityTag}>
        <Lock size={14} />
        <span>End-to-End Encrypted Verification</span>
      </div>
    </div>
  );
}
