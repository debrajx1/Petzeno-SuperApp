import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className={styles.layoutMain}>
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
