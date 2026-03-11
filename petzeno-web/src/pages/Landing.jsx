import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Heart, ArrowRight, CheckCircle, Zap, Globe, Lock } from 'lucide-react';
import styles from './Landing.module.css';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className={styles.featureCard}>
    <div className={styles.featureIcon}>
      <Icon size={24} color="var(--color-primary)" />
    </div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.landingContainer}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Heart color="var(--color-primary)" fill="var(--color-primary)" size={32} />
          <span>PetZeno</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <button onClick={() => navigate('/login')} className={styles.loginBtn}>Provider Portal</button>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Zap size={14} />
            <span>The Future of Pet Care</span>
          </div>
          <h1 className={styles.heroTitle}>
            The Ultimate <span className={styles.gradientText}>Complete Pet Ecosystem</span> for the Modern World
          </h1>
          <p className={styles.heroSubtitle}>
            Unifying pet owners, veterinarians, shelters, and businesses in one secure, AI-powered digital platform.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.primaryBtn}>Download the App</button>
            <button onClick={() => navigate('/login')} className={styles.secondaryBtn}>
              Join as Provider <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.heroImageOverlay}></div>
          <img src="/petzeno_landing_hero.png" alt="Happy pets" className={styles.heroImage} />
          <div className={`${styles.statsFloating} glass-effect`}>
            <Users size={20} color="var(--color-primary)" />
            <div>
              <div className={styles.statsNum}>50k+</div>
              <div className={styles.statsLabel}>Verified Users</div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Built for every stakeholder</h2>
        <div className={styles.featuresGrid}>
          <FeatureCard 
            icon={Shield} 
            title="Veterinary Management" 
            description="Complete clinic operations, medical records, and appointment scheduling in one place."
          />
          <FeatureCard 
            icon={Heart} 
            title="Shelter Tracking" 
            description="Manage adoptions, track pet availability, and find loving homes more efficiently."
          />
          <FeatureCard 
            icon={Globe} 
            title="Business Inventory" 
            description="Inventory management and service tracking for pet stores and service providers."
          />
        </div>
      </section>

      <section id="security" className={styles.securitySection}>
        <div className={`${styles.securityBox} glass-effect`}>
          <div className={styles.securityIcon}>
            <Lock size={48} color="var(--color-warning)" />
          </div>
          <h2>Verified Network Only</h2>
          <p>
            To prevent fraudulent services, every provider on PetZeno is manually verified by our team. 
            Vets, Shelters, and Stores must provide valid documentation to gain access to the dashboard.
          </p>
          <div className={styles.securitySteps}>
            <div className={styles.step}>
              <CheckCircle size={20} color="var(--color-success)" />
              <span>Apply for Access</span>
            </div>
            <div className={styles.step}>
              <CheckCircle size={20} color="var(--color-success)" />
              <span>Document Verification</span>
            </div>
            <div className={styles.step}>
              <CheckCircle size={20} color="var(--color-success)" />
              <span>Gateway Access Granted</span>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 PetZeno Hackathon Edition. All rights reserved.</p>
      </footer>
    </div>
  );
}
