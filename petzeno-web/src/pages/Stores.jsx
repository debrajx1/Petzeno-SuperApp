import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { getMockData } from '../lib/mockDb';
import styles from './Stores.module.css';

const INVENTORY_DATA = [
  { id: 'SKU-001', name: 'Premium Dog Food (15kg)', category: 'Food', price: 45.99, stock: 124, status: 'In Stock' },
  { id: 'SKU-002', name: 'Cat Litter Crystals (5kg)', category: 'Supplies', price: 18.50, stock: 12, status: 'Low Stock' },
  { id: 'SKU-003', name: 'Interactive Laser Toy', category: 'Toys', price: 12.99, stock: 0, status: 'Out of Stock' },
  { id: 'SKU-004', name: 'Flea & Tick Treatment (Dogs)', category: 'Health', price: 34.00, stock: 56, status: 'In Stock' },
  { id: 'SKU-005', name: 'Orthopedic Pet Bed (Large)', category: 'Accessories', price: 89.99, stock: 8, status: 'Low Stock' },
];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`${styles.statCard} glass-effect`}>
    <div className={styles.statIconWrapper} style={{ backgroundColor: `var(--color-${colorClass})`, opacity: 0.1 }}></div>
    <div className={styles.statIcon} style={{ color: `var(--color-${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div className={styles.statInfo}>
      <h3 className={styles.statValue}>{value}</h3>
      <p className={styles.statTitle}>{title}</p>
    </div>
  </div>
);

export default function Stores() {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching inventory from DB
    setTimeout(() => {
      setInventory(INVENTORY_DATA);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className={styles.storeContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Store & Inventory</h1>
          <p className={styles.pageSubtext}>Manage your pet store products, orders, and track stock levels.</p>
        </div>
        <button className={styles.primaryAction}>
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title="Total Products" value="1,248" icon={Package} colorClass="primary" />
        <StatCard title="Low Stock Alerts" value="15" icon={AlertTriangle} colorClass="warning" />
        <StatCard title="Out of Stock" value="3" icon={AlertTriangle} colorClass="danger" />
        <StatCard title="Monthly Revenue" value="$24.5k" icon={DollarSign} colorClass="success" />
      </div>

      <div className={styles.tabsContainer}>
        {['Inventory', 'Orders', 'Analytics'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={`${styles.contentArea} glass-effect`}>
        {activeTab === 'Inventory' && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search products by name or SKU..." className={styles.searchInput} />
              </div>
              <button className={styles.filterBtn}>
                <Filter size={18} />
                Filter by Category
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading inventory...</td></tr>
                  ) : inventory.map(item => (
                    <tr key={item.id}>
                      <td className={styles.sku}>{item.id}</td>
                      <td className={styles.itemName}>{item.name}</td>
                      <td>
                        <span className={styles.categoryBadge}>{item.category}</span>
                      </td>
                      <td className={styles.price}>${item.price.toFixed(2)}</td>
                      <td>{item.stock} units</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[item.status.replace(/\s+/g, '').toLowerCase()]}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.textLink}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab !== 'Inventory' && (
          <div className={styles.placeholderContent}>
            <p>{activeTab} module is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
