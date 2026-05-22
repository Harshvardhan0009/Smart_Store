import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const AIContent = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [results, setResults] = useState({
    description: '',
    tags: [],
    caption: '',
    suggestions: null,
  });
  const [loading, setLoading] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
      if (res.data.length > 0) {
        setSelectedProduct(res.data[0]);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
    setFetchLoading(false);
  };

  const handleGenerate = async (type) => {
    if (!selectedProduct) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const endpoint = type === 'suggestions' ? '/ai/suggestions' : `/ai/${type}`;
      const res = await api.post(endpoint, {
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        features: selectedProduct.description,
      });

      setResults((prev) => ({
        ...prev,
        [type]: res.data[type] || res.data.description || res.data.tags || res.data.caption || res.data.suggestions,
      }));
    } catch (error) {
      console.error(`AI ${type} generation error:`, error);
    }
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  const handleGenerateAll = async () => {
    await Promise.all([
      handleGenerate('description'),
      handleGenerate('tags'),
      handleGenerate('caption'),
      handleGenerate('suggestions'),
    ]);
  };

  if (fetchLoading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Navbar title="AI Content" />
          <div className="page-container">
            <div className="loading-container">
              <div className="spinner"></div>
              <span className="loading-text">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="AI Content Generator" />
        <div className="page-container">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title">AI Content Generator</h2>
              <p className="page-description">Generate descriptions, tags, captions, and insights using AI</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🤖</div>
                <p className="empty-state-text">Add some products first to generate AI content</p>
              </div>
            </div>
          ) : (
            <>
              {/* Product Selector */}
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div className="card-header">
                  <h3 className="card-title">Select Product</h3>
                </div>
                <div className="form-group">
                  <select
                    className="form-select"
                    value={selectedProduct?._id || ''}
                    onChange={(e) => {
                      const product = products.find((p) => p._id === e.target.value);
                      setSelectedProduct(product);
                      setResults({ description: '', tags: [], caption: '', suggestions: null });
                    }}
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — {p.category} — ₹{p.price}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</span>
                      <div style={{ fontWeight: 500 }}>{selectedProduct.category}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price</span>
                      <div style={{ fontWeight: 500, color: 'var(--accent-secondary-light)' }}>₹{selectedProduct.price?.toLocaleString()}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock</span>
                      <div style={{ fontWeight: 500 }}>{selectedProduct.stock} units</div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Actions */}
              <div className="ai-actions" style={{ marginBottom: '1.25rem' }}>
                <button className="btn btn-ai" onClick={() => handleGenerate('description')} disabled={loading.description}>
                  {loading.description ? <span className="spinner spinner-sm"></span> : null}
                  Generate Description
                </button>
                <button className="btn btn-ai" onClick={() => handleGenerate('tags')} disabled={loading.tags}>
                  {loading.tags ? <span className="spinner spinner-sm"></span> : null}
                  Generate SEO Tags
                </button>
                <button className="btn btn-ai" onClick={() => handleGenerate('caption')} disabled={loading.caption}>
                  {loading.caption ? <span className="spinner spinner-sm"></span> : null}
                  Generate Caption
                </button>
                <button className="btn btn-ai" onClick={() => handleGenerate('suggestions')} disabled={loading.suggestions}>
                  {loading.suggestions ? <span className="spinner spinner-sm"></span> : null}
                  Get AI Suggestions
                </button>
                <button className="btn btn-primary" onClick={handleGenerateAll}>
                  🚀 Generate All
                </button>
              </div>

              {/* Results */}
              <div className="dashboard-grid">
                {/* Description Result */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📝 Product Description</h3>
                  </div>
                  {results.description ? (
                    <div className="ai-result">
                      <div className="ai-result-header">✨ AI Generated</div>
                      <div className="ai-result-content">{results.description}</div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p className="empty-state-text">Click "Generate Description" to create AI content</p>
                    </div>
                  )}
                </div>

                {/* Tags Result */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">🏷️ SEO Tags</h3>
                  </div>
                  {results.tags && results.tags.length > 0 ? (
                    <div className="ai-result">
                      <div className="ai-result-header">✨ AI Generated</div>
                      <div className="tags-display">
                        {results.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p className="empty-state-text">Click "Generate SEO Tags" to create tags</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption & Suggestions */}
              <div className="dashboard-grid" style={{ marginTop: '1.25rem' }}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📣 Marketing Caption</h3>
                  </div>
                  {results.caption ? (
                    <div className="ai-result">
                      <div className="ai-result-header">✨ AI Generated</div>
                      <div className="ai-result-content">{results.caption}</div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p className="empty-state-text">Click "Generate Caption" to create marketing content</p>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">🤖 AI Insights</h3>
                  </div>
                  {results.suggestions ? (
                    <div className="ai-result">
                      <div className="ai-result-header">✨ AI Suggestions</div>
                      <div className="ai-result-content">
                        {typeof results.suggestions === 'object' ? (
                          <ul style={{ paddingLeft: '1rem' }}>
                            {Object.entries(results.suggestions).map(([key, value]) => (
                              <li key={key} style={{ marginBottom: '0.5rem', listStyle: 'disc' }}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}: </strong>
                                {value}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>{results.suggestions}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p className="empty-state-text">Click "Get AI Suggestions" for insights</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContent;
