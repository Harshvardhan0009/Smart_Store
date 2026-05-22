import api from './api';

export const placeOrder = async (items) => {
  const response = await api.post('/orders', { items });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/mine');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}`, { status });
  return response.data;
};
