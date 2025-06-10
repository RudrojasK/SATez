import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const router = useRouter();
  const userName = 'Ethan'; // Mock user name

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Hello, {userName}!</Text>
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
            If 3x - y = 12, what is the value of 8^x / 2^y?
          </Text>
          <TouchableOpacity style={styles.dailyCardButton}>
            <Text style={styles.dailyCardButtonText}>View Answer</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Sections */}
        <View style={styles.mainContent}>
          <FeatureCard
            title="Continue Learning"
            subtitle="Reading Section"
            icon="play-circle-outline"
            color="#4a90e2"
            onPress={() => router.push('/(tabs)/practice')}
          />
          <FeatureCard
            title="Practice Test"
            subtitle="Full-length exam"
            icon="document-text-outline"
            color="#50e3c2"
            onPress={() => router.push('/(tabs)/practice')}
          />
        </View>
        
        <Section title="Start Practicing">
          <PracticeCard 
            title="Math"
            icon="calculator-outline"
            onPress={() => router.push('/(tabs)/practice')}
          />
          <PracticeCard 
            title="Reading"
            icon="book-outline"
            onPress={() => router.push('/(tabs)/practice')}
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
              For reading questions, try to read the questions before reading the passage to know what to look for.
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