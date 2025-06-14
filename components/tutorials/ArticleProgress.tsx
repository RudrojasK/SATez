import { COLORS, FONTS, SIZES } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Article } from '../../constants/articles';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface ArticleProgressProps {
  article: Article;
  onProgressUpdate?: (progress: Article['progress']) => void;
}

export const ArticleProgress: React.FC<ArticleProgressProps> = ({
  article,
  onProgressUpdate
}) => {
  const progress = article.progress.sectionsCompleted.length / 5; // Assuming 5 sections per article

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% Complete
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time Spent</Text>
          <Text style={styles.statValue}>{article.progress.timeSpent} min</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Last Read</Text>
          <Text style={styles.statValue}>
            {new Date(article.progress.lastRead).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.padding
  },
  title: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.padding
  },
  progressContainer: {
    marginBottom: SIZES.padding
  },
  progressText: {
    fontSize: FONTS.body.fontSize,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'right'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stat: {
    flex: 1
  },
  statLabel: {
    fontSize: FONTS.bodySmall.fontSize,
    color: COLORS.textLight,
    marginBottom: 2
  },
  statValue: {
    fontSize: FONTS.body.fontSize,
    color: COLORS.text
  }
}); 