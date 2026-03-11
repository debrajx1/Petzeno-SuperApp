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
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://petzeno-backend.onrender.com/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.log('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleProcessOrder = async (id, status) => {
    try {
      const res = await fetch(`https://petzeno-backend.onrender.com/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.log('Order update failed');
    }
  };

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

        {activeTab === 'Orders' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td></tr>
                ) : orders.map(order => (
                  <tr key={order._id}>
                    <td className={styles.sku}>ORD-{order._id.slice(-6).toUpperCase()}</td>
                    <td className={styles.itemName}>
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className={styles.price}>₹{order.totalAmount}</td>
                    <td>{order.shippingAddress}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'pending' ? (
                        <button 
                          className={styles.primaryAction} 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleProcessOrder(order._id, 'processing')}
                        >
                          Ship Now
                        </button>
                      ) : (
                        <button className={styles.textLink} disabled>{order.status}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab !== 'Inventory' && activeTab !== 'Orders' && (
          <div className={styles.placeholderContent}>
            <p>{activeTab} module is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
