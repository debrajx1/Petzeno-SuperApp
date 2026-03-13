import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className={`${styles.statCard} glass-effect`}>
    <div className={styles.statHeader}>
      <div className={styles.statTitle}>{title}</div>
      <div className={`${styles.statIcon} ${styles[trend]}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className={styles.statValue}>{value}</div>
    <div className={`${styles.statChange} ${trend === 'up' ? styles.positive : styles.negative}`}>
      <TrendingUp size={14} style={{ marginRight: '4px', transform: trend === 'down' ? 'rotate(90deg)' : 'none' }} />
      {change} <span className={styles.statChangeText}>vs last month</span>
    </div>
  </div>
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
        
        // Dynamic stats based on role
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
        
        // Customize display stats based on role
        let mainStats = { main: '0', secondary: '0', tertiary: '0', alerts: '0' };
        
        // Ensure we are working with arrays to avoid crashes
        const petArr = Array.isArray(pets) ? pets : [];
        const aptArr = Array.isArray(apts) ? apts : [];
        const orderArr = Array.isArray(orders) ? orders : [];
        const appArr = Array.isArray(apps) ? apps : [];
        const sosArr = Array.isArray(sos) ? sos : [];

        if (user.role === 'vet') {
          mainStats = {
            main: aptArr.length.toString(),
            secondary: petArr.length.toString(),
            tertiary: '12', 
            alerts: sosArr.length.toString()
          };
        } else if (user.role === 'shelter') {
          mainStats = {
            main: appArr.length.toString(),
            secondary: petArr.length.toString(),
            tertiary: appArr.filter(a => a.status === 'approved').length.toString(),
            alerts: sosArr.length.toString()
          };
        } else if (user.role === 'store') {
          mainStats = {
            main: orderArr.length.toString(),
            secondary: '5', 
            tertiary: '₹45k', 
            alerts: sosArr.length.toString()
          };
        } else {
          mainStats = {
            main: petArr.length.toString(),
            secondary: aptArr.length.toString(),
            tertiary: appArr.length.toString(),
            alerts: sosArr.length.toString()
          };
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
        label2: "Total Pets Managed", icon2: Heart,
        label3: "Active Patients", icon3: Activity,
        subtext: `Managing health records and clinic schedules for ${user.businessName || 'your clinic'}.`
      },
      shelter: {
        label1: "Pending Applications", icon1: Users,
        label2: "Pets for Adoption", icon2: Bone,
        label3: "Successful Adoptions", icon3: Heart,
        subtext: `Tracking adoptions and pet capacity for ${user.businessName || 'your shelter'}.`
      },
      store: {
        label1: "Active Orders", icon1: ShoppingBag,
        label2: "Low Stock Items", icon2: AlertCircle,
        label3: "Monthly Revenue", icon3: TrendingUp,
        subtext: `Monitoring inventory and orders for ${user.businessName || 'your store'}.`
      },
      admin: {
        label1: "Total Ecosystem Pets", icon1: Heart,
        label2: "Active Appointments", icon2: Calendar,
        label3: "Adoption Requests", icon3: Users,
        subtext: "Platform-wide management and ecosystem monitoring."
      }
    };
    return configs[user.role] || configs.admin;
  };

  const roleConfig = getRoleConfig();

  return (
    <div className={styles.overviewContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>{greeting}, <span className={styles.userName}>{user.name?.split(' ')[0] || 'Partner'}</span>!</h1>
          <p className={styles.pageSubtext}>{roleConfig.subtext}</p>
        </div>
        <div className={styles.liveClock}>
          <Clock size={16} />
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title={roleConfig.label1} value={stats.main} change="+12.5%" icon={roleConfig.icon1} trend="up" />
        <StatCard title={roleConfig.label2} value={stats.secondary} change="+5.2%" icon={roleConfig.icon2} trend="up" />
        <StatCard title={roleConfig.label3} value={stats.tertiary} change="+2.1%" icon={roleConfig.icon3} trend="up" />
        <StatCard title="Priority SOS" value={stats.alerts} change="-12.5%" icon={Activity} trend="down" />
      </div>

      <div className={styles.mainContent}>
        <div className={`${styles.chartSection} glass-effect`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Performance Analytics</h2>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: 'var(--color-primary)'}}></span> Adoptions</span>
              <span className={styles.legendItem}><span className={styles.dot} style={{backgroundColor: 'var(--color-secondary)'}}></span> Apps</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorSecondary)" strokeWidth={3} />
                <Area type="monotone" dataKey="adoptions" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorPrimary)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.insightsSection} glass-effect`}>
          <div className={styles.sosHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sosPulse}></span>
              Live Emergency Response
            </h2>
            <span className={styles.liveBadge}>BETA</span>
          </div>
          
          <div className={styles.sosList}>
            {sosAlerts.length === 0 ? (
              <div className={styles.emptySos}>
                <ShieldCheck size={40} opacity={0.3} />
                <p>No active emergencies.</p>
              </div>
            ) : sosAlerts.map(alert => (
              <div key={alert._id} className={styles.sosItem}>
                <div className={styles.sosMain}>
                  <div className={styles.sosIcon}><AlertCircle size={18} /></div>
                  <div className={styles.sosInfo}>
                    <p className={styles.sosUser}>{alert.userName} • {alert.petDetails?.name}</p>
                    <p className={styles.sosLocation}><MapPin size={10} /> {alert.location?.address}</p>
                  </div>
                </div>
                <button 
                  className={styles.respondBtn}
                  onClick={() => handleSosRespond(alert._id)}
                  disabled={alert.status === 'responding'}
                >
                  {alert.status === 'responding' ? 'Assigned' : 'Take Action'}
                </button>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          <h3 className={styles.smallTitle}>Strategic Insights</h3>
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
        </div>
      </div>
    </div>
  );
}
