import { articles } from '@/constants/articles';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TutorialsListScreen() {
  const router = useRouter();

  const categories = {
    Reading: articles.filter(a => a.category === 'Reading'),
    Writing: articles.filter(a => a.category === 'Writing'),
    Math: articles.filter(a => a.category === 'Math'),
    General: articles.filter(a => a.category === 'General')
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reading':
        return 'book-outline';
      case 'Writing':
        return 'create-outline';
      case 'Math':
        return 'calculator-outline';
      default:
        return 'school-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>
            SAT Tutorials
          </Text>

          {Object.entries(categories).map(([category, articles]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={getCategoryIcon(category)} size={24} color={COLORS.textLight} />
                <Text style={styles.categoryTitle}>
                  {category}
                </Text>
              </View>

              <View style={styles.articlesList}>
                {articles.map(article => (
                  <TouchableOpacity
                    key={article.id}
                    onPress={() => router.push(`/tutorials/${article.id}` as any)}
                    style={styles.articleCard}
                  >
                    <Text style={styles.articleTitle}>
                      {article.title}
                    </Text>
                    <Text style={styles.articleSummary}>
                      {article.summary}
                    </Text>
                    <View style={styles.articleFooter}>
                      <View style={styles.readingTime}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
                        <Text style={styles.readingTimeText}>
                          {article.readingTime} min read
                        </Text>
                      </View>
                      {article.progress.completed && (
                        <View style={styles.completedBadge}>
                          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                          <Text style={styles.completedText}>
                            Completed
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: SIZES.padding
  },
  title: {
    fontSize: FONTS.h1.fontSize,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.padding
  },
  categorySection: {
    marginBottom: 24
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  categoryTitle: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8
  },
  articlesList: {
    gap: 12
  },
  articleCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.small
  },
  articleTitle: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4
  },
  articleSummary: {
    fontSize: FONTS.body.fontSize,
    color: COLORS.textLight,
    marginBottom: 8
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  readingTimeText: {
    fontSize: FONTS.bodySmall.fontSize,
    color: COLORS.textLight,
    marginLeft: 4
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12
  },
  completedText: {
    fontSize: FONTS.bodySmall.fontSize,
    color: COLORS.success,
    marginLeft: 4
  }
}); 