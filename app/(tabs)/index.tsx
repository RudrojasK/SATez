import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePracticeData } from '../context/PracticeDataContext';

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, statsLoading, fetchUserStats } = usePracticeData();
  const [dailyQuestion, setDailyQuestion] = useState('');

  useEffect(() => {
    fetchUserStats();
    generateDailyQuestion();
  }, []);

  // Generate a daily question based on date (pseudo-random but consistent for the day)
  const generateDailyQuestion = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    // Array of SAT-style questions
    const questions = [
      "If 3x - y = 12 and x + 2y = 10, what is the value of x?",
      "In a right triangle, if one leg is 6 and the hypotenuse is 10, what is the length of the other leg?",
      "If f(x) = 2x² - 3x + 1, what is f(2)?",
      "If log₃(x) = 4, what is the value of x?",
      "The average of five numbers is 8. If the average of three of these numbers is 5, what is the average of the other two numbers?",
      "A line has a y-intercept of 3 and a slope of 2. What is the x-intercept?",
      "If 2^x = 8, what is the value of x?",
      "In a geometric sequence, if the first term is 4 and the common ratio is 3, what is the fifth term?",
      "If the angles in a triangle have measures in the ratio 3:3:4, what is the measure of the largest angle?",
      "What is the solution to the equation |2x - 5| = 7?"
    ];
    
    // Choose question based on day of year (will be consistent for the same day)
    const questionIndex = dayOfYear % questions.length;
    setDailyQuestion(questions[questionIndex]);
  };

  // Determine the continue learning section based on user activity
  const getContinueLearningSection = () => {
    if (!stats || !stats.recentSessions || stats.recentSessions.length === 0) {
      return { title: "Reading Section", icon: "book-outline" };
    }
    
    // Look at most recent session type
    const lastSession = stats.recentSessions[0];
    
    if (lastSession.type === 'vocab') {
      return { title: "Vocabulary", icon: "text-outline" };
    } else if (lastSession.type === 'reading') {
      return { title: "Reading Section", icon: "book-outline" };
    } else {
      return { title: "Math Section", icon: "calculator-outline" };
    }
  };

  // Get a personalized tip based on user performance
  const getDailyTip = () => {
    if (!stats) {
      return "For reading questions, try to read the questions before reading the passage to know what to look for.";
    }
    
    // If accuracy is low, give a study tip
    if (stats.accuracyRate < 70) {
      return "Try to understand why you got questions wrong. Review your mistakes carefully to learn from them.";
    }
    
    // If user has completed many questions, give a time management tip
    if (stats.totalQuestions > 50) {
      return "Practice with a timer to improve your speed. Time management is crucial for the SAT.";
    }
    
    // If user hasn't practiced much, encourage more practice
    if (stats.totalQuestions < 20) {
      return "Consistency is key. Try to practice a little bit each day rather than cramming.";
    }
    
    // Default tips
    const tips = [
      "For reading questions, try to read the questions before reading the passage to know what to look for.",
      "When answering math questions, eliminate obviously wrong answers first.",
      "Use the process of elimination on difficult questions to improve your chances.",
      "Pay attention to transition words in reading passages - they often signal important information.",
      "Don't spend too much time on any single question. Mark it and come back if needed."
    ];
    
    // Choose a tip based on the day of month
    const day = new Date().getDate();
    return tips[day % tips.length];
  };

  if (statsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  // Get continue learning section
  const continueSection = getContinueLearningSection();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Hello, {user?.name || 'Student'}!</Text>
            <Text style={styles.headerTitle}>Let's ace the SAT</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="notifications-outline" size={24} color="#0d1b2a" />
          </TouchableOpacity>
        </View>

        {/* Daily Question */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyCardHeader}>
            <Ionicons name="star-outline" size={20} color="#fca311" />
            <Text style={styles.dailyCardTitle}>Daily Question</Text>
          </View>
          <Text style={styles.dailyCardQuestion}>
            {dailyQuestion}
          </Text>
          <TouchableOpacity 
            style={styles.dailyCardButton}
            onPress={() => router.push('/(tabs)/practice')}
          >
            <Text style={styles.dailyCardButtonText}>View Answer</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Sections */}
        <View style={styles.mainContent}>
          <FeatureCard
            title="Continue Learning"
            subtitle={continueSection.title}
            icon={continueSection.icon}
            color="#4a90e2"
            onPress={() => router.push('/(tabs)/practice')}
          />
          <FeatureCard
            title="Practice Test"
            subtitle={`Completed: ${stats?.testQuestionCount || 0} questions`}
            icon="document-text-outline"
            color="#50e3c2"
            onPress={() => router.push('/(tabs)/practice')}
          />
        </View>
        
        <Section title="Start Practicing">
          <PracticeCard 
            title="Math"
            icon="calculator-outline"
            onPress={() => router.push('/(tabs)/practice?tab=Math')}
          />
          <PracticeCard 
            title="Reading"
            icon="book-outline"
            onPress={() => router.push('/(tabs)/practice?tab=Reading')}
          />
          <PracticeCard 
            title="Writing"
            icon="pencil-outline"
            onPress={() => router.push('/(tabs)/practice')}
          />
        </Section>
        
        <Section title="Tip of the Day">
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#0d1b2a" style={{marginRight: 10}} />
            <Text style={styles.tipText}>
              {getDailyTip()}
            </Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const FeatureCard = ({ title, subtitle, icon, color, onPress }: { title: string; subtitle: string; icon: any; color: string; onPress: () => void }) => (
  <TouchableOpacity style={[styles.featureCard, { backgroundColor: color }]} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#fff" />
    <Text style={styles.featureCardTitle}>{title}</Text>
    <Text style={styles.featureCardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const PracticeCard = ({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.practiceCard} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#0d1b2a" />
    <Text style={styles.practiceCardTitle}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#6c757d" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerGreeting: {
    fontSize: 16,
    color: '#6c757d',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  dailyCard: {
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  dailyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dailyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fca311',
    marginLeft: 8,
  },
  dailyCardQuestion: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
    marginBottom: 15,
  },
  dailyCardButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dailyCardButtonText: {
    color: '#0d1b2a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    height: 150,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  featureCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 15,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  practiceCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0d1b2a',
    marginLeft: 15,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
});

export default HomeScreen;