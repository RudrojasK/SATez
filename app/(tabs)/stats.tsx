import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/Card';

export default function StatsScreen() {
  // Mocked user data
  const userData = {
    totalScore: 1240,
    readingScore: 620,
    mathScore: 620,
    practiceTests: 5,
    hoursStudied: 28,
    daysStreak: 7,
    strengths: ['Algebra', 'Vocabulary', 'Reading Comprehension'],
    weaknesses: ['Geometry', 'Data Analysis', 'Grammar'],
    recentScores: [
      { date: '10/2', score: 1180 },
      { date: '10/9', score: 1210 },
      { date: '10/16', score: 1240 },
    ],
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>My Stats</Text>
        <Text style={styles.subtitle}>
          Track your progress and identify areas to improve
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Scores</Text>
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>SAT</Text>
            </View>
            <Text style={styles.scoreTotal}>{userData.totalScore}</Text>
            <Text style={styles.scoreLabel}>Total Score</Text>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Practice Tests"
            value={userData.practiceTests.toString()}
            icon="document-text"
          />
          <StatCard 
            title="Hours Studied"
            value={userData.hoursStudied.toString()}
            icon="time"
          />
          <StatCard 
            title="Day Streak"
            value={userData.daysStreak.toString()}
            icon="flame"
            accentColor={COLORS.secondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Recent Test Scores</Text>
          <View style={styles.chart}>
            {userData.recentScores.map((score, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={[
                  styles.chartBar, 
                  { height: `${(score.score / 1600) * 100}%` }
                ]} />
                <Text style={styles.chartLabel}>{score.date}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <Text style={styles.chartMin}>800</Text>
            <Text style={styles.chartMax}>1600</Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strengths & Weaknesses</Text>
        <View style={styles.twoColumnContainer}>
          <Card style={{...styles.halfCard, ...styles.strengthCard}}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={20} color={COLORS.primary} />
              <Text style={styles.cardHeaderText}>Strengths</Text>
            </View>
            <View style={styles.cardContent}>
              {userData.strengths.map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.listItemText}>{strength}</Text>
                </View>
              ))}
            </View>
          </Card>
          <Card style={{...styles.halfCard, ...styles.weaknessCard}}>
            <View style={styles.cardHeader}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.cardHeaderText}>Weaknesses</Text>
            </View>
            <View style={styles.cardContent}>
              {userData.weaknesses.map((weakness, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="remove-circle" size={16} color="#FF6B6B" />
                  <Text style={styles.listItemText}>{weakness}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={COLORS.primary} />
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Focus on your weaknesses, but don&apos;t neglect your strengths. 
            Consistent practice in both areas will help you achieve a balanced score.
          </Text>
        </View>
      </View>
    </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  scoreHeader: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    alignItems: 'center',
    position: 'relative',
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.smallRadius,
  },
  scoreBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreTotal: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  scoreSection: {
    flex: 1,
    alignItems: 'center',
  },
  scoreSectionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  scoreSectionLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCard: {
    padding: SIZES.padding,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
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
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartMin: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  chartMax: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
    padding: 0,
    overflow: 'hidden',
  },
  strengthCard: {
    borderTopColor: COLORS.primary,
    borderTopWidth: 3,
  },
  weaknessCard: {
    borderTopColor: '#FF6B6B',
    borderTopWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
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
    color: COLORS.text,
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 