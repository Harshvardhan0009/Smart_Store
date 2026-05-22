import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orders';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const statusConfig = {
  pending:   { color: '#f59e0b', bg: '#f59e0b22' },
  confirmed: { color: '#6366f1', bg: '#6366f122' },
  shipped:   { color: '#14b8a6', bg: '#14b8a622' },
  delivered: { color: '#22c55e', bg: '#22c55e22' },
  cancelled: { color: '#ef4444', bg: '#ef444422' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">🧾 Customer Orders</h1>
              <p className="page-subtitle">View and manage all customer orders</p>
            </div>
          </div>

          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>📋</div>
              <div className="stat-info">
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>💰</div>
              <div className="stat-info">
                <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Order Revenue</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⏳</div>
              <div className="stat-info">
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Pending Action</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6' }}>✅</div>
              <div className="stat-info">
                <div className="stat-value">{orders.filter((o) => o.status === 'delivered').length}</div>
                <div className="stat-label">Delivered</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ color: 'var(--text-primary)' }}>No orders yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Orders placed by customers will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => {
                const s = statusConfig[order.status] || statusConfig.pending;
                const isOpen = expanded === order._id;
                return (
                  <div key={order._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                      style={{ padding: '1rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          style={{
                            background: s.bg, color: s.color, border: `1px solid ${s.color}`,
                            borderRadius: '20px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                          }}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Product</th>
                              <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Category</th>
                              <th style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>Qty</th>
                              <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Price</th>
                              <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} style={{ borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                <td style={{ padding: '0.5rem 0' }}>{item.name}</td>
                                <td style={{ padding: '0.5rem 0', color: 'var(--text-muted)' }}>{item.category}</td>
                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>₹{item.price.toLocaleString()}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
