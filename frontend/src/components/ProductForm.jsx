import { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel, onGenerateAI }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    tags: [],
    caption: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Electronics',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        tags: product.tags || [],
        caption: product.caption || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAIGenerate = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const result = await onGenerateAI(type, formData);
      if (type === 'description') {
        setFormData((prev) => ({ ...prev, description: result }));
      } else if (type === 'tags') {
        const tags = Array.isArray(result) ? result : [result];
        setFormData((prev) => ({ ...prev, tags }));
      } else if (type === 'caption') {
        setFormData((prev) => ({ ...prev, caption: result }));
      }
    } catch (err) {
      console.error('AI generation error:', err);
    }
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      aiGenerated: !!(formData.description || formData.tags.length || formData.caption),
    });
  };

  const categories = ['Electronics', 'Fashion', 'Home & Office', 'Lifestyle', 'Fitness', 'Kitchen', 'Books', 'Beauty', 'Sports', 'Other'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="product-form-grid">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            name="price"
            className="form-input"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity *</label>
          <input
            type="number"
            name="stock"
            className="form-input"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            className="form-textarea"
            placeholder="Enter product description or use AI to generate..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label>Tags</label>
          <input
            type="text"
            className="form-input"
            placeholder="Type a tag and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          {formData.tags.length > 0 && (
            <div className="tags-display">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                  <span className="tag-remove" onClick={() => handleRemoveTag(tag)}>×</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group full-width">
          <label>Marketing Caption</label>
          <textarea
            name="caption"
            className="form-textarea"
            placeholder="Enter marketing caption or use AI to generate..."
            value={formData.caption}
            onChange={handleChange}
            rows={2}
          />
        </div>
      </div>

      <div className="ai-actions">
        <button
          type="button"
          className="btn btn-ai btn-sm"
          onClick={() => handleAIGenerate('description')}
          disabled={!formData.name || loading.description}
        >
          {loading.description ? <span className="spinner spinner-sm"></span> : null}
          Generate Description
        </button>
        <button
          type="button"
          className="btn btn-ai btn-sm"
          onClick={() => handleAIGenerate('tags')}
          disabled={!formData.name || loading.tags}
        >
          {loading.tags ? <span className="spinner spinner-sm"></span> : null}
          Generate Tags
        </button>
        <button
          type="button"
          className="btn btn-ai btn-sm"
          onClick={() => handleAIGenerate('caption')}
          disabled={!formData.name || loading.caption}
        >
          {loading.caption ? <span className="spinner spinner-sm"></span> : null}
          Generate Caption
        </button>
      </div>

      <div className="modal-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
