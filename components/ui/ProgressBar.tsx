import { COLORS, SIZES } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
  color = COLORS.primary,
  backgroundColor = COLORS.background
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View
        style={[
          styles.progress,
          {
            backgroundColor: color,
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: SIZES.radius,
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    borderRadius: SIZES.radius
  }
}); 