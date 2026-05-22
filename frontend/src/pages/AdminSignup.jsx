import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminSignup } from '../services/auth';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminSignup(name, email, password, adminKey);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin signup failed. Check your secret key.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">🛡️ Admin Portal</h1>
            <p className="auth-subtitle">Create an admin account to manage the store</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-name">Full Name</label>
              <input id="admin-name" type="text" className="form-input" placeholder="Store Admin"
                value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="admin-email">Email Address</label>
              <input id="admin-email" type="email" className="form-input" placeholder="admin@store.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" className="form-input" placeholder="Min 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label htmlFor="admin-key">Admin Secret Key</label>
              <input id="admin-key" type="password" className="form-input" placeholder="Enter admin secret key"
                value={adminKey} onChange={(e) => setAdminKey(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner spinner-sm"></span> : null}
              {loading ? 'Creating admin...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="auth-link">
            Regular user? <Link to="/signup">Sign up here</Link>
            <span style={{ margin: '0 8px' }}>·</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
