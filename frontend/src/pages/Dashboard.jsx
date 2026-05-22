import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { RevenueChart, TopProductsChart, CategoryChart } from '../components/ChartCard';
import AISuggestionCard from '../components/AISuggestionCard';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, revenueRes, topRes, lowStockRes, productsRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/revenue'),
        api.get('/analytics/top-products'),
        api.get('/analytics/low-stock'),
        api.get('/products'),
      ]);

      setSummary(summaryRes.data);
      setRevenueData(revenueRes.data);
      setTopProducts(topRes.data);
      setLowStock(lowStockRes.data);
      setProducts(productsRes.data);

      // Get AI suggestions if products exist
      if (productsRes.data.length > 0) {
        try {
          const suggestionsRes = await api.post('/ai/suggestions', {
            name: productsRes.data[0].name,
            category: productsRes.data[0].category,
            price: productsRes.data[0].price,
            stock: productsRes.data[0].stock,
          });
          setSuggestions(suggestionsRes.data.suggestions);
        } catch {
          // Suggestions are optional
        }
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar title="Dashboard" />
          <div className="page-container">
            <div className="loading-container">
              <div className="spinner"></div>
              <span className="loading-text">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div className="page-container">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title">Dashboard Overview</h2>
              <p className="page-description">Welcome back! Here's your store at a glance.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon revenue">💰</div>
              <div className="stat-info">
                <div className="stat-value">₹{summary?.totalRevenue?.toLocaleString() || 0}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon products">📦</div>
              <div className="stat-info">
                <div className="stat-value">{summary?.totalProducts || 0}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon sales">🛒</div>
              <div className="stat-info">
                <div className="stat-value">{summary?.totalSales || 0}</div>
                <div className="stat-label">Total Sales</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon alerts">⚠️</div>
              <div className="stat-info">
                <div className="stat-value">{summary?.lowStockCount || 0}</div>
                <div className="stat-label">Low Stock Alerts</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue Overview</h3>
                <span className="card-subtitle">Last 7 months</span>
              </div>
              <RevenueChart data={revenueData} />
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Categories</h3>
                <span className="card-subtitle">Product distribution</span>
              </div>
              <CategoryChart data={products} />
            </div>
          </div>

          {/* Top Products & Low Stock */}
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">🏆 Top Selling Products</h3>
              </div>
              {topProducts.length > 0 ? (
                <TopProductsChart data={topProducts} />
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">No sales data yet</p>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">⚠️ Low Stock Alerts</h3>
              </div>
              {lowStock.length > 0 ? (
                <div className="alert-list">
                  {lowStock.map((item) => (
                    <div key={item._id} className="alert-item">
                      <div>
                        <div className="alert-product-name">{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                      </div>
                      <div className="alert-stock">{item.stock} left</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">All products well stocked! ✅</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="card" style={{ marginTop: '1.25rem' }}>
            <div className="card-header">
              <h3 className="card-title">🤖 AI Suggestions</h3>
              <span className="card-subtitle">Powered by SmartStore AI</span>
            </div>
            <AISuggestionCard suggestions={suggestions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
