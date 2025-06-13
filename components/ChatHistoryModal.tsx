import { useAuth } from '@/app/context/AuthContext';
import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import { useChatHistory } from '@/hooks/useChatHistory';
import { Message } from '@/utils/groq';
import type { ChatSession } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onLoadChat: (messages: Message[], sessionId: string) => void;
}

export const ChatHistoryModal = ({ visible, onClose, onLoadChat }: ChatHistoryModalProps) => {
  const { user } = useAuth();
  const {
    sessions,
    isLoading,
    fetchMessages,
    renameSession,
    toggleFavourite,
    deleteSession,
  } = useChatHistory({ userId: user?.id ?? null });

  const [search, setSearch] = useState('');
  const [editingSession, setEditingSession] = useState<ChatSession | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleLoadChat = async (session: ChatSession) => {
    const messages = await fetchMessages(session.id);
    if (messages.length > 0) {
      onLoadChat(messages, session.id);
      onClose();
    } else {
      Alert.alert('Empty chat', 'This chat has no messages yet.');
    }
  };
  
  const handleToggleFavorite = (session: ChatSession) => toggleFavourite(session.id);
  
  const handleSaveEdit = () => {
    if (!editingSession) return;
    renameSession(editingSession.id, editTitle.trim() || 'Untitled Chat');
    setEditingSession(null);
    setEditTitle('');
  };
  
  const handleDeleteChat = (sessionId: string) => {
    setDeletingId(sessionId);
    deleteSession(sessionId).finally(() => setDeletingId(null));
  };
  
  const confirmDelete = (session: ChatSession) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${session.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteChat(session.id) },
      ],
    );
  };
  
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.is_favorite && 'favorite'.includes(search.toLowerCase()))
  );
  
  const renderChatSessionItem = ({ item }: { item: ChatSession }) => (
    <View style={styles.chatItem}>
      {editingSession?.id === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Enter chat title"
            placeholderTextColor={COLORS.textLight}
          />
          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={[styles.editButton, styles.cancelButton]} 
              onPress={() => setEditingSession(null)}
            >
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.editButton, styles.saveButton]} 
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.chatTitleContainer} 
            onPress={() => handleLoadChat(item)}
          >
            <View style={styles.chatTitleRow}>
              <Ionicons 
                name={item.is_favorite ? "star" : "chatbubble-outline"} 
                size={20} 
                color={item.is_favorite ? "#FFD700" : COLORS.primary} 
                style={styles.chatIcon}
              />
              <Text style={styles.chatTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <Text style={styles.chatDate}>
              {format(new Date(item.updated_at), 'MMM d, yyyy • h:mm a')}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.chatActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleToggleFavorite(item)}
            >
              <Ionicons 
                name={item.is_favorite ? "star" : "star-outline"} 
                size={20} 
                color={item.is_favorite ? "#FFD700" : COLORS.textLight} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setEditingSession(item)}
            >
              <Ionicons name="pencil-outline" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => confirmDelete(item)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="trash-outline" size={20} color={COLORS.textLight} />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={48} color={COLORS.textLight} />
      <Text style={styles.emptyText}>No saved chats yet</Text>
      <Text style={styles.emptySubText}>
        Start a conversation with the tutor and it will be saved automatically
      </Text>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Your Saved Chats</Text>
      {sessions.length > 0 && (
        <Text style={styles.listHeaderSubtitle}>
          Tap on a chat to continue the conversation
        </Text>
      )}
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chat History</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        {isLoading && filteredSessions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your chat history...</Text>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={COLORS.textLight}
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              data={filteredSessions}
              renderItem={renderChatSessionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              ListHeaderComponent={renderHeader}
            />
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  chatItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  chatTitleContainer: {
    flex: 1,
  },
  chatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIcon: {
    marginRight: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  chatDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginLeft: 28,
  },
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  editContainer: {
    width: '100%',
  },
  editInput: {
    backgroundColor: '#FFF',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    color: COLORS.text,
  },
}); 