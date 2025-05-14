import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/Colors';
import { profileStats } from '@/constants/mockData';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  const handleSettingsPress = () => {
    // This would navigate to the settings page
    console.log('Settings pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('@/assets/images/react-logo.png')} 
                style={styles.avatar}
              />
              <View style={styles.statusIndicator} />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={1}>{profileStats.name}</Text>
              <Text style={styles.email} numberOfLines={1}>alex.johnson@example.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <StatCard 
              title="Quizzes Taken" 
              value={profileStats.quizzesTaken} 
              icon="document-text" 
              accentColor={COLORS.primary}
            />
            <StatCard 
              title="Average Score" 
              value={profileStats.averageScore} 
              icon="stats-chart" 
              accentColor={COLORS.secondary}
            />
            <StatCard 
              title="Study Streak" 
              value={`${profileStats.streak} Days`} 
              icon="flame" 
              accentColor={COLORS.accent}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{profileStats.totalHours}</Text>
                <Text style={styles.progressLabel}>Hours Studied</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{profileStats.completedTests}</Text>
                <Text style={styles.progressLabel}>Tests Completed</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityTitle} numberOfLines={1}>Vocabulary Quiz</Text>
                  <Text style={styles.activityTime} numberOfLines={1}>Yesterday at 3:15 PM</Text>
                </View>
              </View>
              <Text style={styles.activityScore}>85%</Text>
            </View>
            
            <View style={styles.activityDivider} />
            
            <View style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityTitle} numberOfLines={1}>Math Practice Drill</Text>
                  <Text style={styles.activityTime} numberOfLines={1}>2 days ago</Text>
                </View>
              </View>
              <Text style={styles.activityScore}>72%</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Settings"
            onPress={handleSettingsPress}
            variant="outline"
            icon={<Ionicons name="settings-outline" size={20} color={COLORS.primary} />}
          />
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
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.card,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
  },
  progressCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  activityCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  activityScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: 12,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
});
