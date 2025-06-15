import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Article, articles } from '../../constants/articles';

const { width } = Dimensions.get('window');

interface Resource {
  title: string;
  type: string;
  icon: string;
  difficulty?: string;
  estimatedTime?: string;
  action: () => void;
  description?: string;
  tags?: string[];
}

interface ResourceCategory {
  title: string;
  description: string;
  icon: string;
  items: Resource[];
  color: string;
}

const externalResources: ResourceCategory[] = [
  {
    title: 'Official College Board Resources',
    description: 'Authoritative materials directly from the SAT creators.',
    icon: 'school-outline',
    color: '#2563eb',
    items: [
      { 
        title: 'Official SAT Study Guide (PDF)', 
        type: 'PDF Guide', 
        icon: 'document-text-outline',
        difficulty: 'All Levels',
        estimatedTime: '2-3 hours',
        description: 'Comprehensive 400+ page guide with test strategies and practice questions',
        tags: ['official', 'comprehensive', 'strategies'],
        action: () => Linking.openURL('https://collegereadiness.collegeboard.org/pdf/sat-study-guide-students.pdf')
      },
      { 
        title: 'Digital SAT Practice Tests', 
        type: 'Interactive', 
        icon: 'laptop-outline',
        difficulty: 'All Levels',
        estimatedTime: '3-4 hours per test',
        description: 'Full-length adaptive practice tests that mirror the actual digital SAT',
        tags: ['practice tests', 'adaptive', 'official'],
        action: () => Linking.openURL('https://satsuite.collegeboard.org/digital/official-digital-sat-prep/full-length-practice')
      },
      { 
        title: 'SAT Question of the Day', 
        type: 'Daily Practice', 
        icon: 'calendar-outline',
        difficulty: 'Varies',
        estimatedTime: '5 minutes daily',
        description: 'Free daily practice questions with detailed explanations',
        tags: ['daily practice', 'free', 'explanations'],
        action: () => Linking.openURL('https://satsuite.collegeboard.org/sat/practice-preparation/daily-practice-app')
      },
      { 
        title: 'Official SAT Math Formulas', 
        type: 'Reference', 
        icon: 'calculator-outline',
        difficulty: 'All Levels',
        estimatedTime: '30 minutes',
        description: 'Complete list of formulas provided during the test',
        tags: ['formulas', 'math', 'reference'],
        action: () => Linking.openURL('https://collegereadiness.collegeboard.org/pdf/sat-math-formula-reference-sheet.pdf')
      },
    ],
  },
  {
    title: 'Video Learning & Tutorials',
    description: 'Visual learning resources from top educational platforms.',
    icon: 'videocam-outline',
    color: '#dc2626',
    items: [
      { 
        title: 'Khan Academy SAT Prep Course', 
        type: 'Video Series', 
        icon: 'logo-youtube',
        difficulty: 'Beginner to Advanced',
        estimatedTime: '40+ hours',
        description: 'Free comprehensive course covering all SAT sections with personalized practice',
        tags: ['free', 'comprehensive', 'personalized'],
        action: () => Linking.openURL('https://www.khanacademy.org/sat')
      },
      { 
        title: 'SAT Math Mastery Playlist', 
        type: 'Video Playlist', 
        icon: 'play-circle-outline',
        difficulty: 'Intermediate',
        estimatedTime: '15+ hours',
        description: '100+ videos covering algebra, geometry, and advanced math concepts',
        tags: ['math', 'detailed', 'concept-focused'],
        action: () => Linking.openURL('https://www.youtube.com/playlist?list=PLSQl_2r4P1_2I7PooM1t40b9mGscvWvFe')
      },
      { 
        title: 'Reading Comprehension Strategies', 
        type: 'Video Tutorial', 
        icon: 'book-outline',
        difficulty: 'All Levels',
        estimatedTime: '2 hours',
        description: 'Step-by-step guide to tackling complex passages and evidence-based questions',
        tags: ['reading', 'strategies', 'passages'],
        action: () => Linking.openURL('https://www.youtube.com/watch?v=kDi071Yv3-I')
      },
      { 
        title: 'SAT Writing & Language Deep Dive', 
        type: 'Video Series', 
        icon: 'create-outline',
        difficulty: 'Intermediate',
        estimatedTime: '8+ hours',
        description: 'Comprehensive grammar rules, style questions, and editing strategies',
        tags: ['writing', 'grammar', 'editing'],
        action: () => Linking.openURL('https://www.youtube.com/playlist?list=PLVyXLKr-rv9c6Lrf5G2V0R7A-6HDXb3Z6')
      },
    ],
  },
  {
    title: 'Interactive Practice Platforms',
    description: 'Adaptive learning platforms with personalized practice.',
    icon: 'game-controller-outline',
    color: '#059669',
    items: [
      { 
        title: 'Khan Academy Personalized Practice', 
        type: 'Adaptive Platform', 
        icon: 'trending-up-outline',
        difficulty: 'All Levels',
        estimatedTime: 'Ongoing',
        description: 'AI-powered practice that adapts to your strengths and weaknesses',
        tags: ['adaptive', 'personalized', 'free'],
        action: () => Linking.openURL('https://www.khanacademy.org/sat')
      },
      { 
        title: 'College Board Practice Portal', 
        type: 'Practice Platform', 
        icon: 'desktop-outline',
        difficulty: 'All Levels',
        estimatedTime: 'Ongoing',
        description: 'Official practice questions and detailed score reports',
        tags: ['official', 'score analysis', 'targeted practice'],
        action: () => Linking.openURL('https://satsuite.collegeboard.org/sat/practice-preparation')
      },
      { 
        title: 'PrepScholar SAT Prep', 
        type: 'Prep Course', 
        icon: 'school-outline',
        difficulty: 'All Levels',
        estimatedTime: '20+ hours',
        description: 'Structured course with diagnostic tests and score improvement guarantee',
        tags: ['structured', 'diagnostic', 'guaranteed improvement'],
        action: () => Linking.openURL('https://www.prepscholar.com/sat/')
      },
    ],
  },
  {
    title: 'Reference Materials & Quick Guides',
    description: 'Essential formulas, rules, and quick reference materials.',
    icon: 'library-outline',
    color: '#7c3aed',
    items: [
      { 
        title: 'Complete SAT Grammar Rules Guide', 
        type: 'Reference Guide', 
        icon: 'list-outline',
        difficulty: 'All Levels',
        estimatedTime: '1 hour',
        description: 'Comprehensive list of all grammar rules tested on the SAT',
        tags: ['grammar', 'comprehensive', 'rules'],
        action: () => Linking.openURL('https://blog.prepscholar.com/the-complete-guide-to-sat-grammar-rules')
      },
      { 
        title: 'SAT Math Formula Cheat Sheet', 
        type: 'Cheat Sheet', 
        icon: 'calculator-outline',
        difficulty: 'All Levels',
        estimatedTime: '30 minutes',
        description: 'All essential formulas organized by topic with examples',
        tags: ['formulas', 'math', 'quick reference'],
        action: () => Linking.openURL('https://blog.prepscholar.com/sat-math-formulas')
      },
      { 
        title: 'High-Frequency SAT Vocabulary', 
        type: 'Word List', 
        icon: 'library-outline',
        difficulty: 'Intermediate',
        estimatedTime: '2 hours',
        description: '500+ words commonly appearing in SAT passages with definitions',
        tags: ['vocabulary', 'high-frequency', 'definitions'],
        action: () => Linking.openURL('https://www.vocabulary.com/lists/194479')
      },
      { 
        title: 'SAT Essay Analysis Templates', 
        type: 'Templates', 
        icon: 'document-outline',
        difficulty: 'Advanced',
        estimatedTime: '1 hour',
        description: 'Proven templates and frameworks for essay analysis',
        tags: ['essay', 'templates', 'analysis'],
        action: () => Linking.openURL('https://blog.prepscholar.com/sat-essay-template')
      },
    ],
  },
  {
    title: 'Test-Taking Strategies',
    description: 'Advanced strategies and psychological techniques for test success.',
    icon: 'bulb-outline',
    color: '#ea580c',
    items: [
      { 
        title: 'Time Management Mastery Guide', 
        type: 'Strategy Guide', 
        icon: 'time-outline',
        difficulty: 'All Levels',
        estimatedTime: '45 minutes',
        description: 'Proven techniques for pacing and time allocation across all sections',
        tags: ['time management', 'pacing', 'strategies'],
        action: () => Alert.alert('Coming Soon', 'This resource will be available in the next update!')
      },
      { 
        title: 'Educated Guessing Strategies', 
        type: 'Strategy Guide', 
        icon: 'help-circle-outline',
        difficulty: 'Intermediate',
        estimatedTime: '30 minutes',
        description: 'How to eliminate wrong answers and make strategic guesses',
        tags: ['guessing', 'elimination', 'strategies'],
        action: () => Linking.openURL('https://blog.prepscholar.com/how-to-guess-on-sat-questions')
      },
      { 
        title: 'Test Anxiety Management', 
        type: 'Wellness Guide', 
        icon: 'heart-outline',
        difficulty: 'All Levels',
        estimatedTime: '20 minutes',
        description: 'Psychological techniques to manage stress and perform under pressure',
        tags: ['anxiety', 'stress management', 'psychology'],
        action: () => Linking.openURL('https://www.collegeboard.org/help/article/test-day-tips')
      },
      { 
        title: 'Last-Minute Review Checklist', 
        type: 'Checklist', 
        icon: 'checkmark-circle-outline',
        difficulty: 'All Levels',
        estimatedTime: '15 minutes',
        description: 'Essential review points for the week before your test',
        tags: ['review', 'checklist', 'last-minute'],
        action: () => Alert.alert('Coming Soon', 'This comprehensive checklist will be available soon!')
      },
    ],
  },
  {
    title: 'Mobile Apps & Tools',
    description: 'Apps and digital tools for on-the-go SAT preparation.',
    icon: 'phone-portrait-outline',
    color: '#0891b2',
    items: [
      { 
        title: 'Official SAT Practice App', 
        type: 'Mobile App', 
        icon: 'phone-portrait-outline',
        difficulty: 'All Levels',
        estimatedTime: 'Daily use',
        description: 'Daily practice questions and progress tracking from College Board',
        tags: ['official', 'mobile', 'daily practice'],
        action: () => Linking.openURL('https://satsuite.collegeboard.org/sat/practice-preparation/daily-practice-app')
      },
      { 
        title: 'SAT Vocabulary Builder', 
        type: 'Mobile App', 
        icon: 'book-outline',
        difficulty: 'All Levels',
        estimatedTime: '15 minutes daily',
        description: 'Spaced repetition flashcards for high-frequency SAT vocabulary',
        tags: ['vocabulary', 'flashcards', 'spaced repetition'],
        action: () => Linking.openURL('https://apps.apple.com/us/app/sat-vocabulary/id1234567890')
      },
      { 
        title: 'Math Formula Calculator', 
        type: 'Calculator Tool', 
        icon: 'calculator-outline',
        difficulty: 'All Levels',
        estimatedTime: 'As needed',
        description: 'Interactive calculator with built-in SAT formulas and examples',
        tags: ['calculator', 'formulas', 'interactive'],
        action: () => Linking.openURL('https://www.desmos.com/calculator')
      },
    ],
  },
  {
    title: 'College Admissions Resources',
    description: 'Understanding how SAT scores fit into college applications.',
    icon: 'school-outline',
    color: '#be185d',
    items: [
      { 
        title: 'SAT Score Requirements by College', 
        type: 'Database', 
        icon: 'search-outline',
        difficulty: 'All Levels',
        estimatedTime: '30 minutes',
        description: 'Search tool for SAT score ranges at top colleges and universities',
        tags: ['college search', 'score ranges', 'requirements'],
        action: () => Linking.openURL('https://www.collegedata.com/cs/search/college/college_search_tmpl.jhtml')
      },
      { 
        title: 'Score Choice and Superscoring Guide', 
        type: 'Information Guide', 
        icon: 'ribbon-outline',
        difficulty: 'All Levels',
        estimatedTime: '20 minutes',
        description: 'Understanding college policies on multiple SAT scores',
        tags: ['score choice', 'superscoring', 'college policies'],
        action: () => Linking.openURL('https://collegereadiness.collegeboard.org/sat/scores/sending-scores/score-choice')
      },
      { 
        title: 'Test-Optional College List', 
        type: 'College List', 
        icon: 'list-outline',
        difficulty: 'All Levels',
        estimatedTime: '45 minutes',
        description: 'Comprehensive list of colleges that don\'t require SAT scores',
        tags: ['test-optional', 'college list', 'admissions'],
        action: () => Linking.openURL('https://www.fairtest.org/university/optional')
      },
    ],
  },
];

const studyPlans = [
  {
    title: '2-Month Intensive Plan',
    duration: '8 weeks',
    commitment: '2-3 hours/day',
    targetImprovement: '200-300 points',
    icon: 'rocket-outline',
    color: '#dc2626',
    description: 'Aggressive improvement plan for motivated students with limited time'
  },
  {
    title: '4-Month Comprehensive Plan',
    duration: '16 weeks',
    commitment: '1-2 hours/day',
    targetImprovement: '250-400 points',
    icon: 'trending-up-outline',
    color: '#059669',
    description: 'Balanced approach allowing deep understanding and skill development'
  },
  {
    title: '6-Month Mastery Plan',
    duration: '24 weeks',
    commitment: '45-90 min/day',
    targetImprovement: '300+ points',
    icon: 'trophy-outline',
    color: '#7c3aed',
    description: 'Thorough preparation with time for advanced strategies and multiple practice tests'
  },
];

export default function ResourcesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', 'Reading', 'Writing', 'Math', 'General', 'Test Strategy', 'Time Management'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleResourceAction = (action: () => void, title: string) => {
    try {
      action();
    } catch (error) {
      Alert.alert('Error', `Could not open ${title}. Please check your internet connection.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Resources</Text>
        <Text style={styles.headerSubtitle}>Comprehensive SAT preparation materials</Text>
      </View>

      <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources, topics, or strategies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category === 'all' ? 'All Topics' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterChip,
                  selectedDifficulty === difficulty && styles.filterChipActive
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedDifficulty === difficulty && styles.filterChipTextActive
                ]}>
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Study Plans Section */}
        <View style={styles.studyPlansSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
            <Text style={styles.sectionTitle}>Recommended Study Plans</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {studyPlans.map((plan, index) => (
              <TouchableOpacity key={index} style={[styles.studyPlanCard, { borderLeftColor: plan.color }]}>
                <View style={styles.studyPlanHeader}>
                  <Ionicons name={plan.icon as any} size={24} color={plan.color} />
                  <Text style={styles.studyPlanTitle}>{plan.title}</Text>
                </View>
                <Text style={styles.studyPlanDescription}>{plan.description}</Text>
                <View style={styles.studyPlanStats}>
                  <View style={styles.studyPlanStat}>
                    <Text style={styles.studyPlanStatLabel}>Duration</Text>
                    <Text style={styles.studyPlanStatValue}>{plan.duration}</Text>
                  </View>
                  <View style={styles.studyPlanStat}>
                    <Text style={styles.studyPlanStatLabel}>Daily Time</Text>
                    <Text style={styles.studyPlanStatValue}>{plan.commitment}</Text>
                  </View>
                  <View style={styles.studyPlanStat}>
                    <Text style={styles.studyPlanStatLabel}>Target Gain</Text>
                    <Text style={styles.studyPlanStatValue}>{plan.targetImprovement}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resourceListContainer}>
          {/* In-App Articles */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="document-text-outline" size={26} color="#333" />
              <View style={styles.categoryHeaderText}>
                <Text style={styles.categoryTitle}>Expert Tutorials & Guides</Text>
                <Text style={styles.categoryDescription}>
                  {filteredArticles.length} in-depth articles and study guides written by our SAT experts
                </Text>
              </View>
            </View>
            
            {filteredArticles.length > 0 ? (
              <View style={styles.resourceItemsWrapper}>
                {filteredArticles.map((article: Article) => (
                  <TouchableOpacity 
                    key={article.id} 
                    style={styles.resourceItem} 
                    onPress={() => router.push(`/resource-detail?id=${article.id}`)}
                  >
                    <View style={styles.resourceIconContainer}>
                      <Ionicons name="newspaper-outline" size={22} color="#4a90e2" style={styles.resourceIcon} />
                    </View>
                    <View style={styles.resourceTextContainer}>
                      <Text style={styles.resourceTitle}>{article.title}</Text>
                      <Text style={styles.resourceMeta}>
                        {article.category} • {article.readingTime} min read • {article.difficulty}
                      </Text>
                      <Text style={styles.resourceDescription} numberOfLines={2}>
                        {article.summary}
                      </Text>
                      <View style={styles.tagsContainer}>
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={22} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={styles.noResultsText}>No articles found</Text>
                <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
              </View>
            )}
          </View>
          
          {/* External Resources */}
          {externalResources.map((category, index) => (
            <View key={index} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name={category.icon as any} size={26} color={category.color} />
                <View style={styles.categoryHeaderText}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>
              <View style={styles.resourceItemsWrapper}>
                {category.items.map((item, itemIndex) => (
                  <TouchableOpacity 
                    key={itemIndex} 
                    style={styles.resourceItem} 
                    onPress={() => handleResourceAction(item.action, item.title)}
                  >
                    <View style={[styles.resourceIconContainer, { backgroundColor: `${category.color}15` }]}>
                      <Ionicons name={item.icon as any} size={22} color={category.color} style={styles.resourceIcon} />
                    </View>
                    <View style={styles.resourceTextContainer}>
                      <Text style={styles.resourceTitle}>{item.title}</Text>
                      <Text style={styles.resourceMeta}>
                        {item.type}
                        {item.difficulty && ` • ${item.difficulty}`}
                        {item.estimatedTime && ` • ${item.estimatedTime}`}
                      </Text>
                      {item.description && (
                        <Text style={styles.resourceDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                      {item.tags && (
                        <View style={styles.tagsContainer}>
                          {item.tags.slice(0, 3).map((tag, tagIndex) => (
                            <View key={tagIndex} style={[styles.tag, { borderColor: category.color }]}>
                              <Text style={[styles.tagText, { color: category.color }]}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    <Ionicons name="open-outline" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Additional Resources Footer */}
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Need More Help?</Text>
            <Text style={styles.footerText}>
              Our resource library is constantly growing. Check back regularly for new materials, 
              practice tests, and study strategies. For personalized help, consider working with a tutor 
              or joining our study groups.
            </Text>
            <TouchableOpacity style={styles.footerButton}>
              <Ionicons name="mail-outline" size={20} color="#fff" />
              <Text style={styles.footerButtonText}>Request Resources</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentScrollView: {
    flex: 1,
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    borderColor: '#4a90e2',
    backgroundColor: '#4a90e2',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  studyPlansSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  studyPlanCard: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  studyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studyPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  studyPlanDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  studyPlanStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studyPlanStat: {
    flex: 1,
    alignItems: 'center',
  },
  studyPlanStatLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  studyPlanStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  resourceListContainer: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resourceItemsWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resourceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceIcon: {
    marginRight: 0,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 22,
  },
  resourceMeta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  tagText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
