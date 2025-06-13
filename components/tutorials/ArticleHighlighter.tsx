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

  // Function to render article content with highlights
  const renderArticleContent = () => {
    const sections = article.content.split('##');
    return sections.map((section, sectionIndex) => {
      if (sectionIndex === 0) {
        // Title section
        return (
          <div key="title" className="mb-6">
            <h1 className="text-2xl font-bold">{section.trim()}</h1>
          </div>
        );
      }

      // Content sections
      const [title, ...content] = section.split('\n');
      const sectionText = content.join('\n').trim();

      return (
        <div key={sectionIndex} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{title.trim()}</h2>
          <div className="prose max-w-none">
            {sectionText.split('\n').map((paragraph, pIndex) => {
              // Check if this paragraph contains any highlights
              const paragraphHighlights = article.highlights.filter(h => 
                paragraph.includes(h.text)
              );

              if (paragraphHighlights.length === 0) {
                return <p key={pIndex}>{paragraph}</p>;
              }

              // Split paragraph by highlights and render with highlights
              let lastIndex = 0;
              const parts = [];

              paragraphHighlights.forEach(highlight => {
                const index = paragraph.indexOf(highlight.text, lastIndex);
                if (index > lastIndex) {
                  parts.push(paragraph.slice(lastIndex, index));
                }
                parts.push(
                  <span
                    key={highlight.id}
                    style={{ backgroundColor: highlight.color }}
                    className="px-1 rounded relative group"
                  >
                    {highlight.text}
                    <button
                      onClick={() => onHighlightRemove?.(highlight.id)}
                      className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
                lastIndex = index + highlight.text.length;
              });

              if (lastIndex < paragraph.length) {
                parts.push(paragraph.slice(lastIndex));
              }

              return <p key={pIndex}>{parts}</p>;
            })}
          </div>
        </div>
      );
    });
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
        {renderArticleContent()}
      </div>
    </div>
  );
}; 