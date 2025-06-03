import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    RefreshControl,
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
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // Card animations
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Start loading sequence
    const loadingTimer = setTimeout(() => {
      startContentAnimations();
      setIsLoading(false);
    }, 1500);

    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(timeInterval);
    };
  }, []);

  const startContentAnimations = () => {
    // Main content animations
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

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 150),
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
    setCurrentTime(new Date());
    
    // Reset animations
    cardAnims.forEach(anim => anim.setValue(0));
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRefreshing(false);
    startContentAnimations();
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.loadingContainer}
        >
          <Animated.View
            style={[
              styles.loadingContent,
              { transform: [{ translateY: floatingTransform }] }
            ]}
          >
            <View style={styles.loadingIcon}>
              <Ionicons name="rocket" size={40} color="#fff" />
            </View>
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      opacity: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                      transform: [
                        {
                          scale: floatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const quickActions = [
    {
      title: 'Practice Test',
      description: 'Take a full SAT practice test',
      icon: 'document-text',
      route: '/(tabs)/practice',
      gradient: ['#667eea', '#764ba2'] as const,
    },
    {
      title: 'Vocabulary',
      description: 'Learn new SAT words',
      icon: 'book',
      route: '/(tabs)/vocabpractice',
      gradient: ['#00c9ff', '#92fe9d'] as const,
    },
    {
      title: 'Resources',
      description: 'Study materials & guides',
      icon: 'library',
      route: '/(tabs)/resources',
      gradient: ['#fc466b', '#3f5efb'] as const,
    },
    {
      title: 'AI Tutor',
      description: 'Get personalized help',
      icon: 'school',
      route: '/(tabs)/tutor',
      gradient: ['#fdbb2d', '#22c1c3'] as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
            title="Pull to refresh"
            titleColor="#667eea"
          />
        }
      >
        {/* Hero Section */}
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
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.greeting}>{getGreeting()}, Rudra! 👋</Text>
              <Text style={styles.subtitle}>Ready to boost your SAT score?</Text>
              
              <View style={styles.streakContainer}>
                <View style={styles.streakIcon}>
                  <Ionicons name="flame" size={20} color="#ff6b6b" />
                </View>
                <Text style={styles.streakText}>7-day study streak! 🔥</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {[
              { title: 'Current Score', value: '1,240', icon: 'trending-up', gradient: ['#4facfe', '#00f2fe'] as const, change: '+45' },
              { title: 'Practice Tests', value: '12', icon: 'document-text', gradient: ['#43e97b', '#38f9d7'] as const, change: '+3' },
              { title: 'Study Hours', value: '42h', icon: 'time', gradient: ['#fa709a', '#fee140'] as const, change: '+8h' },
              { title: 'Accuracy', value: '78%', icon: 'checkmark-circle', gradient: ['#a8edea', '#fed6e3'] as const, change: '+12%' },
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
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity style={styles.statCardInner} activeOpacity={0.8}>
                  <LinearGradient
                    colors={stat.gradient}
                    style={styles.statCardGradient}
                  >
                    <View style={styles.statHeader}>
                      <Ionicons name={stat.icon as any} size={24} color="#fff" />
                      <Text style={styles.statChange}>+{stat.change}</Text>
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.route as any} asChild>
                <TouchableOpacity 
                  style={styles.actionCard}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={action.gradient}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionIcon}>
                      <Ionicons name={action.icon as any} size={28} color="#fff" />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {[
              { title: 'Completed Math Practice', time: '2 hours ago', icon: 'calculator', color: '#667eea' },
              { title: 'Learned 15 new vocabulary words', time: '1 day ago', icon: 'book', color: '#00c9ff' },
              { title: 'Scored 1280 on practice test', time: '3 days ago', icon: 'trophy', color: '#fdbb2d' },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                  <Ionicons name={activity.icon as any} size={20} color="#fff" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  hero: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroGradient: {
    padding: 25,
  },
  heroContent: {
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
    textAlign: 'center',
    marginBottom: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  streakIcon: {
    marginRight: 8,
  },
  streakText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
  },
  statCardInner: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 16,
    minHeight: 100,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statChange: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  bottomSpacing: {
    height: 120,
  },
});