import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

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

  const downloadProductPDF = () => {
    if (!formData.name) return;

    const stripEmojis = (text) => {
      if (typeof text !== 'string') return text;
      let cleaned = text;
      try {
        cleaned = text.replace(/\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu, '');
      } catch (e) {
        cleaned = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');
      }
      return cleaned.replace(/[ \t]+/g, ' ').trim();
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    const checkPageOverflow = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin - 15) {
        doc.addPage();
        y = 15;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`SmartStore AI - Product AI Preview: ${stripEmojis(formData.name)}`, margin, 10);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 11, pageWidth - margin, 11);
        y = 18;
      }
    };

    const printWrappedText = (text, fontSize, fontStyle, textColor = [71, 85, 105], lineSpacing = 5.5) => {
      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        checkPageOverflow(lineSpacing);
        doc.text(line, margin, y);
        y += lineSpacing;
      });
    };

    // --- HEADER ---
    doc.setFillColor(99, 102, 241);
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('SMARTSTORE AI  •  PRODUCT LISTING PREVIEW SHEET', margin, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(stripEmojis(formData.name), margin, y);
    y += 10;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CATEGORY', margin + 8, y + 7);
    doc.text('EST. PRICE', margin + 55, y + 7);
    doc.text('STOCK LEVEL', margin + 105, y + 7);
    doc.text('GENERATED ON', margin + 148, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(stripEmojis(formData.category) || 'N/A', margin + 8, y + 13);
    doc.text(`INR ${Number(formData.price || 0).toLocaleString('en-IN')}.00`, margin + 55, y + 13);
    doc.text(`${formData.stock || '0'} units`, margin + 105, y + 13);
    doc.text(new Date().toLocaleDateString(), margin + 148, y + 13);
    y += 28;

    // --- SECTIONS ---
    const descText = stripEmojis(formData.description || 'No description available.');
    checkPageOverflow(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    
    // Draw Indigo accent block
    doc.setFillColor(99, 102, 241);
    doc.rect(margin, y - 3.5, 3.5, 4.5, 'F');
    doc.text('Product Description', margin + 6, y);
    
    y += 5;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + 45, y);
    y += 6;

    printWrappedText(descText, 10, 'normal', [71, 85, 105], 5.5);
    y += 10;

    if (formData.tags && formData.tags.length > 0) {
      checkPageOverflow(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      
      // Draw Purple accent block
      doc.setFillColor(139, 92, 246);
      doc.rect(margin, y - 3.5, 3.5, 4.5, 'F');
      doc.text('SEO Search Tags', margin + 6, y);
      
      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + 40, y);
      y += 6;

      const tagsStr = formData.tags.map(t => `#${stripEmojis(t)}`).join('   ');
      printWrappedText(tagsStr, 9.5, 'normal', [109, 40, 217], 5);
      y += 10;
    }

    if (formData.caption) {
      checkPageOverflow(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      
      // Draw Pink accent block
      doc.setFillColor(236, 72, 153);
      doc.rect(margin, y - 3.5, 3.5, 4.5, 'F');
      doc.text('Marketing & Social Copy', margin + 6, y);
      
      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + 52, y);
      y += 6;

      const cleanedCaption = stripEmojis(formData.caption);
      const captionLines = doc.splitTextToSize(cleanedCaption, contentWidth - 12);
      const boxHeight = (captionLines.length * 5.5) + 8;
      checkPageOverflow(boxHeight + 8);

      doc.setFillColor(245, 243, 255);
      doc.setDrawColor(139, 92, 246);
      doc.rect(margin, y, contentWidth, boxHeight, 'F');
      
      doc.setFillColor(139, 92, 246);
      doc.rect(margin, y, 2.5, boxHeight, 'F');

      let innerY = y + 5.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(91, 33, 182);
      captionLines.forEach(line => {
        doc.text(line, margin + 6, innerY);
        innerY += 5.5;
      });
      y += boxHeight + 10;
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('SmartStore AI  •  Confidential Product Intelligence Pack', margin, pageHeight - 8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - doc.getTextWidth(`Page ${i} of ${pageCount}`), pageHeight - 8);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    }

    const filename = `${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_ai_preview.pdf`;
    doc.save(filename);
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
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={downloadProductPDF}
          disabled={!formData.name || (!formData.description && formData.tags.length === 0 && !formData.caption)}
          style={{ gap: '0.4rem', display: 'inline-flex', alignItems: 'center', marginRight: 'auto', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.05)' }}
        >
          📥 Download AI PDF
        </button>
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
