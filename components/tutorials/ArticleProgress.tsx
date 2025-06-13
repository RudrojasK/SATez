import React from 'react';
import { Article, ArticleProgress as ArticleProgressType } from '../../constants/articles';

interface ArticleProgressProps {
  article: Article;
  onProgressUpdate?: (progress: ArticleProgressType) => void;
}

export const ArticleProgress: React.FC<ArticleProgressProps> = ({
  article,
  onProgressUpdate
}) => {
  const calculateProgress = () => {
    const totalSections = article.content.split('##').length - 1;
    const completedSections = article.progress.sectionsCompleted.length;
    return (completedSections / totalSections) * 100;
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleSectionComplete = (section: string) => {
    const newProgress: ArticleProgressType = {
      ...article.progress,
      sectionsCompleted: [...article.progress.sectionsCompleted, section],
      timeSpent: article.progress.timeSpent + 1,
      lastRead: Date.now()
    };
    onProgressUpdate?.(newProgress);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Reading Progress</h3>
        <span className="text-sm text-gray-500">
          {formatTimeSpent(article.progress.timeSpent)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {article.content.split('##').slice(1).map((section, index) => {
          const sectionTitle = section.split('\n')[0].trim();
          const isCompleted = article.progress.sectionsCompleted.includes(sectionTitle);
          
          return (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => handleSectionComplete(sectionTitle)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className={isCompleted ? 'line-through text-gray-500' : ''}>
                {sectionTitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      {article.progress.completed && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          🎉 Article completed!
        </div>
      )}
    </div>
  );
}; 