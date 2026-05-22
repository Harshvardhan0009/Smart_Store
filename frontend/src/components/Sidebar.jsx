import { NavLink } from 'react-router-dom';
import { isAdmin } from '../services/auth';

const Sidebar = () => {
  const admin = isAdmin();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🏪</span>
          SmartStore AI
        </div>
      </div>

      <nav className="sidebar-nav">
        {admin ? (
          <>
            <div className="sidebar-section-title">Admin Menu</div>
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <span className="sidebar-link-icon">📊</span>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-link-icon">📦</span>
              Products
            </NavLink>
            <NavLink to="/ai-content" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-link-icon">🤖</span>
              AI Content
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-link-icon">🧾</span>
              Customer Orders
            </NavLink>
          </>
        ) : (
          <>
            <div className="sidebar-section-title">My Menu</div>
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <span className="sidebar-link-icon">🏠</span>
              My Dashboard
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-link-icon">🛍️</span>
              Shop
            </NavLink>
            <NavLink to="/my-orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-link-icon">📦</span>
              My Orders
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          SmartStore AI v1.0
          <br />
          {admin ? '🛡️ Admin Portal' : '🛍️ Customer Portal'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
