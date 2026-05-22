import { useState, useEffect } from 'react';
import api from '../services/api';
import { placeOrder } from '../services/orders';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const categoryColors = {
  Electronics: '#6366f1',
  Fashion: '#ec4899',
  'Home & Office': '#14b8a6',
  Fitness: '#f97316',
  Kitchen: '#eab308',
  Lifestyle: '#8b5cf6',
  default: '#64748b',
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({}); // { productId: quantity }
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filtered = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const setQty = (id, qty) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  };

  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0);
  const cartTotal = cartItems.reduce((sum, [id, qty]) => {
    const p = products.find((x) => x._id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    setOrdering(true);
    setOrderError('');
    setOrderSuccess('');
    try {
      const items = cartItems.map(([productId, quantity]) => ({ productId, quantity }));
      await placeOrder(items);
      setCart({});
      setOrderSuccess('🎉 Order placed successfully! Check your orders page.');
      // Refresh products to reflect stock changes
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">🛍️ Shop</h1>
              <p className="page-subtitle">Browse and order products from our store</p>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cart Summary Bar */}
          {cartItems.length > 0 && (
            <div className="card" style={{
              marginBottom: '1.5rem', padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              border: 'none'
            }}>
              <div style={{ color: '#fff' }}>
                🛒 <strong>{cartItems.length}</strong> item(s) · Total:&nbsp;
                <strong>₹{cartTotal.toLocaleString()}</strong>
              </div>
              <button className="btn" onClick={handleOrder} disabled={ordering}
                style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}>
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}

          {orderSuccess && <div className="success-message" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#22c55e' }}>{orderSuccess}</div>}
          {orderError && <div className="error-message" style={{ marginBottom: '1rem' }}>{orderError}</div>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading products...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {filtered.map((product) => {
                const qty = cart[product._id] || 0;
                const color = categoryColors[product.category] || categoryColors.default;
                const outOfStock = product.stock === 0;
                return (
                  <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', opacity: outOfStock ? 0.6 : 1 }}>
                    {/* Color header strip */}
                    <div style={{ height: '6px', background: color }} />
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color, background: `${color}22`, padding: '2px 8px', borderRadius: '20px' }}>
                          {product.category}
                        </span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 600 }}>
                            ⚠️ Only {product.stock} left
                          </span>
                        )}
                        {outOfStock && (
                          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </p>
                      )}
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                        ₹{product.price.toLocaleString()}
                      </div>

                      {/* Quantity + Add controls */}
                      {!outOfStock && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button onClick={() => setQty(product._id, qty - 1)}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '1rem', minWidth: '32px' }}>−</button>
                          <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>{qty}</span>
                          <button onClick={() => setQty(product._id, Math.min(qty + 1, product.stock))}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '1rem', minWidth: '32px' }}>+</button>
                          {qty > 0 && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                              ₹{(product.price * qty).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
