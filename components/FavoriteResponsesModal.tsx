import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { FavoriteResponsesStorage, FavoriteResponse } from '@/utils/storage';
import * as Clipboard from 'expo-clipboard';

interface FavoriteResponsesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FavoriteResponsesModal = ({ visible, onClose }: FavoriteResponsesModalProps) => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load favorite responses when modal opens
  useEffect(() => {
    if (visible) {
      loadFavorites();
    }
  }, [visible]);
  
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const responses = await FavoriteResponsesStorage.getFavoriteResponses();
      setFavorites(responses);
    } catch (error) {
      console.error('Failed to load favorite responses:', error);
      Alert.alert('Error', 'Failed to load favorite responses');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyResponse = async (response: FavoriteResponse) => {
    try {
      await Clipboard.setStringAsync(response.answer);
      Alert.alert('Copied!', 'Response copied to clipboard');
    } catch (error) {
      console.error('Failed to copy response:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };
  
  const handleDeleteFavorite = async (id: string) => {
    try {
      await FavoriteResponsesStorage.removeFavoriteResponse(id);
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
      Alert.alert('Deleted', 'Favorite response removed');
    } catch (error) {
      console.error('Failed to delete favorite response:', error);
      Alert.alert('Error', 'Failed to delete favorite');
    }
  };
  
  const renderItem = ({ item }: { item: FavoriteResponse }) => (
    <View style={styles.favoriteItem}>
      <Text style={styles.favoriteQuestion}>{item.question}</Text>
      <Text style={styles.favoriteAnswer} numberOfLines={3}>
        {item.answer}
      </Text>
      <View style={styles.favoriteActions}>
        <Text style={styles.favoriteDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <View style={styles.favoriteButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleCopyResponse(item)}
          >
            <Text>
              <Ionicons name="copy-outline" size={20} color={COLORS.textLight} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteFavorite(item.id)}
          >
            <Text>
              <Ionicons name="trash-outline" size={20} color={COLORS.textLight} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
          <Text style={styles.title}>Saved Answers</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </Text>
          </TouchableOpacity>
        </View>
        
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No saved answers yet'}
            </Text>
            {!loading && (
              <Text style={styles.emptySubText}>
                Long press on tutor responses to save them for later
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
  },
  favoriteItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  favoriteQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  favoriteAnswer: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  favoriteDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  favoriteButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
