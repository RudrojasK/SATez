import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import { Message } from '@/utils/groq';
import { FavoriteResponse, FavoriteResponsesStorage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QuizExample } from './QuizExample';

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
}

// Interface for quiz data
interface QuizData {
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
}

export const ChatMessage = ({ message, isLastMessage }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);
  const [showQuizExample, setShowQuizExample] = useState(false);
  
  // Extract quiz example from message content if it exists
  const quizData = useMemo<QuizData | null>(() => {
    try {
      if (isUser) return null;
      
      const match = message.content.match(/<quiz-example>([\s\S]*?)<\/quiz-example>/);
      if (match && match[1]) {
        const quizJson = JSON.parse(match[1].trim());
        return {
          question: quizJson.question,
          choices: quizJson.choices,
          correctAnswer: quizJson.correctAnswer,
          explanation: quizJson.explanation
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to parse quiz data:', error);
      return null;
    }
  }, [message.content, isUser]);

  // Check if this is a math question based on the first line
  const isMathQuestion = useMemo(() => {
    if (isUser) return false;
    const firstLine = message.content.split('\n')[0].trim();
    return firstLine === "Math question";
  }, [message.content, isUser]);

  // Remove the quiz example and categorization line from displayed content
  const displayContent = useMemo(() => {
    if (isUser) return message.content;
    
    let content = message.content;
    
    // Remove the categorization line (first line if it's "Math question" or "Not math")
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine === "Math question" || firstLine === "Not math") {
      content = lines.slice(1).join('\n');
    }
    
    // Remove the quiz example tags
    content = content.replace(/<quiz-example>[\s\S]*?<\/quiz-example>/g, '').trim();
    
    return content;
  }, [message.content, isUser]);
  
  // Don't render system messages
  if (message.role === 'system') {
    return null;
  }
  
  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(message.content);
      Alert.alert('Copied!', 'Message copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message');
      console.error('Failed to copy message:', error);
    }
  };
  
  const handleSaveFavorite = async () => {
    try {
      // Find the user's question that preceded this answer
      const favoriteResponse: FavoriteResponse = {
        id: message.id,
        question: 'User Question', // Ideally, find the related question
        answer: message.content,
        timestamp: message.timestamp
      };
      
      await FavoriteResponsesStorage.saveFavoriteResponse(favoriteResponse);
      Alert.alert('Saved!', 'Response saved to favorites');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to favorites');
      console.error('Failed to save favorite:', error);
    }
  };

  return (
    <View style={[
      styles.messageWrapper,
      isLastMessage && styles.lastMessageWrapper
    ]}>
      <TouchableOpacity 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer
        ]}
        activeOpacity={0.8}
        onLongPress={() => !isUser && setShowActions(true)}
      >
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {displayContent}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          
          {/* Actions for assistant messages only */}
          {!isUser && showActions && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopyText}>
                <Ionicons name="copy-outline" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleSaveFavorite}>
                <Ionicons name="bookmark-outline" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowActions(false)}>
                <Ionicons name="close-outline" size={16} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Show Example button (only for assistant messages with quiz data AND math questions) */}
      {!isUser && quizData && isMathQuestion && (
        <View style={styles.exampleButtonContainer}>
          <TouchableOpacity 
            style={styles.exampleButton}
            onPress={() => setShowQuizExample(!showQuizExample)}
          >
            <Ionicons 
              name={showQuizExample ? "chevron-up-circle" : "chevron-down-circle"} 
              size={20} 
              color={COLORS.primary} 
              style={styles.exampleButtonIcon} 
            />
            <Text style={styles.exampleButtonText}>
              {showQuizExample ? "Hide Example" : "Show Example"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Quiz Example (if available and button is clicked) */}
      {!isUser && quizData && isMathQuestion && showQuizExample && (
        <QuizExample quizData={quizData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: 8,
  },
  lastMessageWrapper: {
    marginBottom: 24,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4, // Smaller radius on the corner next to avatar
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4, // Smaller radius on the corner next to avatar
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  assistantMessageText: {
    color: COLORS.text,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 10,
    opacity: 0.7,
    color: COLORS.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  exampleButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
    marginLeft: 16,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  exampleButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  exampleButtonIcon: {
    marginRight: 4,
  },
});
