import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface PracticeItemProps {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  onPress: () => void;
}

export const PracticeCard = ({
  title,
  description,
  timeEstimate,
  difficulty,
  progress,
  onPress,
}: PracticeItemProps) => {
  const difficultyVariant = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title} practice test`}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{description}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.infoText}>{timeEstimate}</Text>
        </View>
        
        <Badge 
          text={difficulty} 
          variant={difficultyVariant}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} />
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
        
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Start</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressWrapper: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.smallRadius,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    gap: 4,
  },
  startButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
}); 