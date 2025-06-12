import { useAuth } from '@/app/context/AuthContext';
import { ChatHistoryModal } from '@/components/ChatHistoryModal';
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
import { chatHistoryService } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
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
    if (messages.length > 1 && messagesLoaded && user) {
      const saveCurrentChat = async () => {
        try {
          // For local storage
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
          
          // For Supabase
          if (currentSessionId) {
            // If we're continuing an existing chat, update it
            await chatHistoryService.addMessages(currentSessionId, messages);
          } else {
            // If it's a new chat, create a new session
            const sessionId = await chatHistoryService.saveCurrentChat(user.id, messages);
            if (sessionId) {
              setCurrentSessionId(sessionId);
            }
          }
        } catch (error) {
          console.error('Failed to save chat history:', error);
        }
      };
      
      saveCurrentChat();
    }
  }, [messages, messagesLoaded, user, currentSessionId]);

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to take photos of your math problems.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Request media library permissions
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library access is needed to upload photos of your math problems.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Pick an image from the library
  const pickImage = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Cancel image selection
  const cancelImageSelection = () => {
    setSelectedImage(null);
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;
    
    // Trigger light haptic feedback when sending a message
    lightHapticFeedback();
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim() || "Can you analyze this image for me?",
      timestamp: Date.now(),
      imageUri: selectedImage || undefined
    };
    
    // Add a reinforcement message to ensure quiz examples
    const quizReminderMessage: Message = {
      id: 'quiz-reminder-' + Date.now().toString(),
      role: 'system',
      content: 'Remember to include a quiz example in your response using the <quiz-example> JSON format if appropriate. The quiz should relate to the student\'s question and help them practice similar concepts.',
      timestamp: Date.now()
    };
    
    // Update state with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setSelectedImage(null);
    Keyboard.dismiss();
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Call GROQ API with the reminder message
      const response = await fetchGroqCompletion({
        messages: [...messages, quizReminderMessage, userMessage],
        includeImage: !!userMessage.imageUri, // Use image model if image is included
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
            setCurrentSessionId(null);
          }
        }
      ]
    );
  };
  
  const handleShowFavorites = () => {
    setShowFavorites(true);
  };

  const handleShowChatHistory = () => {
    setShowChatHistory(true);
  };
  
  const handleLoadChat = (loadedMessages: Message[]) => {
    setMessages(loadedMessages);
    // If the first message is not our standard welcome message, add it
    if (loadedMessages.length > 0 && loadedMessages[0].role !== 'assistant') {
      setMessages([...createInitialMessages(), ...loadedMessages]);
    }
  };
  
  // Toggle image options menu
  const toggleImageOptions = () => {
    setShowImageOptions(!showImageOptions);
  };
  
  // Get visible messages (exclude system messages)
  const visibleMessages = messagesLoaded ? messages.filter(m => m.role !== 'system') : [];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tutor</Text>
        <Text style={styles.subtitle}>Get help with your SAT prep</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={handleShowChatHistory}
        >
          <Ionicons name="list-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
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
      
      {/* Chat History Modal */}
      <ChatHistoryModal
        visible={showChatHistory}
        onClose={() => setShowChatHistory(false)}
        onLoadChat={handleLoadChat}
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
              You can also upload or take photos of math problems for analysis.
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
          
          {/* Preview of selected image */}
          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.cancelImageButton} onPress={cancelImageSelection}>
                <Ionicons name="close-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.imageHelpText}>Tap send to get help with this problem</Text>
            </View>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Tutor is thinking...</Text>
            </View>
          )}
        </ScrollView>
        
        {/* Image options menu */}
        {showImageOptions && (
          <View style={styles.imageOptionsContainer}>
            <TouchableOpacity style={styles.imageOptionButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageOptionButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#FFFFFF" />
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageOptionButton} onPress={toggleImageOptions}>
              <Ionicons name="close-outline" size={24} color="#FFFFFF" />
              <Text style={styles.imageOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Input area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.imageButton} 
            onPress={toggleImageOptions}
            disabled={isLoading}
          >
            <Ionicons 
              name="image-outline" 
              size={24} 
              color={isLoading ? COLORS.textLight : COLORS.primary} 
            />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={selectedImage ? "Add a description (optional)" : "Ask your tutor anything..."}
            placeholderTextColor={COLORS.textLight}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
          >
            <Ionicons
              name="send"
              size={24}
              color={(!inputText.trim() && !selectedImage) || isLoading ? COLORS.textLight : "white"}
            />
          </TouchableOpacity>
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
  historyButton: {
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
  selectedImageContainer: {
    margin: 8,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    backgroundColor: COLORS.primary,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: SIZES.radius,
  },
  cancelImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  imageHelpText: {
    fontSize: 12,
    color: '#FFFFFF',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  imageOptionsContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    padding: 16,
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  imageOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
  },
  imageButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
});
