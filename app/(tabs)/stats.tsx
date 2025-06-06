import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StatsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Enhanced user data - keeping it simple
  const userData = {
    totalScore: 1240,
    readingScore: 620,
    mathScore: 620,
    practiceTests: 8,
    hoursStudied: 32.5,
    daysStreak: 9,
    weeklyGoal: 15, // hours  
    currentWeekHours: 11.5,
    strengths: ['Algebra', 'Vocabulary', 'Reading Comprehension'],
    weaknesses: ['Geometry', 'Data Analysis', 'Grammar'],
    recentScores: [
      { date: '10/2', score: 1180 },
      { date: '10/9', score: 1210 },
      { date: '10/16', score: 1240 },
      { date: '10/23', score: 1260 },
    ],
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRefresh = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Enhanced Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>My Analytics</Text>
              <Text style={styles.headerSubtitle}>Track your SAT progress</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.currentScore}>{userData.totalScore}</Text>
              <Text style={styles.scoreLabel}>Current Score</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Weekly Goal Section - NEW */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Weekly Study Goal</Text>
          <View style={styles.goalCard}>
            <LinearGradient
              colors={['#ff6b6b', '#ee5a52']}
              style={styles.goalGradient}
            >
              <View style={styles.goalContent}>
                <View style={styles.goalHeader}>
                  <Ionicons name="calendar" size={20} color="#fff" />
                  <Text style={styles.goalTitle}>This Week</Text>
                  <TouchableOpacity onPress={handleRefresh}>
                    <Ionicons name="refresh" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.goalProgress}>
                  {userData.currentWeekHours}h / {userData.weeklyGoal}h
                </Text>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((userData.currentWeekHours / userData.weeklyGoal) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.goalPercentage}>
                  {Math.round((userData.currentWeekHours / userData.weeklyGoal) * 100)}% Complete
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Enhanced Score Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Scores</Text>
          <View style={styles.scoreCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.scoreGradient}
            >
              <View style={styles.scoreContent}>
                <View style={styles.scoreHeader}>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>SAT</Text>
                  </View>
                  <View style={styles.scoreDisplay}>
                    <Text style={styles.scoreTotal}>{userData.totalScore}</Text>
                    <Text style={styles.scoreLabel}>Total Score</Text>
                  </View>
                </View>
                <View style={styles.scoreBreakdown}>
                  <View style={styles.scoreSection}>
                    <Text style={styles.scoreSectionValue}>{userData.readingScore}</Text>
                    <Text style={styles.scoreSectionLabel}>Reading & Writing</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.scoreSection}>
                    <Text style={styles.scoreSectionValue}>{userData.mathScore}</Text>
                    <Text style={styles.scoreSectionLabel}>Math</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.statGradient}
              >
                <Ionicons name="document-text" size={24} color="#fff" />
                <Text style={styles.statValue}>{userData.practiceTests}</Text>
                <Text style={styles.statLabel}>Practice Tests</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.statGradient}
              >
                <Ionicons name="time" size={24} color="#fff" />
                <Text style={styles.statValue}>{userData.hoursStudied}h</Text>
                <Text style={styles.statLabel}>Hours Studied</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#ff9a9e', '#fecfef']}
                style={styles.statGradient}
              >
                <Ionicons name="flame" size={24} color="#fff" />
                <Text style={styles.statValue}>{userData.daysStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Improved Progress Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Recent Test Scores</Text>
            <View style={styles.chart}>
              {userData.recentScores.map((score, index) => (
                <View key={index} style={styles.chartItem}>
                  <Animated.View
                    style={[
                      styles.chartBar,
                      {
                        height: `${((score.score - 800) / 800) * 100}%`,
                        backgroundColor: index === userData.recentScores.length - 1 ? '#4ecdc4' : '#667eea',
                      },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{score.date}</Text>
                  <Text style={styles.chartScore}>{score.score}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartMin}>800</Text>
              <Text style={styles.chartMax}>1600</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Strengths & Weaknesses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Analysis</Text>
          <View style={styles.twoColumnContainer}>
            <View style={styles.strengthCard}>
              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.swGradient}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name="trophy" size={20} color="#fff" />
                  <Text style={styles.cardHeaderText}>Strengths</Text>
                </View>
                <View style={styles.cardContent}>
                  {userData.strengths.map((strength, index) => (
                    <View key={index} style={styles.listItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.listItemText}>{strength}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>

            <View style={styles.weaknessCard}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a52']}
                style={styles.swGradient}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name="alert-circle" size={20} color="#fff" />
                  <Text style={styles.cardHeaderText}>Focus Areas</Text>
                </View>
                <View style={styles.cardContent}>
                  {userData.weaknesses.map((weakness, index) => (
                    <View key={index} style={styles.listItem}>
                      <Ionicons name="arrow-up" size={16} color="#fff" />
                      <Text style={styles.listItemText}>{weakness}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Simple Tip Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.tipGradient}
            >
              <Ionicons name="bulb" size={24} color="#fff" />
              <Text style={styles.tipTitle}>Study Tip</Text>
              <Text style={styles.tipText}>
                You're {Math.round((userData.currentWeekHours / userData.weeklyGoal) * 100)}% toward your weekly goal! 
                Keep up the momentum and focus on your weak areas.
              </Text>
            </LinearGradient>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerGradient: {
    padding: 20,
    borderRadius: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  currentScore: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  goalCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalGradient: {
    borderRadius: 15,
  },
  goalContent: {
    padding: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  goalProgress: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoreCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreGradient: {
    borderRadius: 15,
  },
  scoreContent: {
    padding: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scoreDisplay: {
    alignItems: 'flex-end',
  },
  scoreTotal: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreSection: {
    alignItems: 'center',
  },
  scoreSectionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  scoreSectionLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  chart: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#667eea',
    borderRadius: 10,
    minHeight: 20,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  chartScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  chartMin: {
    fontSize: 12,
    color: '#666',
  },
  chartMax: {
    fontSize: 12,
    color: '#666',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weaknessCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swGradient: {
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItemText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  tipCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipGradient: {
    padding: 20,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 12,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  lastSection: {
    marginBottom: 20,
  },
}); 