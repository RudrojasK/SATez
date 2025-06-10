import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Article, articles } from '../../constants/articles';

const externalResources = [
  {
    title: 'Official SAT Prep Materials',
    description: 'Direct links to College Board and official partner resources.',
    icon: 'book-outline',
    items: [
      { 
        title: 'Official SAT Study Guide', 
        type: 'PDF', 
        icon: 'document-text-outline', 
        action: () => Linking.openURL('https://collegereadiness.collegeboard.org/pdf/sat-study-guide-students.pdf')
      },
      { 
        title: 'Full-Length Digital SAT Practice', 
        type: 'Link', 
        icon: 'link-outline', 
        action: () => Linking.openURL('https://satsuite.collegeboard.org/digital/official-digital-sat-prep/full-length-practice')
      },
    ],
  },
  {
    title: 'Video Lessons & Tutorials',
    description: 'Curated video playlists for visual learners.',
    icon: 'videocam-outline',
    items: [
      { 
        title: 'Khan Academy SAT Math Playlist', 
        type: 'Video', 
        icon: 'logo-youtube', 
        action: () => Linking.openURL('https://www.youtube.com/playlist?list=PLSQl_2r4P1_2I7PooM1t40b9mGscvWvFe')
      },
      { 
        title: 'SAT Reading Section Tips', 
        type: 'Video', 
        icon: 'logo-youtube', 
        action: () => Linking.openURL('https://www.youtube.com/watch?v=kDi071Yv3-I')
      },
    ],
  },
  {
    title: 'Formula Sheets & Quick Guides',
    description: 'Handy references for math formulas and grammar rules.',
    icon: 'calculator-outline',
    items: [
      { 
        title: 'Math Formulas Reference Sheet', 
        type: 'PDF', 
        icon: 'document-attach-outline', 
        action: () => Linking.openURL('https://collegereadiness.collegeboard.org/pdf/sat-math-formula-reference-sheet.pdf')
      },
      { 
        title: 'Complete Guide to SAT Grammar Rules', 
        type: 'Article', 
        icon: 'newspaper-outline', 
        action: () => Linking.openURL('https://blog.prepscholar.com/the-complete-guide-to-sat-grammar-rules')
      },
    ],
  },
];

export default function ResourcesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Resources</Text>
      </View>
      <ScrollView style={styles.contentScrollView}>
        <View style={styles.resourceListContainer}>
          {/* In-App Articles */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="document-text-outline" size={26} color="#333" />
              <View>
                <Text style={styles.categoryTitle}>In-App Articles</Text>
                <Text style={styles.categoryDescription}>Read tips and strategies directly in the app.</Text>
              </View>
            </View>
            <View style={styles.resourceItemsWrapper}>
              {articles.map((article: Article) => (
                <TouchableOpacity 
                  key={article.id} 
                  style={styles.resourceItem} 
                  onPress={() => router.push(`/resource-detail?id=${article.id}`)}
                >
                  <Ionicons name="newspaper-outline" size={22} color="#007bff" style={styles.resourceIcon} />
                  <View style={styles.resourceTextContainer}>
                    <Text style={styles.resourceTitle}>{article.title}</Text>
                    <Text style={styles.resourceType}>{article.category} • {article.readingTime} min read</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* External Resources */}
          {externalResources.map((category, index) => (
            <View key={index} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={category.icon as any} size={26} color="#333" />
                <View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
              <View style={styles.resourceItemsWrapper}>
                {category.items.map((item, itemIndex) => (
                  <TouchableOpacity 
                    key={itemIndex} 
                    style={styles.resourceItem} 
                    onPress={item.action}
                  >
                    <Ionicons name={item.icon as any} size={22} color="#007bff" style={styles.resourceIcon} />
                    <View style={styles.resourceTextContainer}>
                      <Text style={styles.resourceTitle}>{item.title}</Text>
                      <Text style={styles.resourceType}>{item.type}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  contentScrollView: {
    flex: 1,
  },
  resourceListContainer: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 28,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resourceItemsWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  resourceType: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
