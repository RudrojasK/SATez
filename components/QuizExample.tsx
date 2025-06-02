import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuizExampleProps {
  quizData: {
    question: string;
    choices: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export const QuizExample = ({ quizData }: QuizExampleProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Validate quiz data to prevent rendering issues
  if (!quizData || !quizData.question || !Array.isArray(quizData.choices) || !quizData.correctAnswer || !quizData.explanation) {
    console.error('Invalid quiz data:', quizData);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Practice Question</Text>
        <Text style={styles.errorText}>Unable to load quiz example. Please try again.</Text>
      </View>
    );
  }
  
  // Ensure the correct answer is in the choices array
  const choices = [...quizData.choices];
  if (!choices.includes(quizData.correctAnswer)) {
    choices.push(quizData.correctAnswer);
    console.warn('Correct answer was not in choices array, added it automatically');
  }

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Question</Text>
      
      <Text style={styles.question}>{quizData.question}</Text>
      
      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedAnswer === choice && 
                (choice === quizData.correctAnswer ? styles.correctChoice : styles.incorrectChoice)
            ]}
            onPress={() => handleSelectAnswer(choice)}
            disabled={showExplanation}
          >
            <Text 
              style={[
                styles.choiceText,
                selectedAnswer === choice && choice === quizData.correctAnswer && styles.correctChoiceText,
                selectedAnswer === choice && choice !== quizData.correctAnswer && styles.incorrectChoiceText
              ]}
            >
              {choice}
            </Text>
            {selectedAnswer === choice && choice === quizData.correctAnswer && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} style={styles.icon} />
            )}
            {selectedAnswer === choice && choice !== quizData.correctAnswer && (
              <Ionicons name="close-circle" size={20} color={COLORS.error} style={styles.icon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationLabel}>Explanation:</Text>
          <Text style={styles.explanationText}>{quizData.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginBottom: 8,
  },
  choicesContainer: {
    marginBottom: 16,
  },
  choiceButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  correctChoice: {
    backgroundColor: 'rgba(75, 181, 67, 0.1)',
    borderColor: COLORS.success,
  },
  incorrectChoice: {
    backgroundColor: 'rgba(255, 76, 76, 0.1)',
    borderColor: COLORS.error,
  },
  choiceText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  correctChoiceText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  incorrectChoiceText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 8,
  },
  explanationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: SIZES.radius,
    padding: 12,
    marginTop: 8,
  },
  explanationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});
