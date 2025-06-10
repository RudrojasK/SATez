import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Article, articles } from '../constants/articles';

export default function ResourceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const article = articles.find((a: Article) => a.id === id);

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text>Article not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Basic markdown renderer
  const renderContent = (content: string) => {
    return content.split('\\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <Text key={index} style={styles.h1}>{line.substring(2)}</Text>;
      }
      if (line.startsWith('## ')) {
        return <Text key={index} style={styles.h2}>{line.substring(3)}</Text>;
      }
      if (line.startsWith('### ')) {
        return <Text key={index} style={styles.h3}>{line.substring(4)}</Text>;
      }
      if (line.startsWith('- ')) {
        return <Text key={index} style={styles.listItem}>• {line.substring(2)}</Text>;
      }
      if(line.trim() === '') {
        return <View key={index} style={{ height: 16 }} />;
      }
      return <Text key={index} style={styles.paragraph}>{line}</Text>;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{article.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{article.category}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{article.readingTime} min read</Text>
          </View>
          <View style={styles.separator} />
          {renderContent(article.content)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#444',
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#555',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginBottom: 8,
    marginLeft: 10,
  }
});
