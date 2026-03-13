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
  ChevronRight
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus, getCurrentUser } from '../lib/api';
import styles from './Stores.module.css';

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <div className={`${styles.statCard} glass-effect`}>
    <div className={styles.statIcon} style={{ background: `rgba(var(--color-${colorClass}-rgb), 0.1)`, color: `var(--color-${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div className={styles.statContent}>
      <p className={styles.statTitle}>{title}</p>
      <h3 className={styles.statValue}>{value}</h3>
      {trend && <span className={styles.statTrend}>{trend}</span>}
    </div>
  </div>
);

export default function Stores() {
  const user = getCurrentUser() || {};
  const [activeTab, setActiveTab] = useState('Inventory');
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
    if (window.confirm('Are you sure you want to delete this product?')) {
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
    <div className={styles.storeContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTitle}>
          <h1 className={styles.pageTitle}>Seller Center</h1>
          <p className={styles.pageSubtext}>Manage your pet shop inventory and fulfill orders in real-time.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryAction} onClick={() => { setEditingProduct(null); setShowProductModal(true); }}>
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title="Active Listings" value={products.length} icon={Package} colorClass="primary" trend="+2 new today" />
        <StatCard title="Total Orders" value={orders.length} icon={Box} colorClass="secondary" trend="+12% weekly" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="success" trend="+₹4.5k this month" />
        <StatCard title="Low Stock Alerts" value={products.filter(p => p.stock < 10).length} icon={AlertTriangle} colorClass="warning" />
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
                <input type="text" placeholder="Search by SKU or Product Name..." className={styles.searchInput} />
              </div>
              <div className={styles.filterGroup}>
                <select className={styles.categoryFilter}>
                  <option>All Categories</option>
                  <option>Food</option>
                  <option>Accessories</option>
                  <option>Healthcare</option>
                </select>
                <button className={styles.filterBtn}>
                  <Filter size={18} />
                  More Filters
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className={styles.loadingCell}>Loading inventory...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" className={styles.emptyCell}>No products listed yet. Start selling!</td></tr>
                  ) : products.map(product => {
                    const status = getStockStatus(product.stock);
                    return (
                      <tr key={product._id}>
                        <td>
                          <div className={styles.productCell}>
                            <div className={styles.productIcon}><Package size={20} /></div>
                            <div>
                              <div className={styles.productName}>{product.name}</div>
                              <div className={styles.productSku}>SKU: {product._id.slice(-6).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={styles.categoryBadge}>{product.category}</span></td>
                        <td className={styles.priceCell}>₹{product.price}</td>
                        <td>{product.stock} {product.unit || 'units'}</td>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'Orders' && (
          <div className={styles.orderList}>
            {orders.length === 0 ? (
              <div className={styles.emptyOrders}>
                <Box size={48} opacity={0.3} />
                <p>No customer orders yet.</p>
              </div>
            ) : orders.map(order => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMain}>
                    <span className={styles.orderId}>#ORD-{order._id.slice(-6).toUpperCase()}</span>
                    <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`${styles.orderStatus} ${styles[order.status]}`}>{order.status}</span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <span>{item.name}</span>
                      <span>x{item.quantity} • ₹{item.price}</span>
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
                      <button onClick={() => handleUpdateOrderStatus(order._id, 'processing')} className={styles.processBtn}>Process Order</button>
                    )}
                    {order.status === 'processing' && (
                      <button onClick={() => handleUpdateOrderStatus(order._id, 'shipped')} className={styles.shipBtn}>Ship Order</button>
                    )}
                    {order.status === 'shipped' && (
                      <button onClick={() => handleUpdateOrderStatus(order._id, 'delivered')} className={styles.deliverBtn}>Mark Delivered</button>
                    )}
                    <button className={styles.detailsBtn}><MoreVertical size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className={styles.analyticsPlaceholder}>
            <TrendingUp size={64} color="var(--color-primary)" opacity={0.5} />
            <h3>Revenue Analytics Coming Soon</h3>
            <p>Track your sales performance and customer trends with interactive charts.</p>
          </div>
        )}
      </div>

      {showProductModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input 
                  type="text" 
                  required 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  placeholder="e.g. Premium Cat Food"
                />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select 
                    value={productForm.category} 
                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option>Food</option>
                    <option>Accessories</option>
                    <option>Healthcare</option>
                    <option>Toys</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    required 
                    value={productForm.stock} 
                    onChange={e => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  rows="3" 
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})}
                ></textarea>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowProductModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>{editingProduct ? 'Save Changes' : 'List Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
