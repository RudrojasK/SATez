import { ChatMessage } from '@/components/ChatMessage';
import { FavoriteResponsesModal } from '@/components/FavoriteResponsesModal';
import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import {
    createInitialMessages,
    fetchGroqCompletion,
    Message
} from '@/utils/groq';
import { lightHapticFeedback, mediumHapticFeedback } from '@/utils/haptics';
import { ChatHistoryStorage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function TutorScreen() {
  const [messages, setMessages] = useState<Message[]>(createInitialMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  // Quick action suggestions
  const quickActions = [
    { id: 1, text: "Help with math problem", icon: "calculator" },
    { id: 2, text: "Reading comprehension tips", icon: "book" },
    { id: 3, text: "Essay writing advice", icon: "create" },
    { id: 4, text: "Test-taking strategies", icon: "timer" },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save empty chats
      const saveCurrentChat = async () => {
        try {
          const chatId = 'current-chat';
          const userMessages = messages.filter(m => m.role === 'user');
          const title = userMessages.length > 0 
            ? userMessages[0].content.substring(0, 30) + (userMessages[0].content.length > 30 ? '...' : '')
            : 'New Chat';
            
          await ChatHistoryStorage.saveSession({
            id: chatId,
            title,
            messages,
            createdAt: messages[0].timestamp,
            updatedAt: Date.now()
          });
        } catch (error) {
          console.error('Failed to save chat history:', error);
        }
      };
      
      saveCurrentChat();
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Hide quick actions after first message
    setShowQuickActions(false);
    
    // Send button animation
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Trigger light haptic feedback when sending a message
    lightHapticFeedback();
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: Date.now()
    };
    
    // Add a reinforcement message to ensure quiz examples
    const quizReminderMessage: Message = {
      id: 'quiz-reminder-' + Date.now().toString(),
      role: 'system',
      content: 'Remember to include a quiz example in your response using the <quiz-example> JSON format. The quiz should relate to the student\'s question and help them practice similar concepts.',
      timestamp: Date.now()
    };
    
    // Update state with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    
    // Start loading and typing states
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Call GROQ API with the reminder message
      const response = await fetchGroqCompletion({
        messages: [...messages, quizReminderMessage, userMessage],
      });
      
      // Stop typing before adding response
      setIsTyping(false);
      
      // Add assistant response to messages
      setMessages(prevMessages => [...prevMessages, response]);
    } catch (error) {
      console.error("Error fetching response from GROQ:", error);
      
      setIsTyping(false);
      
      // Show error message
      Alert.alert(
        "Error",
        "Failed to get a response from the tutor. Please check your network connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputText(action.text);
    setShowQuickActions(false);
    lightHapticFeedback();
  };
  
  const handleStartNewConversation = () => {
    Alert.alert(
      "New Conversation",
      "Are you sure you want to start a new conversation? This will clear all current messages.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            // Trigger medium haptic feedback when starting a new conversation
            mediumHapticFeedback();
            setMessages(createInitialMessages());
            setShowQuickActions(true);
          }
        }
      ]
    );
  };
  
  const handleShowFavorites = () => {
    setShowFavorites(true);
  };
  
  // Get visible messages (exclude system messages)
  const visibleMessages = messages.filter(m => m.role !== 'system');
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>AI Tutor</Text>
              <Text style={styles.subtitle}>Your personal SAT coach</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleShowFavorites}
              >
                <Ionicons name="bookmark" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleStartNewConversation}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Favorites Modal */}
      <FavoriteResponsesModal
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome header */}
          {visibleMessages.length <= 1 && (
            <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
              <LinearGradient
                colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
                style={styles.welcomeGradient}
              >
                <View style={styles.welcomeIconContainer}>
                  <Ionicons name="school" size={32} color="#667eea" />
                </View>
                <Text style={styles.welcomeTitle}>SAT AI Tutor</Text>
                <Text style={styles.welcomeText}>
                  Get instant help with SAT problems, study strategies, and practice questions. Ask me anything!
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Quick Actions */}
          {showQuickActions && visibleMessages.length <= 1 && (
            <Animated.View style={[styles.quickActionsContainer, { opacity: fadeAnim }]}>
              <Text style={styles.quickActionsTitle}>Quick Help</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction(action)}
                  >
                    <LinearGradient
                      colors={['#f8f9fa', '#e9ecef']}
                      style={styles.quickActionGradient}
                    >
                      <Ionicons name={action.icon as any} size={20} color="#667eea" />
                      <Text style={styles.quickActionText}>{action.text}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
          
          {/* Chat messages */}
          {visibleMessages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLastMessage={index === visibleMessages.length - 1}
            />
          ))}
          
          {/* Enhanced typing indicator */}
          {isTyping && (
            <Animated.View 
              style={[
                styles.typingContainer,
                {
                  opacity: typingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#f8f9fa', '#e9ecef']}
                style={styles.typingGradient}
              >
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
                </View>
                <Text style={styles.typingText}>AI Tutor is thinking...</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>
        
        {/* Enhanced Input area */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.inputGradient}
          >
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your tutor anything..."
                placeholderTextColor={COLORS.textLight}
                multiline
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={Keyboard.dismiss}
              />
              <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                >
                  <LinearGradient
                    colors={!inputText.trim() || isLoading 
                      ? ['#e9ecef', '#dee2e6'] 
                      : ['#667eea', '#764ba2']
                    }
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={!inputText.trim() || isLoading ? COLORS.textLight : "#fff"}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    padding: SIZES.padding,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SIZES.padding,
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 16,
  },
  quickActionsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
  },
  quickActionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  typingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginHorizontal: 2,
  },
  typingText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputGradient: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
    ...SHADOWS.small,
  },
  sendButton: {
    borderRadius: 22,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Remove old unused styles
  settingsButton: {
    padding: 8,
    marginLeft: 8,
  },
  newChatButton: {
    padding: 8,
    marginLeft: 8,
  },
  bookmarksButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  loadingText: {
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 14,
  },
  apiKeyContainer: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apiKeyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  apiKeyInput: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  apiKeySaveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  apiKeySaveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  apiKeyHelpText: {
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
  },
  favoriteButton: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  favoriteButtonText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
});
