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
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PracticeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  }, []);

  const categories = [
    { id: 'all', title: 'All', icon: 'grid', color: '#6C5CE7' },
    { id: 'math', title: 'Math', icon: 'calculator', color: '#00CEC9' },
    { id: 'reading', title: 'Reading', icon: 'book', color: '#FD79A8' },
    { id: 'writing', title: 'Writing', icon: 'create', color: '#E17055' },
  ];

  const practiceTests = [
    {
      id: 1,
      title: 'SAT Practice Test #1',
      description: 'Official College Board practice test',
      duration: '3 hours',
      questions: 154,
      difficulty: 'Medium',
      completed: false,
      progress: 0,
      category: 'all',
      gradient: ['#667eea', '#764ba2'] as const,
    },
    {
      id: 2,
      title: 'Math Section Practice',
      description: 'Focus on algebra and geometry problems',
      duration: '80 minutes',
      questions: 58,
      difficulty: 'Hard',
      completed: false,
      progress: 35,
      category: 'math',
      gradient: ['#f093fb', '#f5576c'] as const,
    },
    {
      id: 3,
      title: 'Reading Comprehension',
      description: 'Improve critical reading skills',
      duration: '65 minutes',
      questions: 52,
      difficulty: 'Medium',
      completed: true,
      progress: 100,
      category: 'reading',
      gradient: ['#4facfe', '#00f2fe'] as const,
    },
    {
      id: 4,
      title: 'Writing & Language',
      description: 'Grammar and style questions',
      duration: '35 minutes',
      questions: 44,
      difficulty: 'Easy',
      completed: false,
      progress: 60,
      category: 'writing',
      gradient: ['#43e97b', '#38f9d7'] as const,
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategory(categoryId);
  };

  const filteredTests = practiceTests.filter(
    test => selectedCategory === 'all' || test.category === selectedCategory
  );

  const CategoryButton = ({ category, index }: { category: typeof categories[0]; index: number }) => {
    const isSelected = selectedCategory === category.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && styles.categoryButtonSelected,
        ]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.8}
      >
        {isSelected ? (
          <LinearGradient
            colors={[category.color, `${category.color}80`]}
            style={styles.categoryButtonGradient}
          >
            <Ionicons name={category.icon as any} size={20} color="#FFF" />
            <Text style={[styles.categoryButtonText, { color: '#FFF' }]}>
              {category.title}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.categoryButtonDefault}>
            <Ionicons name={category.icon as any} size={20} color="#666" />
            <Text style={styles.categoryButtonText}>{category.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const PracticeTestCard = ({ test, index }: { test: typeof practiceTests[0]; index: number }) => {
    const cardScale = useRef(new Animated.Value(1)).current;
    
    const handlePress = () => {
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

    return (
      <Animated.View
        style={[
          styles.testCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: cardScale },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <LinearGradient
            colors={test.gradient}
            style={styles.testCardGradient}
          >
            <View style={styles.testCardHeader}>
              <View style={styles.testCardInfo}>
                <Text style={styles.testCardTitle}>{test.title}</Text>
                <Text style={styles.testCardDescription}>{test.description}</Text>
              </View>
              
              <View style={styles.statusContainer}>
                {test.completed ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                ) : (
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(test.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{test.difficulty}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.testCardBody}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{test.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="help-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{test.questions} questions</Text>
                </View>
              </View>

              {test.progress > 0 && (
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressPercentage}>{test.progress}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground} />
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        { width: `${test.progress}%` }
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.testCardFooter}>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                  {test.completed ? 'Review' : test.progress > 0 ? 'Continue' : 'Start'}
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={16} 
                  color="#FFF" 
                />
              </View>
            </View>

            {/* Decorative elements */}
            <View style={styles.cardDecor1} />
            <View style={styles.cardDecor2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Practice Tests</Text>
            <Text style={styles.headerSubtitle}>Improve your SAT score with targeted practice</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={['#6C5CE7', '#A29BFE']}
              style={styles.profileButtonGradient}
            >
              <Ionicons name="person" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
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
          {categories.map((category, index) => (
            <CategoryButton key={category.id} category={category} index={index} />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Practice Tests */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTests.map((test, index) => (
          <PracticeTestCard key={test.id} test={test} index={index} />
        ))}
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
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileButtonGradient: {
    width: 40,
    height: 40,
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
  categoryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButtonDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    gap: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
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
  testCardGradient: {
    padding: 20,
    position: 'relative',
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  testCardInfo: {
    flex: 1,
    paddingRight: 16,
  },
  testCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  testCardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CD964',
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
  testCardBody: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  progressSection: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  testCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  cardDecor1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -30,
    right: -30,
  },
  cardDecor2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: -20,
  },
});
