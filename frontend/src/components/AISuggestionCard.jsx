const AISuggestionCard = ({ suggestions }) => {
  const defaultSuggestions = {
    pricingSuggestion: 'Add products and generate AI suggestions to get pricing insights.',
    trendingInsight: 'AI will analyze your product catalog for trending insights.',
    inventoryTip: 'Keep track of your stock levels for AI-powered inventory tips.',
    marketingTip: 'Get AI-generated marketing strategies for your products.',
  };

  const data = suggestions || defaultSuggestions;

  const cards = [
    {
      icon: '💰',
      title: 'Pricing Strategy',
      text: data.pricingSuggestion,
    },
    {
      icon: '📈',
      title: 'Trending Insight',
      text: data.trendingInsight,
    },
    {
      icon: '📦',
      title: 'Inventory Tip',
      text: data.inventoryTip,
    },
    {
      icon: '🎯',
      title: 'Marketing Tip',
      text: data.marketingTip,
    },
  ];

  return (
    <div className="suggestions-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="suggestion-card">
          <div className="suggestion-icon">{card.icon}</div>
          <div className="suggestion-title">{card.title}</div>
          <div className="suggestion-text">{card.text}</div>
        </div>
      ))}
    </div>
  );
};

export default AISuggestionCard;
