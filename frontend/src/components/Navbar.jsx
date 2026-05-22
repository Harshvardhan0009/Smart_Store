import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div>
        <h1 className="navbar-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="navbar-user-name">{user?.name || 'User'}</span>
        </div>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
