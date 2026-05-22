import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orders';
import { getCurrentUser } from '../services/auth';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const pending = orders.filter((o) => o.status === 'pending').length;

  // Most ordered category
  const categoryCount = {};
  orders.forEach((o) => o.items.forEach((i) => {
    if (i.category) categoryCount[i.category] = (categoryCount[i.category] || 0) + i.quantity;
  }));
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const recentOrders = [...orders].slice(0, 5);

  const statusColor = { pending: '#f59e0b', confirmed: '#6366f1', shipped: '#14b8a6', delivered: '#22c55e', cancelled: '#ef4444' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="page-subtitle">Here's a summary of your activity on SmartStore AI</p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>📦</div>
                  <div className="stat-info">
                    <div className="stat-value">{orders.length}</div>
                    <div className="stat-label">Orders Placed</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>💰</div>
                  <div className="stat-info">
                    <div className="stat-value">₹{totalSpent.toLocaleString()}</div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6' }}>🛍️</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalItems}</div>
                    <div className="stat-label">Items Purchased</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⭐</div>
                  <div className="stat-info">
                    <div className="stat-value">{topCategory}</div>
                    <div className="stat-label">Favourite Category</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Recent Orders */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Recent Orders</h2>
                  </div>
                  {recentOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No orders yet. <a href="/shop" style={{ color: 'var(--primary)' }}>Go shopping!</a>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {recentOrders.map((order) => (
                        <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                              #{order._id.slice(-8).toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.items.length} item(s)
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                              ₹{order.totalAmount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor[order.status] }}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Status Breakdown */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Order Status</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {[
                      { label: 'Pending', count: pending, color: '#f59e0b' },
                      { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: '#6366f1' },
                      { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#14b8a6' },
                      { label: 'Delivered', count: delivered, color: '#22c55e' },
                      { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
                    ].map((s) => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.label}</div>
                        <div style={{ width: `${orders.length ? (s.count / orders.length) * 100 : 0}%`, height: '6px', background: s.color, borderRadius: '4px', minWidth: '4px', transition: 'width 0.5s' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: s.color, minWidth: '20px', textAlign: 'right' }}>{s.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
