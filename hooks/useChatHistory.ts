import { Message } from '@/utils/groq';
import { ChatSession, chatHistoryService } from '@/utils/supabase';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseChatHistoryOptions {
  /** The authenticated user's id */
  userId: string | null;
}

interface UseChatHistory {
  /** All chat sessions sorted by latest updated first */
  sessions: ChatSession[];
  /** Loading state while any network request is in flight */
  isLoading: boolean;
  /** Refresh sessions from the backend */
  reload: () => Promise<void>;
  /** Fetch all messages for a given session */
  fetchMessages: (sessionId: string) => Promise<Message[]>;
  /** Rename a chat session */
  renameSession: (sessionId: string, newTitle: string) => Promise<void>;
  /** Toggle the favourite flag */
  toggleFavourite: (sessionId: string) => Promise<void>;
  /** Permanently delete a chat session */
  deleteSession: (sessionId: string) => Promise<void>;
}

/**
 * Centralised hook to manage chat history CRUD operations with optimistic UI updates
 * and proper error handling. Keeps the ChatHistoryModal lean.
 */
export const useChatHistory = ({ userId }: UseChatHistoryOptions): UseChatHistory => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** Load all sessions for this user */
  const reload = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const dbSessions = await chatHistoryService.getSessions(userId);
      setSessions(dbSessions);
    } catch (error) {
      console.error('useChatHistory.reload error', error);
      Alert.alert('Error', 'Unable to load your chat history.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) reload();
  }, [userId, reload]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      return await chatHistoryService.getMessages(sessionId);
    } catch (error) {
      console.error('useChatHistory.fetchMessages error', error);
      Alert.alert('Error', 'Unable to load chat messages.');
      return [];
    }
  }, []);

  const renameSession = useCallback(async (sessionId: string, newTitle: string) => {
    try {
      // Optimistic UI update
      setSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, title: newTitle } : s)));
      await chatHistoryService.updateSession(sessionId, { title: newTitle });
    } catch (error) {
      console.error('useChatHistory.renameSession error', error);
      Alert.alert('Error', 'Unable to rename chat.');
      reload();
    }
  }, [reload]);

  const toggleFavourite = useCallback(async (sessionId: string) => {
    const target = sessions.find(s => s.id === sessionId);
    if (!target) return;
    const newFavourite = !target.is_favorite;
    try {
      // Optimistic update
      setSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, is_favorite: newFavourite } : s)));
      await chatHistoryService.updateSession(sessionId, { is_favorite: newFavourite });
    } catch (error) {
      console.error('useChatHistory.toggleFavourite error', error);
      Alert.alert('Error', 'Unable to update favourite.');
      reload();
    }
  }, [sessions, reload]);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      // Optimistic removal
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      await chatHistoryService.deleteSession(sessionId);
    } catch (error) {
      console.error('useChatHistory.deleteSession error', error);
      Alert.alert('Error', 'Unable to delete chat.');
      reload();
    }
  }, [reload]);

  return {
    sessions,
    isLoading,
    reload,
    fetchMessages,
    renameSession,
    toggleFavourite,
    deleteSession,
  };
}; 