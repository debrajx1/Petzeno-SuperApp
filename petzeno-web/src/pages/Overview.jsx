import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Heart, Calendar } from 'lucide-react';
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
  const [activePets, setActivePets] = useState("12,489");

  // In a real app, this would fetch from the new Express backend API
  useEffect(() => {
    // setActivePets(fetchedData);
  }, []);

  return (
    <div className={styles.overviewContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
        <p className={styles.pageSubtext}>Here's what's happening in the Petzeno ecosystem today.</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title="Active Pets" value={activePets} change="+14.5%" icon={Heart} trend="up" />
        <StatCard title="Vet Appointments" value="842" change="+5.2%" icon={Calendar} trend="up" />
        <StatCard title="Successful Adoptions" value="156" change="-2.1%" icon={Users} trend="down" />
        <StatCard title="Health Alerts" value="23" change="-12.5%" icon={Activity} trend="down" />
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
