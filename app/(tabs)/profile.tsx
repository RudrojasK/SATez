import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatCard } from '../../components/StatCard';
import { COLORS, SHADOWS } from '../../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { usePracticeData } from '../context/PracticeDataContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { stats, statsLoading, fetchUserStats } = usePracticeData();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      const formatted = emailName
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setUserName(formatted);
    }
  }, [user]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };
  
  const refreshAllData = async () => {
    setLoading(true);
    try {
      await fetchUserStats();
      Alert.alert('Success', 'User data has been refreshed.');
    } catch (error) {
      console.error('Error refreshing user data:', error);
      Alert.alert('Error', 'Failed to refresh user data.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userName ? userName.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={styles.name}>{userName || 'User'}</Text>
          <Text style={styles.email}>{user.email || 'user@example.com'}</Text>
          
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={refreshAllData}
            disabled={statsLoading}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.refreshText}>Refresh Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <View style={styles.statsContainer}>
              <StatCard 
                title="Questions Answered" 
                value={stats?.totalQuestions || 0} 
                icon="document-text" 
                accentColor={COLORS.primary}
              />
              <StatCard 
                title="Accuracy Rate" 
                value={`${stats?.accuracyRate || 0}%`} 
                icon="stats-chart" 
                accentColor={COLORS.secondary}
              />
              <StatCard 
                title="Study Hours" 
                value={stats?.totalHours || 0} 
                icon="time" 
                accentColor={COLORS.accent}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressNumber}>{stats?.vocabCount || 0}</Text>
                  <Text style={styles.progressLabel}>Vocabulary Questions</Text>
                </View>
                <View style={styles.progressDivider} />
                <View style={styles.progressItem}>
                  <Text style={styles.progressNumber}>{stats?.readingCount || 0}</Text>
                  <Text style={styles.progressLabel}>Reading Questions</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : stats?.recentSessions && stats.recentSessions.length > 0 ? (
            <View style={styles.activityCard}>
              {stats.recentSessions.slice(0, 3).map((session, index) => (
                <React.Fragment key={index}>
                  <View style={styles.activityItem}>
                    <View style={styles.activityLeft}>
                      <Ionicons 
                        name={session.is_correct ? "checkmark-circle" : "close-circle"} 
                        size={24} 
                        color={session.is_correct ? COLORS.success : COLORS.error} 
                      />
                      <View style={styles.activityTextContainer}>
                        <Text style={styles.activityTitle} numberOfLines={1}>
                          {session.word ? `Vocabulary: ${session.word}` : 
                           session.passage_id ? `Reading: Question ${session.question_id}` : 
                           'Practice Session'}
                        </Text>
                        <Text style={styles.activityTime} numberOfLines={1}>
                          {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.activityScore,
                      session.is_correct ? styles.activityScoreSuccess : styles.activityScoreError
                    ]}>
                      {session.is_correct ? 'Correct' : 'Incorrect'}
                    </Text>
                  </View>
                  
                  {index < stats.recentSessions.length - 1 && <View style={styles.activityDivider} />}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={styles.noActivityContainer}>
              <Text style={styles.noActivityText}>No recent activity found.</Text>
              <Text style={styles.noActivitySubtext}>Complete some practice questions to see your activity here.</Text>
            </View>
          )}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Progress Stats</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.medium,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  refreshText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  progressDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#eee',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
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
    flex: 1,
  },
  activityTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  activityScore: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activityScoreSuccess: {
    color: COLORS.success,
  },
  activityScoreError: {
    color: COLORS.error,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  noActivityContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  noActivityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 16,
  },
});
