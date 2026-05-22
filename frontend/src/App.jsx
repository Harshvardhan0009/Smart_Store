import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isUser } from './services/auth';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminSignup from './pages/AdminSignup';

// Admin pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AIContent from './pages/AIContent';
import AdminOrders from './pages/AdminOrders';

// User pages
import UserDashboard from './pages/UserDashboard';
import Shop from './pages/Shop';
import MyOrders from './pages/MyOrders';

import './index.css';

// Any logged-in user
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

// Admin only
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

// User (customer) only
const UserRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isUser()) return <Navigate to="/" replace />;
  return children;
};

// Public route (redirect away if already logged in)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/admin/signup" element={<PublicRoute><AdminSignup /></PublicRoute>} />

        {/* ── Admin routes ── */}
        <Route path="/" element={
          <ProtectedRoute>
            {isAdmin() ? <Dashboard /> : <UserDashboard />}
          </ProtectedRoute>
        } />
        <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
        <Route path="/ai-content" element={<AdminRoute><AIContent /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

        {/* ── User (customer) routes ── */}
        <Route path="/shop" element={<UserRoute><Shop /></UserRoute>} />
        <Route path="/my-orders" element={<UserRoute><MyOrders /></UserRoute>} />

        {/* ── Catch all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
