import { Button } from '@/components/Button';
import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import { quizQuestions as fallbackQuestions, practiceTests } from '@/constants/mockData';
import { getRandomQuestions, Section as SatSection } from '@/utils/openSat';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { usePracticeData } from '../context/PracticeDataContext';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addTestQuestionResult } = usePracticeData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [questions, setQuestions] = useState<any[]>([]);
  
  // Find the test details
  const test = practiceTests.find(t => t.id === id);
  
  // Load questions once on mount based on id param
  useEffect(() => {
    if (!id) {
      setQuestions(fallbackQuestions);
      return;
    }

    // Expecting id like "opensat-math" or fallback to mock
    if (typeof id === 'string' && id.startsWith('opensat-')) {
      const tokens = (id as string).split('-');
      const section = tokens[1] as SatSection;
      const domain = tokens.slice(2).join('-');
      const fetched = getRandomQuestions(section, domain ? 3 : 10, domain || undefined);
      if (fetched.length) {
        // convert to generic format with options array and correctAnswer index
        const mapped = fetched.map(q => {
          const optionKeys = Object.keys(q.question.choices);
          const options = optionKeys.map(k => q.question.choices[k]);
          const correctIndex = optionKeys.indexOf(q.question.correct_answer);
          return {
            id: q.id,
            question: q.question.question,
            options,
            correctAnswer: correctIndex,
            explanation: q.question.explanation,
            difficulty: q.difficulty,
          };
        });
        setQuestions(mapped);
        return;
      }
    }
    // default
    setQuestions(fallbackQuestions);
  }, [id]);
  
  // Calculate progress percentage
  const progress = questions.length ? Math.round(((currentQuestion + 1) / questions.length) * 100) : 0;
  
  // Option selection stores letter index or string index
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index.toString());
  };
  
  // Handle next question
  const handleNextQuestion = async () => {
    // Save the current question result if an option was selected
    if (selectedOption !== null) {
      const question = questions[currentQuestion];
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const isCorrect = selectedOption === question.correctAnswer.toString();
      const selectedOptionLetter = String.fromCharCode(65 + parseInt(selectedOption)); // Convert 0,1,2,3 to A,B,C,D
      const correctOptionLetter = String.fromCharCode(65 + question.correctAnswer);
      
      console.log('Saving question result:', {
        testId: id as string,
        questionId: question.id,
        questionText: question.question,
        isCorrect,
        selectedOption: selectedOptionLetter,
        correctOption: correctOptionLetter,
        timeSpent,
        section: test?.title || 'Practice Test',
        difficulty: test?.difficulty || 'Medium'
      });
      
      try {
        await addTestQuestionResult({
          testId: id as string,
          questionId: question.id,
          questionText: question.question,
          isCorrect,
          selectedOption: selectedOptionLetter,
          correctOption: correctOptionLetter,
          timeSpent,
          section: test?.title || 'Practice Test',
          difficulty: test?.difficulty || 'Medium'
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
  
  // Mock timer effect (non-functional, just for UI)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion]);
  
  // Reset question start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!questions.length) {
    return (<SafeAreaView><Text>Loading questions...</Text></SafeAreaView>);
  }
  
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
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index.toString() && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedOption === index.toString() }}
                accessibilityLabel={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <View style={[
                  styles.optionLabelContainer,
                  selectedOption === index.toString() && styles.selectedOptionLabel
                ]}>
                  <Text style={[
                    styles.optionLabel,
                    selectedOption === index.toString() && styles.selectedOptionLabelText
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selectedOption === index.toString() && styles.selectedOptionText
                ]}>
                  {option}
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
      </SafeAreaView>
    </>
  );
}

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  progressInfo: ViewStyle;
  questionCounter: TextStyle;
  progressBarContainer: ViewStyle;
  progressBar: ViewStyle;
  timerContainer: ViewStyle;
  timerText: TextStyle;
  scrollContainer: ViewStyle;
  scrollContent: ViewStyle;
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
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.smallRadius,
    ...SHADOWS.small,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
    ...(Platform.OS === 'android' && {
      gap: 0,
      marginBottom: 10,
    })
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === 'android' && {
      marginBottom: 12,
    })
  },
  selectedOption: {
    backgroundColor: 'rgba(46, 91, 255, 0.08)',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
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
    color: COLORS.primary,
  },
  selectedOptionLabelText: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
}); 