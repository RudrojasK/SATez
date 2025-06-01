import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const features = [
    {
      title: 'Practice Tests',
      description: 'Full-length SAT practice tests with detailed explanations',
      icon: 'document-text',
      route: '/practice',
    },
    {
      title: 'Vocabulary',
      description: 'Master essential SAT vocabulary words',
      icon: 'book',
      route: '/resources',
    },
    {
      title: 'Math Tips',
      description: 'Learn key formulas and problem-solving strategies',
      icon: 'calculator',
      route: '/resources',
    },
    {
      title: 'Reading Comprehension',
      description: 'Improve your critical reading skills',
      icon: 'glasses',
      route: '/resources',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.textContainer}>
            <Text style={styles.heroTitle}>Ace the SAT with Confidence</Text>
            <Text style={styles.heroSubtitle}>
              Personalized prep, expert tips, and thousands of practice questions to help you succeed.
            </Text>
            <Link href="/practice" asChild>
              <TouchableOpacity 
                style={styles.heroButton}
                activeOpacity={0.8}
              >
                <Text style={styles.heroButtonText}>Start Practicing</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.heroIconContainer}>
            <Ionicons name="school-outline" size={100} color="rgba(255, 255, 255, 0.3)" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <TouchableOpacity key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon as any} size={32} color="#2962ff" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Plans</Text>
          <View style={styles.studyPlanCard}>
            <View style={styles.studyPlanHeader}>
              <View style={styles.studyPlanBadge}>
                <Text style={styles.studyPlanBadgeText}>Popular</Text>
              </View>
              <Text style={styles.studyPlanTitle}>30-Day SAT Prep</Text>
              <Text style={styles.studyPlanDescription}>
                A structured plan to boost your SAT score in just 30 days.
              </Text>
            </View>
            <View style={styles.studyPlanFooter}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.studyPlanInfo}>30 Days</Text>
              </View>
              <TouchableOpacity style={styles.studyPlanButton}>
                <Text style={styles.studyPlanButtonText}>View Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  hero: {
    position: 'relative',
    backgroundColor: '#2962ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    minHeight: 200,
  },
  textContainer: {
    maxWidth: '75%',
    paddingRight: 16,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  heroIconContainer: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    opacity: 0.3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(41, 98, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  studyPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studyPlanHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  studyPlanBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  studyPlanBadgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  studyPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  studyPlanDescription: {
    fontSize: 14,
    color: '#666',
  },
  studyPlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyPlanInfo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  studyPlanButton: {
    backgroundColor: '#2962ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  studyPlanButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});