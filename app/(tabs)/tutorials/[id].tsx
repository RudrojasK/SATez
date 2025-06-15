import { TutorialView } from '@/components/tutorials/TutorialView';
import { articles } from '@/constants/articles';
import { COLORS, FONTS } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function TutorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Article not found</Text>
      </SafeAreaView>
    );
  }

  const handleProgressUpdate = (progress: typeof article.progress) => {
    // TODO: Save progress to storage
    console.log('Progress updated:', progress);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TutorialView
        article={article}
        onProgressUpdate={handleProgressUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.textLight
  }
}); 