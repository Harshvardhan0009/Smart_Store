import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, isAdmin } from '../services/auth';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div>
        <h1 className="navbar-title">{title || (admin ? 'Admin Dashboard' : 'My Dashboard')}</h1>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <span className="navbar-user-name">{user?.name || 'User'}</span>
            <span style={{
              display: 'inline-block',
              marginLeft: '8px',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '2px 8px',
              borderRadius: '20px',
              background: admin ? 'rgba(99,102,241,0.2)' : 'rgba(34,197,94,0.2)',
              color: admin ? '#818cf8' : '#4ade80',
              verticalAlign: 'middle',
            }}>
              {admin ? '🛡️ ADMIN' : '🛍️ USER'}
            </span>
          </div>
        </div>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
