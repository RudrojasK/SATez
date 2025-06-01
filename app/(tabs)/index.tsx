import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for the floating icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const features = [
    {
      title: 'Practice Tests',
      description: 'Full-length SAT practice tests with detailed explanations',
      icon: 'document-text',
      route: '/(tabs)/practice',
      color: '#6C5CE7',
      bgGradient: ['#6C5CE7', '#A29BFE'] as const,
    },
    {
      title: 'Vocabulary',
      description: 'Master essential SAT vocabulary words',
      icon: 'book',
      route: '/(tabs)/resources',
      color: '#00CEC9',
      bgGradient: ['#00CEC9', '#55EFC4'] as const,
    },
    {
      title: 'Math Mastery',
      description: 'Learn key formulas and problem-solving strategies',
      icon: 'calculator',
      route: '/(tabs)/resources',
      color: '#FD79A8',
      bgGradient: ['#FD79A8', '#FDCB6E'] as const,
    },
    {
      title: 'Reading Skills',
      description: 'Improve your critical reading skills',
      icon: 'glasses',
      route: '/(tabs)/resources',
      color: '#E17055',
      bgGradient: ['#E17055', '#FDCB6E'] as const,
    },
  ];

  const stats = [
    { label: 'Questions Solved', value: '1,247', icon: 'checkmark-circle', color: '#00CEC9' },
    { label: 'Study Streak', value: '12 days', icon: 'flame', color: '#E17055' },
    { label: 'Score Progress', value: '+180', icon: 'trending-up', color: '#6C5CE7' },
  ];

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2962ff" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Advanced Gradient & Animations */}
        <Animated.View 
          style={[
            styles.hero,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2962ff', '#1e3a8a', '#1e40af'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.heroTitle}>Ace the SAT with{'\n'}Confidence</Text>
                <Text style={styles.heroSubtitle}>
                  Personalized prep, expert tips, and thousands of practice questions.
                </Text>
                
                <Link href="/(tabs)/practice" asChild>
                  <TouchableOpacity style={styles.heroButton} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] as const}
                      style={styles.heroButtonGradient}
                    >
                      <Text style={styles.heroButtonText}>Start Practicing</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </View>
              
              <Animated.View 
                style={[
                  styles.heroFloatingIcon,
                  { transform: [{ rotate: spin }] }
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] as const}
                  style={styles.floatingIconGradient}
                >
                  <Ionicons name="school-outline" size={60} color="rgba(255,255,255,0.3)" />
                </LinearGradient>
              </Animated.View>
            </View>
            
            {/* Floating elements */}
            <View style={styles.floatingElement1} />
            <View style={styles.floatingElement2} />
            <View style={styles.floatingElement3} />
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View 
          style={[
            styles.statsSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Features Section with Advanced Cards */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <Link key={index} href={feature.route as any} asChild>
                <TouchableOpacity style={styles.featureCard} activeOpacity={0.9}>
                  <LinearGradient
                    colors={feature.bgGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featureCardGradient}
                  >
                    <View style={styles.featureIconContainer}>
                      <Ionicons name={feature.icon as any} size={28} color="#FFF" />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                    
                    <View style={styles.featureArrow}>
                      <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </Animated.View>

        {/* Premium Study Plan Card */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Recommended Plan</Text>
          <View style={styles.premiumCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumCardGradient}
            >
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>✨ PREMIUM</Text>
              </View>
              
              <Text style={styles.premiumTitle}>30-Day SAT Mastery</Text>
              <Text style={styles.premiumDescription}>
                Intensive preparation plan designed by SAT experts to boost your score significantly.
              </Text>
              
              <View style={styles.premiumFeatures}>
                <View style={styles.premiumFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <Text style={styles.premiumFeatureText}>Daily practice tests</Text>
                </View>
                <View style={styles.premiumFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <Text style={styles.premiumFeatureText}>Video explanations</Text>
                </View>
                <View style={styles.premiumFeature}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <Text style={styles.premiumFeatureText}>Progress tracking</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.premiumButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D'] as const}
                  style={styles.premiumButtonGradient}
                >
                  <Text style={styles.premiumButtonText}>Start Free Trial</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
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
    paddingBottom: 40,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#2962ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroGradient: {
    padding: 24,
    minHeight: 280,
    position: 'relative',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  heroText: {
    flex: 1,
    paddingRight: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    lineHeight: 22,
  },
  heroButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  heroFloatingIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 40,
    overflow: 'hidden',
  },
  floatingIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingElement1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -50,
    right: -30,
  },
  floatingElement2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -30,
    left: -20,
  },
  floatingElement3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: 120,
    right: 80,
  },
  statsSection: {
    margin: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    margin: 16,
    marginTop: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featureCardGradient: {
    padding: 20,
    minHeight: 160,
    position: 'relative',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  featureArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  premiumCardGradient: {
    padding: 24,
    position: 'relative',
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  premiumFeatures: {
    marginBottom: 24,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  premiumFeatureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  premiumButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});