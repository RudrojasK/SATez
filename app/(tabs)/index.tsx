import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { Card } from '@/components/Card';

export default function HomeScreen() {
  const router = useRouter();

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

  const carouselItems = features.map((feature, index) => (
    <Link 
      key={index} 
      href={feature.route as any}
      asChild
    >
      <TouchableOpacity 
        style={styles.carouselItem} 
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={feature.title}
      >
        <View style={styles.carouselIconContainer}>
          <Ionicons name={feature.icon as any} size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.carouselTitle}>{feature.title}</Text>
        <Text style={styles.carouselDescription}>{feature.description}</Text>
      </TouchableOpacity>
    </Link>
  ));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <ScrollView 
        style={styles.container} 
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
                accessibilityRole="button"
                accessibilityLabel="Start Practicing"
              >
                <Text style={styles.heroButtonText}>Start Practicing</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </Link>
          </View>
          <Image 
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <Carousel 
            data={carouselItems} 
            height={220} 
            autoPlay
            autoPlayInterval={5000}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Plans</Text>
          <Card style={styles.studyPlanCard}>
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
                <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.studyPlanInfo}>30 Days</Text>
              </View>
              <Link href="/practice" asChild>
                <TouchableOpacity 
                  style={styles.studyPlanButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.studyPlanButtonText}>View Plan</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.footerSection}>
            <Ionicons name="rocket-outline" size={32} color={COLORS.primary} />
            <Text style={styles.footerTitle}>Ready to improve your score?</Text>
            <Text style={styles.footerDescription}>
              Start practicing today and track your progress.
            </Text>
            <Link href="/practice" asChild>
              <TouchableOpacity 
                style={styles.footerOutlineButton}
                activeOpacity={0.8}
              >
                <Text style={styles.footerOutlineButtonText}>Go to Practice</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  hero: {
    position: 'relative',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
    overflow: 'hidden',
    ...SHADOWS.medium,
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
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
    marginTop: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 4, // For platforms that don't support gap
  },
  heroImage: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 150,
    height: 150,
    opacity: 0.3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  carouselItem: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: '5%',
    marginVertical: 8,
    height: 200,
    ...SHADOWS.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  carouselDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  studyPlanCard: {
    padding: 0,
    overflow: 'hidden',
  },
  studyPlanHeader: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    position: 'relative',
  },
  studyPlanBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: SIZES.smallRadius,
  },
  studyPlanBadgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  studyPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
  studyPlanDescription: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  studyPlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyPlanInfo: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  studyPlanButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.smallRadius,
  },
  studyPlanButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  footerSection: {
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 8,
    textAlign: 'center',
  },
  footerDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  footerOutlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 160,
  },
  footerOutlineButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
