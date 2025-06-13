import React, { useState } from 'react';
import { Article, ArticleHighlight } from '../../constants/articles';

interface ArticleHighlighterProps {
  article: Article;
  onHighlightAdd?: (highlight: ArticleHighlight) => void;
  onHighlightRemove?: (highlightId: string) => void;
}

export const ArticleHighlighter: React.FC<ArticleHighlighterProps> = ({
  article,
  onHighlightAdd,
  onHighlightRemove
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [highlightType, setHighlightType] = useState<ArticleHighlight['type']>('key-point');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  const handleHighlight = () => {
    if (!selectedText) return;

    const newHighlight: ArticleHighlight = {
      id: `highlight-${Date.now()}`,
      text: selectedText,
      type: highlightType,
      color: getColorForType(highlightType)
    };

    onHighlightAdd?.(newHighlight);
    setSelectedText('');
  };

  const getColorForType = (type: ArticleHighlight['type']): string => {
    switch (type) {
      case 'main-idea':
        return '#FFD700'; // Gold
      case 'key-point':
        return '#FFB6C1'; // Light pink
      case 'example':
        return '#90EE90'; // Light green
      case 'tip':
        return '#87CEEB'; // Sky blue
      default:
        return '#FFD700';
    }
  };

  return (
    <div className="relative">
      {/* Highlight Controls */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex flex-col gap-2">
          <select
            value={highlightType}
            onChange={(e) => setHighlightType(e.target.value as ArticleHighlight['type'])}
            className="p-2 border rounded"
          >
            <option value="main-idea">Main Idea</option>
            <option value="key-point">Key Point</option>
            <option value="example">Example</option>
            <option value="tip">Tip</option>
          </select>
          
          {selectedText && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected: "{selectedText}"</p>
              <button
                onClick={handleHighlight}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Highlight
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Article Content with Highlights */}
      <div 
        className="prose max-w-none"
        onMouseUp={handleTextSelection}
      >
        {article.highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="relative group"
          >
            <span
              style={{ backgroundColor: highlight.color }}
              className="px-1 rounded"
            >
              {highlight.text}
            </span>
            <button
              onClick={() => onHighlightRemove?.(highlight.id)}
              className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 