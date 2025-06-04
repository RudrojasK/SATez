import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
    TouchableOpacity,
    View,
} from 'react-native';
import AdvancedModal from '../../components/AdvancedModal';
import { FormButton, FormInput, ValidationRules } from '../../components/FormComponents';
import SkeletonLoader from '../../components/SkeletonLoader';
import { VocabQuestion } from '../../components/Vocab';
import { practiceTests } from '../../constants/mockData';

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'scale' | 'slide' | 'fade' | 'spring' | 'flip'>('scale');
  const [refreshing, setRefreshing] = useState(false);
  const [testName, setTestName] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [activeTab, setActiveTab] = useState('full');
  
  const router = useRouter();

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

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'all', title: 'All', icon: 'grid', color: '#6C5CE7' },
    { id: 'math', title: 'Math', icon: 'calculator', color: '#00CEC9' },
    { id: 'reading', title: 'Reading', icon: 'book', color: '#FD79A8' },
    { id: 'writing', title: 'Writing', icon: 'create', color: '#E17055' },
  ];

  const handleCategoryPress = (categoryId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategory(categoryId);
  };

  const handleCardPress = (testId: string) => {
    // Navigate to practice test using proper router navigation
    router.push({
      pathname: '/test/[id]',
      params: { id: testId }
    });
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const filteredTests = practiceTests.filter(
    test => selectedCategory === 'all' || test.type === selectedCategory
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRefreshing(false);
    setIsLoading(false);
    
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const openModal = (type: 'scale' | 'slide' | 'fade' | 'spring' | 'flip') => {
    setModalType(type);
    setShowModal(true);
    if (Haptics.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleCreateTest = () => {
    console.log('Creating test:', { testName, testDescription });
    setShowModal(false);
    setTestName('');
    setTestDescription('');
    if (Haptics.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CD964';
      case 'Medium': return '#FF9500'; 
      case 'Hard': return '#FF3B30';
      default: return '#666';
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        
        {/* Header Skeleton */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Practice Tests</Text>
                <Text style={styles.headerSubtitle}>Loading your personalized content...</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Loading Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SkeletonLoader variant="practice-test" count={1} />
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Practice Tests</Text>
              <Text style={styles.headerSubtitle}>Master every section with confidence</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Animated.View style={{ transform: [{ rotate: refreshing ? '360deg' : '0deg' }] }}>
                <Ionicons name="refresh" size={24} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <Animated.View
        style={[
          styles.statsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{filteredTests.length}</Text>
            <Text style={styles.statLabel}>Available Tests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredTests.filter(t => t.progress > 0).length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {filteredTests.filter(t => t.progress === 100).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(filteredTests.reduce((acc, t) => acc + t.progress, 0) / filteredTests.length) || 0}%
            </Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>
      </Animated.View>

      {/* Category Filter */}
      <Animated.View
        style={[
          styles.categorySection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {refreshing ? (
            <SkeletonLoader variant="card" count={4} />
          ) : (
            categories.map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  { transform: [{ scale: new Animated.Value(1) }] }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonSelected
                  ]}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <LinearGradient
                    colors={selectedCategory === category.id 
                      ? ['#FF6B6B', '#FF8E8E'] 
                      : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                    style={styles.categoryGradient}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.id && styles.categoryButtonTextSelected
                    ]}>
                      {category.title}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Practice Tests */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {refreshing ? (
          <SkeletonLoader variant="practice-test" count={3} />
        ) : (
          filteredTests.map((test, index) => (
            <Animated.View
              key={test.id}
              style={[
                styles.testCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.testGradient}
              >
                <View style={styles.testHeader}>
                  <Text style={styles.testTitle}>{test.title}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(test.difficulty) }]}>
                    <Text style={styles.difficultyText}>{test.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.testDescription}>{test.description}</Text>
                
                <View style={styles.testMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metaText}>{test.timeEstimate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="help-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metaText}>{test.type}</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>{test.progress}% Complete</Text>
                    {test.progress > 0 && (
                      <View style={styles.progressBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#4cd964" />
                        <Text style={styles.progressBadgeText}>In Progress</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.progressBar}>
                    <Animated.View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${test.progress}%`,
                          backgroundColor: test.progress === 100 ? '#4cd964' : '#fff'
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.testActions}>
                  <TouchableOpacity 
                    style={[
                      styles.startButton,
                      test.progress === 100 && styles.completedButton
                    ]}
                    onPress={() => handleCardPress(test.id)}
                  >
                    <Text style={[
                      styles.startButtonText,
                      test.progress === 100 && styles.completedButtonText
                    ]}>
                      {test.progress === 100 ? 'Review' : test.progress > 0 ? 'Continue' : 'Start Test'}
                    </Text>
                    <Ionicons 
                      name={test.progress === 100 ? "refresh" : "arrow-forward"} 
                      size={16} 
                      color={test.progress === 100 ? "#4cd964" : "#667eea"} 
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))
        )}
        
        {/* Additional practice components from upstream */}
        {activeTab === 'full' && (
          <VocabQuestion
            title="Full Length Vocabulary Practice Questions"
            description="All words that appear on the SAT"
            image={require('../../assets/images/favicon.png')}
            onPress={() => console.log('Navigate to vocab practice')}
          />
        )}

        {activeTab === 'full' && (
          <VocabQuestion
            title="Full Length Reading Practice Questions"
            description="All Questions that appear on the SAT"
            image={require('../../assets/images/favicon.png')}
            onPress={() => console.log('Navigate to reading practice')}
          />
        )}
      </ScrollView>

      {/* Advanced Modal Examples */}
      <AdvancedModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        animationType={modalType}
        position="center"
        size="medium"
        useBlur={true}
        hasGradient={false}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Custom Test</Text>
          <Text style={styles.modalSubtitle}>Design your own practice session</Text>
          
          <FormInput
            label="Test Name"
            value={testName}
            onChangeText={setTestName}
            placeholder="Enter test name"
            icon="school"
            validationRules={[
              ValidationRules.required(),
              ValidationRules.minLength(3)
            ]}
          />
          
          <FormInput
            label="Description"
            value={testDescription}
            onChangeText={setTestDescription}
            placeholder="Describe your test"
            icon="document-text"
            multiline={true}
            maxLength={200}
            validationRules={[
              ValidationRules.required(),
              ValidationRules.maxLength(200)
            ]}
          />
          
          <View style={styles.modalActions}>
            <FormButton
              title="Cancel"
              onPress={() => setShowModal(false)}
              variant="outline"
              size="medium"
              icon="close"
            />
            <FormButton
              title="Create Test"
              onPress={handleCreateTest}
              variant="gradient"
              size="medium"
              icon="checkmark"
              loading={false}
            />
          </View>
        </View>
      </AdvancedModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    paddingVertical: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  categoryButtonSelected: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextSelected: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  testCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  testGradient: {
    padding: 20,
    position: 'relative',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  testMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  progressBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  testActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  completedButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  completedButtonText: {
    color: '#4cd964',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  statsSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    marginTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
