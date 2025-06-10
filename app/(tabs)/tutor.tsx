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
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Initialize messages
  useEffect(() => {
    setMessages(createInitialMessages());
    setMessagesLoaded(true);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesLoaded) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, messagesLoaded]);
  
  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 1 && messagesLoaded) { // Don't save empty chats
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
  }, [messages, messagesLoaded]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
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
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Call GROQ API with the reminder message
      const response = await fetchGroqCompletion({
        messages: [...messages, quizReminderMessage, userMessage],
      });
      
      // Add assistant response to messages
      setMessages(prevMessages => [...prevMessages, response]);
    } catch (error: any) {
      console.error("Error fetching response from GROQ:", error);
      
      // Show error message
      Alert.alert(
        "Error",
        "Failed to get a response from the tutor. Please check your network connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
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
          }
        }
      ]
    );
  };
  
  const handleShowFavorites = () => {
    setShowFavorites(true);
  };
  
  // Get visible messages (exclude system messages)
  const visibleMessages = messagesLoaded ? messages.filter(m => m.role !== 'system') : [];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tutor</Text>
        <Text style={styles.subtitle}>Get help with your SAT prep</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleShowFavorites}
        >
          <Ionicons name="bookmark-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleStartNewConversation}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      
      {/* Favorites Modal */}
      <FavoriteResponsesModal
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      
      <KeyboardAvoidingView
        key={messagesLoaded ? 'loaded' : 'loading'}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome header */}
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="school" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.welcomeTitle}>SAT Tutor</Text>
            <Text style={styles.welcomeText}>
              Ask questions about the SAT, get help with practice problems, or get study tips.
            </Text>
          </View>
          
          {/* Chat messages */}
          {messagesLoaded && visibleMessages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLastMessage={index === visibleMessages.length - 1}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Tutor is thinking...</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Input area */}
        <View style={styles.inputContainer}>
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
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={24}
              color={!inputText.trim() || isLoading ? COLORS.textLight : "white"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Favorite Responses Modal */}
      <FavoriteResponsesModal 
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 'auto',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    width: '100%',
    marginTop: 4,
  },  settingsButton: {
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
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 24,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
    color: COLORS.text,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  apiKeyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  apiKeyVisibilityButton: {
    padding: 12,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  responseItem: {
    padding: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  responseText: {
    color: COLORS.text,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
