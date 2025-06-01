import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import AdvancedProgressChart from '../../components/AdvancedProgressChart';
import DashboardCard from '../../components/DashboardCard';
import SkeletonLoader from '../../components/SkeletonLoader';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Enhanced loading animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  // Staggered animation values for cards
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Start epic loading sequence
    startLoadingAnimations();
    
    // Simulate data loading
    const loadingTimer = setTimeout(() => {
      startContentAnimations();
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const startLoadingAnimations = () => {
    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing background effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startContentAnimations = () => {
    // Main content fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations - this is sick!
    cardAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.spring(anim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Reset animations
    cardAnims.forEach(anim => anim.setValue(0));
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRefreshing(false);
    startContentAnimations();
  };

  // Sick animated interpolations
  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        {/* Epic loading background */}
        <Animated.View style={[styles.loadingBackground, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              { transform: [{ translateX: shimmerTranslateX }] }
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </Animated.View>

        {/* Floating loading indicator */}
        <Animated.View
          style={[
            styles.loadingIndicator,
            {
              transform: [
                { translateY: floatingTranslateY },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.loadingCircle}
          >
            <Ionicons name="rocket" size={32} color="#667eea" />
          </LinearGradient>
        </Animated.View>

        <Text style={styles.loadingText}>Loading something epic...</Text>
        
        {/* Animated dots */}
        <View style={styles.loadingDots}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: shimmerAnim,
                  transform: [
                    {
                      scale: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Loading skeleton preview */}
        <View style={styles.skeletonPreview}>
          <SkeletonLoader variant="card" count={2} />
        </View>
      </View>
    );
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshing ? <SkeletonLoader variant="card" count={1} /> : undefined}
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
            colors={['#667eea', '#764ba2']}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={styles.heroContent}>
              <Text style={styles.greeting}>Good morning, Rudra! 👋</Text>
              <Text style={styles.subtitle}>Ready to ace your SAT?</Text>
              
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={refreshing}
              >
                <Animated.View style={{ transform: [{ rotate: refreshing ? rotation : '0deg' }] }}>
                  <Ionicons name="refresh" size={20} color="#fff" />
                </Animated.View>
                <Text style={styles.refreshText}>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {[
              { title: 'Current Score', value: '1240', icon: 'trending-up', color: ['#4facfe', '#00f2fe'] },
              { title: 'Practice Tests', value: '12', icon: 'document-text', color: ['#43e97b', '#38f9d7'] },
              { title: 'Study Streak', value: '7 days', icon: 'flame', color: ['#fa709a', '#fee140'] },
              { title: 'Target Score', value: '1500', icon: 'star', color: ['#a8edea', '#fed6e3'] },
            ].map((stat, index) => (
              <Animated.View
                key={stat.title}
                style={[
                  styles.statCard,
                  {
                    opacity: cardAnims[index],
                    transform: [
                      {
                        scale: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                      {
                        translateY: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <DashboardCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon as any}
                  gradient={stat.color as [string, string]}
                  trend={index === 0 ? { value: '+45 this week', direction: 'up' } : undefined}
                />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Features Section with Advanced Cards */}
        <View style={styles.section}>
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
        </View>

        {/* Premium Study Plan Card */}
        <View style={styles.section}>
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
        </View>

        {/* Enhanced Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <AdvancedProgressChart
            data={[
              { 
                label: 'Math', 
                value: 720, 
                maxValue: 800, 
                color: '#4facfe', 
                gradient: ['#4facfe', '#00f2fe'] as const 
              },
              { 
                label: 'Reading', 
                value: 680, 
                maxValue: 750, 
                color: '#43e97b', 
                gradient: ['#43e97b', '#38f9d7'] as const 
              },
              { 
                label: 'Writing', 
                value: 650, 
                maxValue: 700, 
                color: '#fa709a', 
                gradient: ['#fa709a', '#fee140'] as const 
              },
            ]}
            title="SAT Score Progress"
          />
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
    paddingBottom: 40,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  heroContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
  },
  section: {
    margin: 16,
  },
  featuresContainer: {
    gap: 12,
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
  chartContainer: {
    padding: 20,
    paddingTop: 0,
  },
  loadingBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingIndicator: {
    position: 'absolute',
    top: height * 0.4,
    alignSelf: 'center',
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingText: {
    position: 'absolute',
    top: height * 0.55,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  loadingDots: {
    position: 'absolute',
    top: height * 0.6,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  skeletonPreview: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
});