import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🏪</span>
          SmartStore AI
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Main Menu</div>
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

        <div className="sidebar-section-title">Analytics</div>
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <span className="sidebar-link-icon">💰</span>
          Revenue
        </NavLink>
        <NavLink to="/" className="sidebar-link" end>
          <span className="sidebar-link-icon">🏆</span>
          Top Products
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          SmartStore AI v1.0
          <br />
          Powered by AI ✨
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
