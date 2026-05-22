import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
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

  const downloadPDF = () => {
    if (!selectedProduct) return;

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

    // Helper to check for page overflow
    const checkPageOverflow = (neededHeight) => {
      if (y + neededHeight > pageHeight - margin - 15) {
        doc.addPage();
        y = 15;
        
        // Print running header on secondary pages
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`SmartStore AI - Product AI Report: ${stripEmojis(selectedProduct.name)}`, margin, 10);
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(margin, 11, pageWidth - margin, 11);
        y = 18;
      }
    };

    // Helper to wrap and print text lines
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

    // --- PAGE 1: BRANDING HEADER ---
    doc.setFillColor(99, 102, 241); // indigo-500
    doc.rect(margin, y, contentWidth, 3, 'F');
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('SMARTSTORE AI  •  PRODUCT INTELLIGENCE REPORT', margin, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(stripEmojis(selectedProduct.name), margin, y);
    y += 10;

    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('CATEGORY', margin + 8, y + 7);
    doc.text('BASE PRICE', margin + 55, y + 7);
    doc.text('STOCK LEVEL', margin + 105, y + 7);
    doc.text('GENERATED ON', margin + 148, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(stripEmojis(selectedProduct.category) || 'N/A', margin + 8, y + 13);
    doc.text(`INR ${selectedProduct.price?.toLocaleString('en-IN') || '0'}.00`, margin + 55, y + 13);
    doc.text(`${selectedProduct.stock || '0'} units`, margin + 105, y + 13);
    doc.text(new Date().toLocaleDateString(), margin + 148, y + 13);
    y += 28;

    // --- SECTIONS ---

    // 1. Description Section
    const descText = stripEmojis(results.description || selectedProduct.description || 'No description available.');
    checkPageOverflow(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    
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

    // 2. SEO Tags
    if (results.tags && results.tags.length > 0) {
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

      const tagsStr = results.tags.map(t => `#${stripEmojis(t)}`).join('   ');
      printWrappedText(tagsStr, 9.5, 'normal', [109, 40, 217], 5);
      y += 10;
    }

    // 3. Marketing Caption Block
    if (results.caption) {
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

      const cleanedCaption = stripEmojis(results.caption);
      const captionLines = doc.splitTextToSize(cleanedCaption, contentWidth - 12);
      const boxHeight = (captionLines.length * 5.5) + 8;
      checkPageOverflow(boxHeight + 8);

      doc.setFillColor(245, 243, 255); // purple-50
      doc.setDrawColor(139, 92, 246); // purple-500
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

    // 4. Suggestions
    if (results.suggestions) {
      checkPageOverflow(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      
      // Draw Emerald accent block
      doc.setFillColor(16, 185, 129);
      doc.rect(margin, y - 3.5, 3.5, 4.5, 'F');
      doc.text('Strategic Retail Insights', margin + 6, y);
      
      y += 5;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + 52, y);
      y += 6;

      if (typeof results.suggestions === 'object') {
        Object.entries(results.suggestions).forEach(([key, value]) => {
          const keyText = stripEmojis(key.replace(/([A-Z])/g, ' $1').trim().toUpperCase());
          const bulletTitle = `*  ${keyText}: `;
          const valueLines = doc.splitTextToSize(stripEmojis(value), contentWidth - 12);
          
          checkPageOverflow((valueLines.length * 5.5) + 6);
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(bulletTitle, margin, y);
          
          const titleWidth = doc.getTextWidth(bulletTitle);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          
          if (valueLines.length > 0) {
            doc.text(valueLines[0], margin + titleWidth, y);
            y += 5.5;
            for (let i = 1; i < valueLines.length; i++) {
              doc.text(valueLines[i], margin + titleWidth, y);
              y += 5.5;
            }
          }
          y += 2.5;
        });
      } else {
        printWrappedText(stripEmojis(results.suggestions), 9.5, 'normal', [71, 85, 105], 5.5);
      }
      y += 10;
    }

    // Stamps dynamic page numbers
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

    const filename = `${selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_ai_report.pdf`;
    doc.save(filename);
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
                <button 
                  className="btn btn-secondary" 
                  onClick={downloadPDF}
                  disabled={!selectedProduct || (!results.description && results.tags.length === 0 && !results.caption && !results.suggestions)}
                  style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}
                >
                  📥 Download PDF Report
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
