import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { Message } from '@/utils/groq';
import { FavoriteResponsesStorage, FavoriteResponse } from '@/utils/storage';
import * as Clipboard from 'expo-clipboard';

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
}

export const ChatMessage = ({ message, isLastMessage }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);
  
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
    <TouchableOpacity 
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        isLastMessage && styles.lastMessage
      ]}
      activeOpacity={0.8}
      onLongPress={() => !isUser && setShowActions(true)}
    >
      <Text style={[
        styles.messageText,
        isUser ? styles.userMessageText : styles.assistantMessageText
      ]}>
        {message.content}
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
              <Text>
                <Ionicons name="copy-outline" size={16} color={COLORS.textLight} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSaveFavorite}>
              <Text>
                <Ionicons name="bookmark-outline" size={16} color={COLORS.textLight} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowActions(false)}>
              <Text>
                <Ionicons name="close-outline" size={16} color={COLORS.textLight} />
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 16,
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
  lastMessage: {
    marginBottom: 24,
  },
});
