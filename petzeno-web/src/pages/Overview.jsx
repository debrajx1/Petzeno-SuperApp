import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Heart, 
  Calendar, 
  AlertCircle, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ShoppingBag, 
  Bone, 
  ShieldCheck 
} from 'lucide-react';
import { getCurrentUser } from '../lib/api';
import styles from './Overview.module.css';

const data = [
  { name: 'Jan', adoptions: 40, appointments: 24 },
  { name: 'Feb', adoptions: 30, appointments: 13 },
  { name: 'Mar', adoptions: 20, appointments: 98 },
  { name: 'Apr', adoptions: 27, appointments: 39 },
  { name: 'May', adoptions: 18, appointments: 48 },
  { name: 'Jun', adoptions: 23, appointments: 38 },
  { name: 'Jul', adoptions: 34, appointments: 43 },
];

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const AnimatedCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
    if (start === end) return;

    let totalDuration = 1500;
    let increment = end / (totalDuration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <motion.div variants={item} className={`${styles.statCard} glass-effect`}>
    <div className={styles.statHeader}>
      <div className={styles.statTitle}>{title}</div>
      <div className={`${styles.statIcon} ${styles[trend]}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className={styles.statValue}>
      <AnimatedCounter value={value} />
    </div>
    <div className={`${styles.statChange} ${trend === 'up' ? styles.positive : styles.negative}`}>
      <TrendingUp size={14} style={{ marginRight: '4px', transform: trend === 'down' ? 'rotate(180deg)' : 'none' }} />
      {change} <span className={styles.statChangeText}>vs last month</span>
    </div>
  </motion.div>
);

export default function Overview() {
  const user = getCurrentUser() || {};
  const [stats, setStats] = useState({
    main: '0',
    secondary: '0',
    tertiary: '0',
    alerts: '0'
  });
  const [sosAlerts, setSosAlerts] = useState([]);
  const [greeting, setGreeting] = useState('Good morning');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessId = user.id;
        const [petRes, aptRes, orderRes, appRes, sosRes] = await Promise.all([
          fetch(`${API_BASE}/listings?type=adoption`),
          fetch(`${API_BASE}/appointments${user.role !== 'admin' ? `?businessId=${businessId}` : ''}`),
          fetch(`${API_BASE}/orders${user.role !== 'admin' ? `?businessId=${businessId}` : ''}`),
          fetch(`${API_BASE}/adoptions/applications${user.role !== 'admin' ? `?shelterId=${businessId}` : ''}`),
          fetch(`${API_BASE}/sos/active`)
        ]);

        const [pets, apts, orders, apps, sos] = await Promise.all([
          petRes.json(), aptRes.json(), orderRes.json(), appRes.json(), sosRes.json()
        ]);
        
        const petArr = Array.isArray(pets) ? pets : [];
        const aptArr = Array.isArray(apts) ? apts : [];
        const orderArr = Array.isArray(orders) ? orders : [];
        const appArr = Array.isArray(apps) ? apps : [];
        const sosArr = Array.isArray(sos) ? sos : [];

        let mainStats = { main: '0', secondary: '0', tertiary: '0', alerts: '0' };
        
        if (user.role === 'vet') {
          mainStats = { main: aptArr.length, secondary: petArr.length, tertiary: 12, alerts: sosArr.length };
        } else if (user.role === 'shelter') {
          mainStats = { main: appArr.length, secondary: petArr.length, tertiary: appArr.filter(a => a.status === 'approved').length, alerts: sosArr.length };
        } else if (user.role === 'store') {
          mainStats = { main: orderArr.length, secondary: 5, tertiary: 450, alerts: sosArr.length };
        } else {
          mainStats = { main: petArr.length, secondary: aptArr.length, tertiary: appArr.length, alerts: sosArr.length };
        }

        setStats(mainStats);
        setSosAlerts(sosArr);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, [user.id, user.role, API_BASE]);

  const handleSosRespond = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sos/respond/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responderId: user.id })
      });
      if (res.ok) {
        setSosAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'responding' } : a));
      }
    } catch (err) {
      console.error('SOS response failed:', err);
    }
  };

  const getRoleConfig = () => {
    const configs = {
      vet: {
        label1: "Upcoming Appointments", icon1: Calendar,
        label2: "Health Subscriptions", icon2: ShieldCheck,
        label3: "Active Patients", icon3: Activity,
        subtext: `Global health monitoring for ${user.businessName || 'your center'}.`
      },
      shelter: {
        label1: "Live Applications", icon1: Users,
        label2: "Pets On-Board", icon2: Bone,
        label3: "Successful Matches", icon3: Heart,
        subtext: `Tracking adoptions and shelter logistics for ${user.businessName || 'your facility'}.`
      },
      store: {
        label1: "Active Orders", icon1: ShoppingBag,
        label2: "Inventory Level", icon2: AlertCircle,
        label3: "Monthly Revenue", icon3: TrendingUp,
        subtext: `Supply chain and sales analytics for ${user.businessName || 'your store'}.`
      },
      admin: {
        label1: "Global Pets", icon1: Heart,
        label2: "Active Sessions", icon2: Activity,
        label3: "Ecosystem Requests", icon3: ShieldCheck,
        subtext: "Master platform logistics and verification queue."
      }
    };
    return configs[user.role] || configs.admin;
  };

  const roleConfig = getRoleConfig();

  return (
    <motion.div 
      className={styles.overviewContainer}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>{greeting}, <span className={styles.userName}>{user.name?.split(' ')[0] || 'Partner'}</span>!</h1>
          <p className={styles.pageSubtext}>{roleConfig.subtext}</p>
        </div>
        <div className={styles.liveClock}>
          <div className="radar-pulse"></div>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.header>

      <div className={styles.statsGrid}>
        <StatCard title={roleConfig.label1} value={stats.main} change="+12.5%" icon={roleConfig.icon1} trend="up" />
        <StatCard title={roleConfig.label2} value={stats.secondary} change="+5.2%" icon={roleConfig.icon2} trend="up" />
        <StatCard title={roleConfig.label3} value={stats.tertiary} change="+2.1%" icon={roleConfig.icon3} trend="up" />
        <StatCard title="Priority SOS" value={stats.alerts} change="-12.5%" icon={Activity} trend="down" />
      </div>

      <div className={styles.mainContent}>
        <motion.div variants={item} className={`${styles.chartSection} glass-effect`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Performance Analytics</h2>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: 'var(--color-primary)'}}></span> Growth</span>
              <span className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: 'var(--color-secondary)'}}></span> Engagement</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7B54" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#FF7B54" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB26B" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#FFB26B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    backdropFilter: 'blur(20px)', 
                    border: '1px solid rgba(255,255,255,0.15)', 
                    borderRadius: '16px', 
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: 'white', fontWeight: 700 }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#FFB26B" 
                  fillOpacity={1} 
                  fill="url(#colorSecondary)" 
                  strokeWidth={4} 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="adoptions" 
                  stroke="#FF7B54" 
                  fillOpacity={1} 
                  fill="url(#colorPrimary)" 
                  strokeWidth={5} 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className={`${styles.insightsSection} glass-effect`}>
          <div className={styles.sosHeader}>
            <h2 className={styles.sectionTitle}>
              <div className="radar-pulse"></div>
              Emergency Hub
            </h2>
            <span className={styles.liveBadge}>LIVE FEED</span>
          </div>
          
          <div className={styles.sosList}>
            <AnimatePresence mode="popLayout">
              {sosAlerts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.emptySos}
                >
                  <ShieldCheck size={48} color="var(--color-success)" opacity={0.5} />
                  <p>System status nominal. <br/>No active emergencies detected.</p>
                </motion.div>
              ) : sosAlerts.map(alert => (
                <motion.div 
                  layout
                  key={alert._id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={styles.sosItem}
                >
                  <div className={styles.sosMain}>
                    <div className={styles.sosIcon}><Activity size={18} /></div>
                    <div className={styles.sosInfo}>
                      <p className={styles.sosUser}>{alert.userName}</p>
                      <p className={styles.sosLocation}><MapPin size={12} /> {alert.location?.address || 'Geolocation Pending'}</p>
                    </div>
                  </div>
                  <button 
                    className={styles.respondBtn}
                    onClick={() => handleSosRespond(alert._id)}
                    disabled={alert.status === 'responding'}
                  >
                    {alert.status === 'responding' ? 'RESPONDER ASSIGNED' : 'INITIATE RESCUE'}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <hr className={styles.divider} />

          <h3 className={styles.smallTitle}>Quantum Insights</h3>
          <div className={styles.insightList}>
            <div className={styles.insightItem}>
              <div className={styles.insightDot} style={{backgroundColor: 'var(--color-warning)'}}></div>
              <p>Heatwave warning issued for Noida. Advise pet owners on hydration.</p>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightDot} style={{backgroundColor: 'var(--color-success)'}}></div>
              <p>Community engagement is up by 25% this week. Keep up the high-value posts!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
