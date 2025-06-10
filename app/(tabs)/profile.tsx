import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  // Mock data based on the screenshot
  const user = {
    name: 'Ethan Carter',
    goal: 'SAT Prep',
    avatar: 'https://i.imgur.com/8a5mJ2s.png', // A URL for the avatar image
  };

  const recentScores = [
    { subject: 'Math', score: 750, icon: 'calculator-outline' },
    { subject: 'Reading', score: 720, icon: 'book-outline' },
  ];

  const upcomingTests = [
    {
      date: 'Saturday, July 20th',
      type: 'Full Practice Test',
      icon: 'calendar-outline',
    },
  ];

  const recommendations = [
    {
      subject: 'Math',
      focus: 'Focus on Algebra',
      icon: 'calculator-outline',
    },
    {
      subject: 'Reading',
      focus: 'Improve Reading Comprehension',
      icon: 'book-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#0d1b2a" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.goal}>{user.goal}</Text>
          </View>
        </View>

        <Section title="Recent Scores">
          {recentScores.map((item, index) => (
            <ScoreCard key={index} {...item} />
          ))}
        </Section>
        
        <Section title="Upcoming Practice Tests">
          {upcomingTests.map((item, index) => (
            <UpcomingTestCard key={index} {...item} />
          ))}
        </Section>

        <Section title="Study Recommendations">
          {recommendations.map((item, index) => (
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fde4cf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  goal: {
    fontSize: 16,
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
});

export default ProfileScreen;
