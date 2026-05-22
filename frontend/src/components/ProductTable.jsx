const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const getStockBadge = (stock) => {
    if (stock <= 5) return <span className="badge badge-danger">Critical: {stock}</span>;
    if (stock <= 10) return <span className="badge badge-warning">Low: {stock}</span>;
    return <span className="badge badge-success">In Stock: {stock}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span className="loading-text">Loading products...</span>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <p className="empty-state-text">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>AI</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {product.name}
                  </div>
                  {product.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {product.description.substring(0, 60)}...
                    </div>
                  )}
                </div>
              </td>
              <td>{product.category}</td>
              <td style={{ fontWeight: 600, color: 'var(--accent-secondary-light)' }}>
                ₹{product.price?.toLocaleString()}
              </td>
              <td>{getStockBadge(product.stock)}</td>
              <td>
                {product.aiGenerated ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary-light)' }}>✨ Yes</span>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No</span>
                )}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(product._id)}
                    title="Delete product"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
