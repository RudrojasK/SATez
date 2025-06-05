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
              <View style={styles.scoreHeader}>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>SAT</Text>
                </View>
                <Text style={styles.scoreTotal}>{userData.totalScore}</Text>
                <Text style={styles.scoreLabel}>Total Score</Text>
              </View>
            </LinearGradient>
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
        <View style={styles.section}>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  headerGradient: {
    padding: 20,
    borderRadius: 10,
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
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
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
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  goalCard: {
    padding: 0,
    overflow: 'hidden',
  },
  goalGradient: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  goalHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  goalPercentage: {
    fontSize: 12,
    color: '#333',
  },
  scoreCard: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreGradient: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBadge: {
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  scoreTotal: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreSection: {
    alignItems: 'center',
  },
  scoreSectionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  scoreSectionLabel: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '32%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  statGradient: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressCard: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: '#667eea',
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  chartScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartMin: {
    fontSize: 12,
    color: '#666',
  },
  chartMax: {
    fontSize: 12,
    color: '#666',
  },
  tipCard: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tipGradient: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthCard: {
    width: '48%',
    padding: 0,
    overflow: 'hidden',
  },
  swGradient: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  cardContent: {
    padding: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  weaknessCard: {
    width: '48%',
    padding: 0,
    overflow: 'hidden',
  },
}); 