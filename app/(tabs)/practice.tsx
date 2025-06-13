import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockTests = [
  { id: '1', title: 'Practice Test 1', status: 'Completed' },
  { id: '2', title: 'Practice Test 2', status: 'Completed' },
  { id: '3', title: 'Practice Test 3', status: 'Completed' },
  { id: '4', title: 'Practice Test 4', status: 'Remaining' },
  { id: '5', title: 'Practice Test 5', status: 'Remaining' },
  { id: '6', title: 'Practice Test 6', status: 'Remaining' },
];

const quizCategories = {
  Math: [
    { title: 'Algebra', items: ['Linear Equations', 'Quadratic Equations', 'Systems of Equations'] },
    { title: 'Geometry', items: ['Area and Volume', 'Triangles', 'Circles'] },
    { title: 'Data Analysis', items: ['Statistics', 'Probability', 'Data Interpretation'] },
  ],
  Reading: [
    { title: 'Main Idea', items: ['Finding the Central Idea', 'Summarizing Passages'] },
    { title: 'Evidence-Based Questions', items: ['Citing Textual Evidence', 'Analyzing Arguments'] },
  ],
  Writing: [
    { title: 'Grammar & Punctuation', items: ['Commas & Semicolons', 'Subject-Verb Agreement'] },
    { title: 'Rhetoric', items: ['Analyzing Word Choice', 'Effective Transitions'] },
  ],
};

type ActiveView = 'tests' | 'quizzes';
type QuizTab = 'Math' | 'Reading' | 'Writing';

// Main Component
export default function PracticeScreen() {
  const [activeView, setActiveView] = useState<ActiveView>('quizzes');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeView === 'tests' ? 'Practice Tests' : 'Quizzes'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.viewSwitcher}>
        <TouchableOpacity 
          style={[styles.switchButton, activeView === 'tests' && styles.activeSwitch]} 
          onPress={() => setActiveView('tests')}
        >
          <Text style={[styles.switchButtonText, activeView === 'tests' && styles.activeSwitchText]}>
            Practice Tests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.switchButton, activeView === 'quizzes' && styles.activeSwitch]} 
          onPress={() => setActiveView('quizzes')}
        >
          <Text style={[styles.switchButtonText, activeView === 'quizzes' && styles.activeSwitchText]}>
            Quizzes
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeView === 'tests' ? <PracticeTestsView /> : <QuizzesView />}
    </SafeAreaView>
  );
}

// Quizzes View Component
const QuizzesView = () => {
  const params = useLocalSearchParams();
  const initialTab = typeof params.tab === 'string' && ['Math', 'Reading', 'Writing'].includes(params.tab) 
    ? params.tab as QuizTab 
    : 'Reading';
  
  const [activeQuizTab, setActiveQuizTab] = useState<QuizTab>(initialTab);
  const router = useRouter();
  
  // Effect to handle deep links and tab changes from parameters
  useEffect(() => {
    if (typeof params.tab === 'string' && ['Math', 'Reading', 'Writing'].includes(params.tab)) {
    setActiveQuizTab(params.tab as QuizTab);
    }
  }, [params.tab]);

  return (
    <ScrollView style={styles.contentScrollView}>
      <View style={styles.quizTabs}>
        {(['Math', 'Reading', 'Writing'] as QuizTab[]).map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveQuizTab(tab)}>
            <Text style={[styles.quizTab, activeQuizTab === tab && styles.activeQuizTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quizContent}>
        {quizCategories[activeQuizTab].map(category => (
          <View key={category.title} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.categoryGrid}>
              {category.items.map((item, index) => (
                <TouchableOpacity 
                  key={item} 
                  style={styles.quizItem} 
                  onPress={() => router.push(`/(tabs)/quiz?id=opensat-${activeQuizTab.toLowerCase()}-${category.title.toLowerCase()}`)}
                >
                  <Ionicons name="document-text-outline" size={20} color="#555" style={{marginRight: 8}}/>
                  <Text style={styles.quizItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Practice Tests View Component
const PracticeTestsView = () => {
  const router = useRouter();
  
  return (
    <>
      <ScrollView style={styles.contentScrollView}>
        <View style={styles.testListContainer}>
          <Text style={styles.testListHeader}>Full-Length Tests</Text>
          {mockTests.map(test => (
            <TouchableOpacity key={test.id} style={styles.testItem} onPress={() => router.push(`/(tabs)/quiz?id=test-${test.id}`)}>
              <View style={styles.testItemIcon}>
                <Ionicons
                  name={test.status === 'Completed' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={test.status === 'Completed' ? '#4CAF50' : '#ccc'}
                />
              </View>
              <View>
                <Text style={styles.testItemTitle}>{test.title}</Text>
                <Text style={styles.testItemStatus}>{test.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButtonPrimary}>
          <Text style={styles.footerButtonTextPrimary}>Start New Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButtonSecondary}>
          <Text style={styles.footerButtonTextSecondary}>Review Results</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 12
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e9ecef'
  },
  activeSwitch: {
    backgroundColor: '#007bff'
  },
  switchButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  activeSwitchText: {
    color: '#fff',
  },
  contentScrollView: {
    flex: 1,
  },
  // QuizzesView Styles
  quizTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  quizTab: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500'
  },
  activeQuizTab: {
    color: '#007bff',
    fontWeight: '700',
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
    paddingBottom: 4
  },
  quizContent: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  quizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  quizItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1
  },
  // PracticeTestsView Styles
  testListContainer: {
    padding: 20,
  },
  testListHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  testItemIcon: {
    marginRight: 16,
  },
  testItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  testItemStatus: {
    fontSize: 14,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff'
  },
  footerButtonPrimary: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  footerButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerButtonSecondary: {
    backgroundColor: '#e9ecef',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  footerButtonTextSecondary: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
