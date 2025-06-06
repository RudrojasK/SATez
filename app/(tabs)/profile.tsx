import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  
  // New state for edit profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState('Alex Johnson');
  const [userEmail, setUserEmail] = useState('alex.johnson@example.com');
  const [targetScore, setTargetScore] = useState('1500');
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

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
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle avatar animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const userStats = [
    {
      label: 'Tests Completed',
      value: '23',
      target: '30',
      icon: 'checkmark-circle',
      color: '#4CD964',
      gradient: ['#4CD964', '#5AC8FA'] as const,
      progress: 0.77,
    },
    {
      label: 'Current Streak',
      value: '12 days',
      target: '30 days',
      icon: 'flame',
      color: '#FF9500',
      gradient: ['#FF9500', '#FF6B6B'] as const,
      progress: 0.4,
    },
    {
      label: 'Score Improvement',
      value: '+180',
      target: '+300',
      icon: 'trending-up',
      color: '#6C5CE7',
      gradient: ['#6C5CE7', '#A29BFE'] as const,
      progress: 0.6,
    },
    {
      label: 'Study Hours',
      value: '47h',
      target: '100h',
      icon: 'time',
      color: '#00CEC9',
      gradient: ['#00CEC9', '#55EFC4'] as const,
      progress: 0.47,
    },
  ];

  const achievements = [
    {
      title: 'First Test',
      description: 'Completed your first practice test',
      icon: 'trophy',
      color: '#FFD700',
      unlocked: true,
    },
    {
      title: 'Perfect Score',
      description: 'Achieved 100% on a section',
      icon: 'star',
      color: '#FF6B6B',
      unlocked: true,
    },
    {
      title: 'Study Streak',
      description: '7 days in a row',
      icon: 'flame',
      color: '#FF9500',
      unlocked: true,
    },
    {
      title: 'Math Master',
      description: 'Complete 50 math problems',
      icon: 'calculator',
      color: '#6C5CE7',
      unlocked: false,
    },
  ];

  const menuItems = [
    {
      title: 'Study Plan',
      description: 'Customize your learning path',
      icon: 'calendar',
      color: '#6C5CE7',
      hasArrow: true,
    },
    {
      title: 'Performance Analytics',
      description: 'Detailed progress insights',
      icon: 'analytics',
      color: '#00CEC9',
      hasArrow: true,
    },
    {
      title: 'Settings',
      description: 'App preferences and account',
      icon: 'settings',
      color: '#8E8E93',
      hasArrow: true,
    },
    {
      title: 'Help & Support',
      description: 'FAQs and contact support',
      icon: 'help-circle',
      color: '#FF9500',
      hasArrow: true,
    },
  ];

  const StatCard = ({ stat, index }: { stat: typeof userStats[0]; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.statCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient colors={stat.gradient} style={styles.statCardGradient}>
          <View style={styles.statIconContainer}>
            <Ionicons name={stat.icon as any} size={24} color="#FFF" />
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { width: `${stat.progress * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{stat.target}</Text>
          </View>
          
          {/* Decorative elements */}
          <View style={styles.statDecor1} />
          <View style={styles.statDecor2} />
        </LinearGradient>
      </Animated.View>
    );
  };

  const AchievementBadge = ({ achievement, index }: { achievement: typeof achievements[0]; index: number }) => {
    return (
      <View style={[styles.achievementBadge, !achievement.unlocked && styles.achievementLocked]}>
        <View
          style={[
            styles.achievementIcon,
            { backgroundColor: achievement.unlocked ? achievement.color : '#E5E5EA' },
          ]}
        >
          <Ionicons
            name={achievement.icon as any}
            size={20}
            color={achievement.unlocked ? '#FFF' : '#8E8E93'}
          />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementTitle, !achievement.unlocked && styles.achievementTitleLocked]}>
            {achievement.title}
          </Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
        </View>
      </View>
    );
  };

  const MenuItem = ({ item, index }: { item: typeof menuItems[0]; index: number }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePress = () => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    return (
      <Animated.View
        style={[
          styles.menuItemContainer,
          {
            opacity: itemAnim,
            transform: [
              {
                translateX: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={handlePress} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
          </View>
          {item.hasArrow && (
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#6C5CE7', '#A29BFE', '#74B9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHeaderGradient}
          >
            <View style={styles.profileContent}>
              <Animated.View
                style={[
                  styles.avatarContainer,
                  { transform: [{ scale: avatarScale }] },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.avatarGradient}
                >
                  <Ionicons name="person" size={40} color="#FFF" />
                </LinearGradient>
              </Animated.View>
              
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setShowEditModal(true)}
              >
                <Ionicons name="create-outline" size={16} color="#FFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <View style={styles.targetScoreContainer}>
                <Text style={styles.targetScoreLabel}>Target Score</Text>
                <Text style={styles.targetScore}>{targetScore}</Text>
              </View>
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Achievements Section */}
        <Animated.View
          style={[
            styles.achievementsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#6C5CE7" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} achievement={achievement} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Quick Settings Section */}
        <Animated.View
          style={[
            styles.settingsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications" size={20} color="#6C5CE7" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, notifications && styles.toggleActive]}
                onPress={() => setNotifications(!notifications)}
              >
                <View style={[styles.toggleThumb, notifications && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon" size={20} color="#6C5CE7" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, darkMode && styles.toggleActive]}
                onPress={() => setDarkMode(!darkMode)}
              >
                <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="phone-portrait" size={20} color="#6C5CE7" />
                <Text style={styles.settingText}>Haptic Feedback</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, hapticFeedback && styles.toggleActive]}
                onPress={() => setHapticFeedback(!hapticFeedback)}
              >
                <View style={[styles.toggleThumb, hapticFeedback && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View
          style={[
            styles.menuSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} index={index} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowEditModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput 
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="Enter your name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput 
                  style={styles.input}
                  value={userEmail}
                  onChangeText={setUserEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Score</Text>
                <TextInput 
                  style={styles.input}
                  value={targetScore}
                  onChangeText={setTargetScore}
                  placeholder="Enter target score"
                  keyboardType="numeric"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    marginBottom: 24,
  },
  profileHeaderGradient: {
    padding: 24,
    paddingTop: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  profileContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  targetScoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  targetScoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  targetScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  floatingElement1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -40,
    right: -40,
  },
  floatingElement2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
  floatingElement3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 80,
    right: 60,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statCardGradient: {
    padding: 16,
    minHeight: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  statDecor1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -10,
    right: -10,
  },
  statDecor2: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    bottom: 10,
    left: -5,
  },
  achievementsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  achievementsList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#8E8E93',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    // Add any additional styles for the modal content
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#8E8E93',
    borderRadius: 8,
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#6C5CE7',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  toggleThumbActive: {
    backgroundColor: '#FFF',
  },
});
