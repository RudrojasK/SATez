import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePracticeData } from '../context/PracticeDataContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, statsLoading, fetchUserStats } = usePracticeData();

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Default avatar if user doesn't have one
  const avatarUrl = user?.avatar || 'https://i.imgur.com/8a5mJ2s.png';

  // Calculate math and reading scores based on performance
  const getMathScore = () => {
    if (!stats) return 750; // Default score if no stats
    const mathCorrectRate = stats.testQuestionCount > 0 
      ? Math.round((stats.correctAnswers / stats.testQuestionCount) * 100) 
      : 75;
    return Math.min(800, 600 + mathCorrectRate * 2); // Score between 600-800 based on performance
  };

  const getReadingScore = () => {
    if (!stats) return 720; // Default score if no stats
    const readingCorrectRate = stats.readingCount > 0 
      ? Math.round((stats.correctAnswers / stats.readingCount) * 100)
      : 72;
    return Math.min(800, 600 + readingCorrectRate * 2); // Score between 600-800 based on performance
  };

  // Determine study recommendations based on performance
  const getRecommendations = () => {
    if (!stats) return [
      { subject: 'Math', focus: 'Focus on Algebra', icon: 'calculator-outline' },
      { subject: 'Reading', focus: 'Improve Reading Comprehension', icon: 'book-outline' },
    ];

    const recommendations = [];
    
    // Math recommendation
    const mathScore = getMathScore();
    if (mathScore < 700) {
      recommendations.push({ 
        subject: 'Math', 
        focus: 'Focus on Algebra Fundamentals', 
        icon: 'calculator-outline' 
      });
    } else if (mathScore < 750) {
      recommendations.push({ 
        subject: 'Math', 
        focus: 'Practice Advanced Problems', 
        icon: 'calculator-outline' 
      });
    } else {
      recommendations.push({ 
        subject: 'Math', 
        focus: 'Maintain Your Math Skills', 
        icon: 'calculator-outline' 
      });
    }
    
    // Reading recommendation
    const readingScore = getReadingScore();
    if (readingScore < 700) {
      recommendations.push({ 
        subject: 'Reading', 
        focus: 'Improve Reading Comprehension', 
        icon: 'book-outline' 
      });
    } else if (readingScore < 750) {
      recommendations.push({ 
        subject: 'Reading', 
        focus: 'Practice Analytical Reading', 
        icon: 'book-outline' 
      });
    } else {
      recommendations.push({ 
        subject: 'Reading', 
        focus: 'Maintain Your Reading Skills', 
        icon: 'book-outline' 
      });
    }
    
    return recommendations;
  };

  // Calculate upcoming test date (example: next Saturday)
  const getUpcomingTestDate = () => {
    const today = new Date();
    const nextSaturday = new Date();
    nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return nextSaturday.toLocaleDateString('en-US', options);
  };

  if (statsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/settings")}>
            <Ionicons name="settings-outline" size={24} color="#0d1b2a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => router.push("/(app)/profile-information")}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.goal}>SAT Prep</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6c757d" />
        </TouchableOpacity>

        <Section title="Recent Scores">
          <ScoreCard
            subject="Math"
            score={getMathScore()}
            icon="calculator-outline"
          />
          <ScoreCard
            subject="Reading"
            score={getReadingScore()}
            icon="book-outline"
          />
        </Section>
        
        <Section title="Recent Quizzes">
          {stats && stats.recentTestQuestions && stats.recentTestQuestions.length > 0 ? (
            stats.recentTestQuestions.map((quiz, index) => (
              <RecentQuizCard 
                key={index}
                icon={quiz.section?.toLowerCase().includes('math') ? 'calculator-outline' : 'book-outline'}
                title={quiz.section || 'Practice Quiz'}
                date={new Date(quiz.created_at).toLocaleDateString()}
                isCorrect={quiz.isCorrect}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No recent quizzes completed.</Text>
          )}
        </Section>
        
        <Section title="Upcoming Practice Tests">
          <UpcomingTestCard
            date={getUpcomingTestDate()}
            type="Full Practice Test"
            icon="calendar-outline"
          />
        </Section>

        <Section title="Study Recommendations">
          {getRecommendations().map((item, index) => (
            <RecommendationCard key={index} {...item} />
          ))}
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

const ScoreCard = ({ icon, score, subject }: { icon: any; score: number; subject: string }) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Ionicons name={icon} size={24} color="#4a4a4a" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.subject}>{subject}</Text>
    </View>
  </View>
);

const UpcomingTestCard = ({ icon, date, type }: { icon: any; date: string; type: string }) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Ionicons name={icon} size={24} color="#4a4a4a" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.subject}>{type}</Text>
    </View>
  </View>
);

const RecommendationCard = ({ icon, subject, focus }: { icon: any; subject: string; focus: string }) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Ionicons name={icon} size={24} color="#4a4a4a" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.recommendationSubject}>{subject}</Text>
      <Text style={styles.subject}>{focus}</Text>
    </View>
  </View>
);

const RecentQuizCard = ({ icon, title, date, isCorrect }: { icon: any; title: string; date: string; isCorrect: boolean }) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Ionicons name={icon} size={24} color="#4a4a4a" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.recommendationSubject}>{title}</Text>
      <Text style={styles.subject}>Completed on: {date}</Text>
    </View>
    <View style={[styles.statusIndicator, { backgroundColor: isCorrect ? '#4CAF50' : '#F44336' }]} />
  </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fde4cf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  goal: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 15,
  },
  card: {
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
  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  subject: {
    fontSize: 14,
    color: '#6c757d',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d1b2a',
  },
  recommendationSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d1b2a',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6c757d',
    padding: 20,
    fontStyle: 'italic',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 'auto',
    alignSelf: 'center',
  },
});

export default ProfileScreen;
