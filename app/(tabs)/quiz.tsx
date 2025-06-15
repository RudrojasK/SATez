import { Button } from '@/components/Button';
import Questions from '@/data/sat_questions_parsed.json';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../../constants/Colors';
import { usePracticeData } from '../context/PracticeDataContext';

interface SATQuestion {
  questionId: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  questionDescription?: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  rationale?: string;
  difficulty?: string;
}

interface PracticeTest {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: number;
}

const practiceTests: PracticeTest[] = [
  {
    id: 'opensat-math-algebra',
    title: 'Algebra Practice',
    description: 'Practice your algebra skills',
    questions: 3,
    timeLimit: 60
  },
  {
    id: 'opensat-math-geometry',
    title: 'Geometry Practice',
    description: 'Practice your geometry skills',
    questions: 3,
    timeLimit: 60
  }
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addTestQuestionResult } = usePracticeData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SATQuestion[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add this to calculate progress
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  
  // Add this to handle option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  useEffect(() => {
    if (typeof id === 'string' && id.startsWith('opensat-math-')) {
      const topic = id.replace('opensat-math-', '').toLowerCase();
      // Cast the questions to SATQuestion[] and ensure all required fields are present
      const allMathQuestions = (Questions.questions as SATQuestion[]).filter(q =>
        q.test.toLowerCase().includes('math')
      );
      const topicQuestions = allMathQuestions.filter(q =>
        q.domain && q.domain.toLowerCase().includes(topic)
      );
      const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 3));
      setIsLoading(false);
    } else {
      const shuffled = [...(Questions.questions as SATQuestion[])].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 3));
      setIsLoading(false);
    }
  }, [id]);
  
  // Find the test details
  const test = practiceTests.find(t => t.id === id);
  
  // Timer effect
  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion, isLoading]);
  
  // Reset question start time when question changes
  useEffect(() => {
    if (!isLoading) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, isLoading]);
  
  // Handle next question
  const handleNextQuestion = async () => {
    // Save the current question result if an option was selected
    if (selectedOption && questions.length > 0 && questions[currentQuestion]) {
      const question = questions[currentQuestion];
      const isCorrect = selectedOption === question.correctAnswer;
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      
      console.log('Saving question result:', {
        testId: id as string,
        questionId: question.questionId,
        questionText: question.question,
        isCorrect,
        selectedOption,
        correctOption: question.correctAnswer,
        timeSpent,
        section: test?.title || 'Practice Test',
        difficulty: question.difficulty || 'Medium'
      });
      
      try {
        await addTestQuestionResult({
          testId: id as string,
          questionId: question.questionId,
          questionText: question.question,
          isCorrect,
          selectedOption,
          correctOption: question.correctAnswer,
          timeSpent,
          section: test?.title || 'Practice Test',
          difficulty: question.difficulty || 'Medium'
        });
        console.log('✅ Question result saved successfully');
      } catch (error) {
        console.error('❌ Failed to save question result:', error);
      }
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now()); // Reset start time for next question
      // Reset timer for next question
      setTimeLeft(60);
    } else {
      // Quiz completed
      Alert.alert(
        "Quiz Completed",
        "You've completed the quiz! Check your profile to see your results.",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    }
  };
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const question = questions[currentQuestion];
  
  return (
    <>
      <Stack.Screen
        options={{
          title: test ? test.title : 'Quiz',
          headerBackTitle: 'Exit',
        }}
      />
      <SafeAreaView style={styles.container}>
        {isLoading || !question ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <View style={styles.progressInfo}>
                <Text style={styles.questionCounter}>
                  Question {currentQuestion + 1} of {questions.length}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
              </View>
              <View style={styles.timerContainer}>
                <Ionicons name="time-outline" size={20} color={timeLeft < 10 ? COLORS.error : COLORS.textLight} />
                <Text style={[
                  styles.timerText, 
                  timeLeft < 10 && {color: COLORS.error}
                ]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
            </View>
            
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {question.questionDescription && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{question.questionDescription}</Text>
                </View>
              )}
              
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                {Object.entries(question.options).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.optionButton,
                      selectedOption === key && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect(key)}
                    activeOpacity={0.7}
                    accessibilityRole="radio"
                  >
                    <View style={[
                      styles.optionLabelContainer,
                      selectedOption === key && styles.selectedOptionLabel
                    ]}>
                      <Text style={[
                        styles.optionLabel,
                        selectedOption === key && styles.selectedOptionLabelText
                      ]}>
                        {key}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedOption === key && styles.selectedOptionText
                    ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.footer}>
              <Button
                title={currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                onPress={handleNextQuestion}
                disabled={selectedOption === null}
                fullWidth
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

type Styles = {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  header: ViewStyle;
  progressInfo: ViewStyle;
  questionCounter: TextStyle;
  progressBarContainer: ViewStyle;
  progressBar: ViewStyle;
  timerContainer: ViewStyle;
  timerText: TextStyle;
  scrollContainer: ViewStyle;
  scrollContent: ViewStyle;
  descriptionContainer: ViewStyle;
  descriptionText: TextStyle;
  questionContainer: ViewStyle;
  questionText: TextStyle;
  optionsContainer: ViewStyle;
  optionButton: ViewStyle;
  selectedOption: ViewStyle;
  optionLabelContainer: ViewStyle;
  selectedOptionLabel: ViewStyle;
  optionLabel: TextStyle;
  selectedOptionLabelText: TextStyle;
  optionText: TextStyle;
  selectedOptionText: TextStyle;
  footer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
    marginRight: 16,
  },
  questionCounter: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  descriptionContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  questionContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(46, 91, 255, 0.08)',
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedOptionLabel: {
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedOptionLabelText: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  selectedOptionText: {
    color: COLORS.primary,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
}); 