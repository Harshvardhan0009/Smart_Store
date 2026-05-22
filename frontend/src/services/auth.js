import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const signup = async (name, email, password) => {
  // Regular user signup — no adminKey
  const response = await api.post('/auth/signup', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const adminSignup = async (name, email, password, adminKey) => {
  const response = await api.post('/auth/signup', { name, email, password, adminKey });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export const isAdmin = () => getRole() === 'admin';
export const isUser = () => getRole() === 'user';
