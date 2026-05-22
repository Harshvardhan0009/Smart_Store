import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Fetch products error:', error);
    }
    setLoading(false);
  };

  const showNotification = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        showNotification('success', 'Product updated successfully!');
      } else {
        await api.post('/products', formData);
        showNotification('success', 'Product added successfully!');
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showNotification('success', 'Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      showNotification('error', 'Failed to delete product');
    }
  };

  const handleGenerateAI = async (type, productData) => {
    try {
      const res = await api.post(`/ai/${type}`, productData);
      return res.data[type] || res.data.description || res.data.tags || res.data.caption;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Products" />
        <div className="page-container">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title">Product Management</h2>
              <p className="page-description">Add, edit, and manage your store products</p>
            </div>
            {!showForm && (
              <button
                className="btn btn-primary"
                onClick={() => { setEditingProduct(null); setShowForm(true); }}
              >
                + Add Product
              </button>
            )}
          </div>

          {/* Notifications */}
          {message.text && (
            <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
              {message.text}
            </div>
          )}

          {/* Product Form Modal */}
          {showForm && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                  </h3>
                  <button className="modal-close" onClick={handleCancel}>×</button>
                </div>
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  onGenerateAI={handleGenerateAI}
                />
              </div>
            </div>
          )}

          {/* Product Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">All Products ({products.length})</h3>
            </div>
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
