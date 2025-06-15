import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Article } from '../../constants/articles';
import { ArticleHighlighter } from './ArticleHighlighter';
import { ArticleNotes } from './ArticleNotes';
import { ArticleProgress } from './ArticleProgress';
import { PracticeQuestions } from './PracticeQuestions';
import { RelatedArticles } from './RelatedArticles';
import { StudyTimer } from './StudyTimer';

interface TutorialViewProps {
  article: Article;
  onProgressUpdate?: (progress: Article['progress']) => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({
  article,
  onProgressUpdate
}) => {
  const [showPractice, setShowPractice] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleTimeUpdate = (minutes: number) => {
    setTimeSpent(minutes);
    onProgressUpdate?.({
      ...article.progress,
      timeSpent: minutes,
      lastRead: Date.now()
    });
  };

  const handleSessionComplete = (totalMinutes: number) => {
    onProgressUpdate?.({
      ...article.progress,
      timeSpent: totalMinutes,
      lastRead: Date.now(),
      completed: true
    });
  };

  const handlePracticeComplete = (score: number) => {
    // Update progress with practice score
    onProgressUpdate?.({
      ...article.progress,
      completed: true,
      lastRead: Date.now()
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Study Timer */}
        <StudyTimer
          onTimeUpdate={handleTimeUpdate}
          onSessionComplete={handleSessionComplete}
        />

        {/* Article Content with Highlighter */}
        <ArticleHighlighter
          article={article}
          onHighlightAdd={(highlight) => {
            // Handle highlight add
          }}
          onHighlightRemove={(highlightId) => {
            // Handle highlight remove
          }}
        />

        {/* Notes Section */}
        <ArticleNotes
          article={article}
          onNoteAdd={(note) => {
            // Handle note add
          }}
          onNoteDelete={(noteId) => {
            // Handle note delete
          }}
          onNotesUpdate={(notes) => {
            // Handle notes update
          }}
        />

        {/* Progress Tracking */}
        <ArticleProgress
          article={article}
          onProgressUpdate={onProgressUpdate}
        />

        {/* Practice Questions */}
        {showPractice ? (
          <PracticeQuestions
            article={article}
            onComplete={handlePracticeComplete}
          />
        ) : (
          <View style={styles.practiceButton}>
            <button
              onClick={() => setShowPractice(true)}
              style={{
                width: '100%',
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                color: 'white',
                borderRadius: SIZES.radius,
                border: 'none',
                cursor: 'pointer',
                ...SHADOWS.small
              }}
            >
              Start Practice Questions
            </button>
          </View>
        )}

        {/* Related Articles */}
        <RelatedArticles
          currentArticle={article}
          allArticles={[article]} // TODO: Pass all articles from parent
          onArticleSelect={(article) => {
            // Handle article select
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: SIZES.padding,
    gap: SIZES.padding
  },
  practiceButton: {
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding
  }
}); 