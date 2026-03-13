import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Trash2, 
  Edit3, 
  CheckCircle,
  Truck,
  Box,
  MoreVertical,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus, getCurrentUser } from '../lib/api';
import styles from './Stores.module.css';

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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <motion.div variants={item} className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: `rgba(var(--color-${colorClass}-rgb), 0.1)`, color: `var(--color-${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div className={styles.statContent}>
      <p className={styles.statTitle}>{title}</p>
      <h3 className={styles.statValue}>{value}</h3>
      {trend && <span className={styles.statTrend}>{trend}</span>}
    </div>
  </motion.div>
);

export default function Stores({ defaultTab }) {
  const user = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState(defaultTab || 'Inventory');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Food',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts(user.id),
        getOrders(user.id)
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error('Failed to fetch store data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const data = { ...productForm, businessId: user.id, businessName: user.businessName };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
      } else {
        await createProduct(data);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Food', price: '', stock: '', description: '' });
      fetchData();
    } catch (err) {
      console.error('Product save failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this listing from your catalog?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchData();
    } catch (err) {
      console.error('Order update failed:', err);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'danger' };
    if (stock < 10) return { label: 'Low Stock', class: 'warning' };
    return { label: 'In Stock', class: 'success' };
  };

  const totalRevenue = Array.isArray(orders) 
    ? orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    : 0;

  return (
    <motion.div 
      className={styles.storeContainer}
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.header variants={item} className={styles.pageHeader}>
        <div className={styles.headerTitle}>
          <h1 className={styles.pageTitle}>Seller Hub</h1>
          <p className={styles.pageSubtext}>Advanced pet store inventory and fulfillment control.</p>
        </div>
        <motion.button 
          variants={item}
          className={styles.primaryAction} 
          onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Add New Product
        </motion.button>
      </motion.header>

      <motion.div variants={container} className={styles.statsGrid}>
        <StatCard title="Total Listings" value={products.length} icon={Package} colorClass="primary" trend="+2 updated" />
        <StatCard title="Active Orders" value={orders.length} icon={Box} colorClass="secondary" trend="Processing" />
        <StatCard title="Hub Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="success" trend="Net Earnings" />
        <StatCard title="Stock Health" value={products.filter(p => p.stock < 10).length} icon={AlertTriangle} colorClass="warning" />
      </motion.div>

      <motion.div variants={item} className={styles.tabsContainer}>
        {['Inventory', 'Orders', 'Analytics'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'Inventory' ? (
          <motion.div 
            key="inventory"
            className={styles.contentArea}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Quantum SKU search..." className={styles.searchInput} />
              </div>
              <div className={styles.filterGroup}>
                <select className={styles.categoryFilter}>
                  <option>All Sectors</option>
                  <option>Nutrition</option>
                  <option>Accessories</option>
                </select>
                <button className={styles.filterBtn}>
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sector</th>
                    <th>Valuation</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className={styles.loadingCell}>Syncing catalogue...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" className={styles.emptyCell}>Inventory empty. List your first product.</td></tr>
                  ) : products.map((product, idx) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <motion.tr 
                        key={product._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td>
                          <div className={styles.productCell}>
                            <div className={styles.productIcon}><Package size={20} /></div>
                            <div>
                              <div className={styles.productName}>{product.name}</div>
                              <div className={styles.productSku}>#{product._id.slice(-6).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={styles.categoryBadge}>{product.category}</span></td>
                        <td className={styles.priceCell}>₹{product.price}</td>
                        <td style={{ fontWeight: 700 }}>{product.stock}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[status.class]}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button className={styles.iconBtn} onClick={() => { setEditingProduct(product); setProductForm(product); setShowProductModal(true); }}>
                              <Edit3 size={16} />
                            </button>
                            <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(product._id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'Orders' ? (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={styles.orderList}
          >
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <div className={styles.emptyOrders}>
                  <Activity size={48} opacity={0.3} />
                  <p>Order stream inactive.</p>
                </div>
              ) : orders.map(order => (
                <motion.div 
                  layout
                  key={order._id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.orderCard}
                >
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>#OR-{order._id.slice(-6).toUpperCase()}</span>
                      <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`${styles.orderStatus} ${styles[order.status]}`}>{order.status}</span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.orderItem}>
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderFooter}>
                    <div className={styles.shippingInfo}>
                      <Truck size={14} />
                      <span>{order.shippingAddress}</span>
                    </div>
                    <div className={styles.orderActions}>
                      {order.status === 'pending' && (
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'processing')} className={styles.processBtn}>Process</button>
                      )}
                      {order.status === 'processing' && (
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'shipped')} className={styles.shipBtn}>Ship</button>
                      )}
                      {order.status === 'shipped' && (
                        <button onClick={() => handleUpdateOrderStatus(order._id, 'delivered')} className={styles.deliverBtn}>Finalize</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.analyticsPlaceholder}
            style={{ padding: '80px', textAlign: 'center' }}
          >
            <TrendingUp size={64} color="var(--color-primary)" opacity={0.5} />
            <h3>Market Analytics Indexing</h3>
            <p>Predictive sales trends and revenue forecasting are being generated...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductModal && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h2>{editingProduct ? 'Refine Product' : 'Catalogue Authorization'}</h2>
                <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className={styles.closeBtn}>&times;</button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Product Identity</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className={styles.formGroup}>
                    <label>Valuation (₹)</label>
                    <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}/>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Units in Hub</label>
                    <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})}/>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button type="submit" className={styles.saveBtn}>{editingProduct ? 'Save Index' : 'Authorize Listing'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
