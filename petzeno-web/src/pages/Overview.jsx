import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Heart, Calendar, AlertCircle, MapPin, Clock } from 'lucide-react';
import styles from './Overview.module.css';

const data = [
  { name: 'Jan', adoptions: 400, appointments: 240 },
  { name: 'Feb', adoptions: 300, appointments: 139 },
  { name: 'Mar', adoptions: 200, appointments: 980 },
  { name: 'Apr', adoptions: 278, appointments: 390 },
  { name: 'May', adoptions: 189, appointments: 480 },
  { name: 'Jun', adoptions: 239, appointments: 380 },
  { name: 'Jul', adoptions: 349, appointments: 430 },
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
      {change} <span className={styles.statChangeText}>vs last month</span>
    </div>
  </div>
);


export default function Overview() {
  const user = JSON.parse(localStorage.getItem('petzeno_user') || '{}');
  const [stats, setStats] = useState({
    pets: '0',
    appointments: '0',
    adoptions: '0',
    healthAlerts: '0'
  });
  const [sosAlerts, setSosAlerts] = useState([]);
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRoleSubtext = () => {
    switch(user.role) {
      case 'vet': return `Managing health records and clinic schedules for ${user.businessName || 'your clinic'}.`;
      case 'shelter': return `Tracking adoptions and pet capacity for ${user.businessName || 'your shelter'}.`;
      case 'store': return `Monitoring inventory and orders for ${user.businessName || 'your store'}.`;
      case 'admin': return "Platform-wide management and ecosystem monitoring.";
      default: return "Welcome to the Petzeno ecosystem.";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessId = user._id; // Logged in provider's ID
        
        // Fetch Dashboard Stats from Backend
        const [petRes, aptRes, orderRes, appRes, sosRes] = await Promise.all([
          fetch('https://petzeno-backend.onrender.com/api/listings?type=adoption'),
          fetch(`https://petzeno-backend.onrender.com/api/appointments${user.role !== 'admin' ? `?businessId=${businessId}` : ''}`),
          fetch(`https://petzeno-backend.onrender.com/api/orders${user.role !== 'admin' ? `?businessId=${businessId}` : ''}`),
          fetch(`https://petzeno-backend.onrender.com/api/adoptions/applications${user.role !== 'admin' ? `?shelterId=${businessId}` : ''}`),
          fetch('https://petzeno-backend.onrender.com/api/sos/active')
        ]);

        const pets = await petRes.json();
        const apts = await aptRes.json();
        const orders = await orderRes.json();
        const apps = await appRes.json();
        const sos = await sosRes.json();
        
        setStats({
          pets: pets.length.toString(),
          appointments: apts.length.toString(),
          adoptions: apps.filter(a => a.status === 'approved').length.toString(),
          healthAlerts: sos.length.toString()
        });

        setSosAlerts(sos);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [user._id, user.role]);

  const handleSosRespond = async (id) => {
    try {
      const res = await fetch(`https://petzeno-backend.onrender.com/api/sos/respond/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responderId: user._id })
      });
      if (res.ok) {
        setSosAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'responding' } : a));
      }
    } catch (err) {
      console.error('SOS response failed:', err);
    }
  };

  return (
    <div className={styles.overviewContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{greeting}, {user.name?.split(' ')[0] || 'Partner'}!</h1>
        <p className={styles.pageSubtext}>{getRoleSubtext()}</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title="Active Pets" value={stats.pets} change="+14.5%" icon={Heart} trend="up" />
        <StatCard title="Vet Appointments" value={stats.appointments} change="+5.2%" icon={Calendar} trend="up" />
        <StatCard title="Successful Adoptions" value={stats.adoptions} change="-2.1%" icon={Users} trend="down" />
        <StatCard title="Health Alerts" value={stats.healthAlerts} change="-12.5%" icon={Activity} trend="down" />
      </div>

      <div className={styles.mainContent}>
        <div className={`${styles.chartSection} glass-effect`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ecosystem Growth</h2>
            <select className={styles.periodSelect}>
              <option>Last 7 months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorAppointments)" />
                <Area type="monotone" dataKey="adoptions" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAdoptions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.insightsSection} glass-effect`}>
          <div className={styles.sosHeader}>
            <h2 className={styles.sectionTitle} style={{ color: 'var(--color-danger)' }}>🔴 Live SOS Monitor</h2>
            <span className={styles.liveBadge}>LIVE</span>
          </div>
          
          <div className={styles.sosList}>
            {sosAlerts.length === 0 ? (
              <p className={styles.emptySos}>No active emergency alerts at the moment.</p>
            ) : sosAlerts.map(alert => (
              <div key={alert._id} className={styles.sosItem}>
                <div className={styles.sosMain}>
                  <div className={styles.sosIcon}><AlertCircle size={20} /></div>
                  <div className={styles.sosInfo}>
                    <p className={styles.sosUser}>{alert.userName} <span className={styles.sosPet}>({alert.petDetails?.name || 'Pet'})</span></p>
                    <p className={styles.sosLocation}><MapPin size={12} /> {alert.location?.address}</p>
                  </div>
                </div>
                <div className={styles.sosFooter}>
                   <span className={styles.sosTime}><Clock size={12} /> {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   <button 
                     className={styles.respondBtn}
                     onClick={() => handleSosRespond(alert._id)}
                   >
                     Respond Now
                   </button>
                </div>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          <h2 className={styles.sectionTitle}>✨ AI Insights</h2>
          <div className={styles.insightList}>
            <div className={styles.insightItem}>
              <div className={styles.insightDot} style={{backgroundColor: 'var(--color-warning)'}}></div>
              <p>Tick-borne diseases are trending up in your region. Consider sending preventive reminders.</p>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightDot} style={{backgroundColor: 'var(--color-success)'}}></div>
              <p>Adoption rates for senior pets increased by 15% this week. Great job matching campaigns!</p>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightDot} style={{backgroundColor: 'var(--color-info)'}}></div>
              <p>Clinic booking slots for tomorrow are 90% full. Recommend extending operational hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
