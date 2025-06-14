import React from 'react';
import { Article } from '../../constants/articles';

interface RelatedArticlesProps {
  currentArticle: Article;
  allArticles: Article[];
  onArticleSelect?: (article: Article) => void;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentArticle,
  allArticles,
  onArticleSelect
}) => {
  const findRelatedArticles = () => {
    // Filter out current article
    const otherArticles = allArticles.filter(a => a.id !== currentArticle.id);
    
    // Find articles in same category
    const sameCategory = otherArticles.filter(
      a => a.category === currentArticle.category
    );

    // Extract keywords from title and summary
    const keywords = new Set([
      ...currentArticle.title.toLowerCase().split(' '),
      ...currentArticle.summary.toLowerCase().split(' '),
      ...currentArticle.content.toLowerCase().split(' ')
    ]);

    // Remove common words
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
    keywords.forEach(word => {
      if (commonWords.has(word) || word.length < 3) {
        keywords.delete(word);
      }
    });

    // Calculate relevance score for each article
    const scoredArticles = otherArticles.map(article => {
      let score = 0;
      
      // Category match
      if (article.category === currentArticle.category) {
        score += 3;
      }

      // Title and summary keyword matches
      const articleText = (
        article.title.toLowerCase() + ' ' +
        article.summary.toLowerCase() + ' ' +
        article.content.toLowerCase()
      );

      keywords.forEach(keyword => {
        if (articleText.includes(keyword)) {
          score += 1;
        }
      });

      // Reading time similarity
      const timeDiff = Math.abs(article.readingTime - currentArticle.readingTime);
      if (timeDiff <= 2) {
        score += 1;
      }

      return { article, score };
    });

    // Sort by score and return top 3
    return scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.article);
  };

  const relatedArticles = findRelatedArticles();

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
      
      <div className="space-y-4">
        {relatedArticles.map(article => (
          <button
            key={article.id}
            onClick={() => onArticleSelect?.(article)}
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{article.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
              </div>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {article.category}
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{article.readingTime} min read</span>
              {article.progress.completed && (
                <span className="ml-2 text-green-600">✓ Completed</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 