import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES } from '@/constants/Colors';

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'default';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({ 
  text,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) => {
  const getBadgeColor = () => {
    switch (variant) {
      case 'easy':
        return { bg: 'rgba(0, 196, 140, 0.15)', text: COLORS.success };
      case 'medium':
        return { bg: 'rgba(255, 211, 58, 0.15)', text: '#A97800' };
      case 'hard':
        return { bg: 'rgba(255, 100, 124, 0.15)', text: COLORS.error };
      default:
        return { bg: 'rgba(143, 155, 179, 0.15)', text: COLORS.textLight };
    }
  };

  const colors = getBadgeColor();

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: colors.bg }, 
        style
      ]}
      accessibilityRole="text"
    >
      <Text 
        style={[
          styles.text, 
          { color: colors.text },
          textStyle
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: SIZES.smallRadius,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 