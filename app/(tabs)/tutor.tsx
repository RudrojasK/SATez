import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { ChatMessage } from '@/components/ChatMessage';
import { FavoriteResponsesModal } from '@/components/FavoriteResponsesModal';
import { 
  Message, 
  fetchGroqCompletion, 
  createInitialMessages,
  GROQ_API_KEY 
} from '@/utils/groq';
import { ApiKeyStorage, ChatHistoryStorage } from '@/utils/storage';

export default function TutorScreen() {
  const [messages, setMessages] = useState<Message[]>(createInitialMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(GROQ_API_KEY);
  const [showApiKeyInput, setShowApiKeyInput] = useState(GROQ_API_KEY === "YOUR_GROQ_API_KEY");
  const [showFavorites, setShowFavorites] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Load saved API key on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const savedApiKey = await ApiKeyStorage.getGroqApiKey();
        if (savedApiKey) {
          setApiKey(savedApiKey);
          setShowApiKeyInput(false);
        }
      } catch (error) {
        console.error('Failed to load API key:', error);
      }
    };
    
    loadApiKey();
  }, []);
  
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
    
    // Check if API key is set
    const storedApiKey = await ApiKeyStorage.getGroqApiKey();
    const currentApiKey = storedApiKey || apiKey;
    
    if (currentApiKey === "YOUR_GROQ_API_KEY") {
      Alert.alert(
        "API Key Required",
        "Please set your GROQ API key before sending messages.",
        [{ text: "OK", onPress: () => setShowApiKeyInput(true) }]
      );
      return;
    }
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: Date.now()
    };
    
    // Update state with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    Keyboard.dismiss();
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Call GROQ API
      const response = await fetchGroqCompletion({
        messages: [...messages, userMessage],
      });
      
      // Add assistant response to messages
      setMessages(prevMessages => [...prevMessages, response]);
    } catch (error) {
      console.error("Error fetching response from GROQ:", error);
      
      // Show error message
      Alert.alert(
        "Error",
        "Failed to get a response from the tutor. Please check your API key and network connection.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey.trim() === "YOUR_GROQ_API_KEY") {
      Alert.alert(
        "Invalid API Key",
        "Please enter a valid GROQ API key.",
        [{ text: "OK" }]
      );
      return;
    }
    
    try {
      // Save API key to persistent storage
      await ApiKeyStorage.saveGroqApiKey(apiKey);
      
      // Hide API key input
      setShowApiKeyInput(false);
      
      // Display a success message
      Alert.alert(
        "API Key Saved",
        "Your GROQ API key has been saved securely. You won't need to enter it again.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Failed to save API key:', error);
      Alert.alert(
        "Error",
        "Failed to save your API key. Please try again.",
        [{ text: "OK" }]
      );
    }
  };
  
  const  handleStartNewConversation = () => {
    Alert.alert(
      "New Conversation",
      "Are you sure you want to start a new conversation? This will clear all current messages.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => setMessages(createInitialMessages())
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
      <View style={styles.header}>
        <Text style={styles.title}>Tutor</Text>
        <Text style={styles.subtitle}>Get help with your SAT prep</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowApiKeyInput(true)}
        >
          <Text>
            <Ionicons name="key-outline" size={20} color={COLORS.textLight} />
          </Text>
        </TouchableOpacity>        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleShowFavorites}
        >
          <Text>
            <Ionicons name="bookmark-outline" size={20} color={COLORS.textLight} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleStartNewConversation}
        >
          <Text>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.textLight} />
          </Text>
        </TouchableOpacity>
      </View>
        {/* Favorites Modal */}
      <FavoriteResponsesModal
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
      {showApiKeyInput ? (
        <View style={styles.apiKeyContainer}>
          <Text style={styles.apiKeyLabel}>Enter your GROQ API Key:</Text>
          <TextInput
            style={styles.apiKeyInput}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.apiKeySaveButton}
            onPress={handleSaveApiKey}
          >
            <Text style={styles.apiKeySaveButtonText}>Save API Key</Text>
          </TouchableOpacity>
          <Text style={styles.apiKeyHelpText}>
            Get your API key from groq.com
          </Text>
        </View>
      ) : (
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
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIconContainer}>
                <Text>
                  <Ionicons name="school" size={32} color={COLORS.primary} />
                </Text>
              </View>
              <Text style={styles.welcomeTitle}>SAT Tutor</Text>
              <Text style={styles.welcomeText}>
                Ask questions about the SAT, get help with practice problems, or get study tips.
              </Text>
            </View>
            
            {/* Chat messages */}
            {visibleMessages.map((message, index) => (
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
              <Text>
                <Ionicons
                  name="send"
                  size={24}
                  color={!inputText.trim() || isLoading ? COLORS.textLight : "white"}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
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
