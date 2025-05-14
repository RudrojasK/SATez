import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { COLORS, SIZES } from '@/constants/Colors';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  style?: ViewStyle;
  progressColor?: string;
  backgroundColor?: string;
}

export const ProgressBar = ({
  progress,
  height = 8,
  style,
  progressColor = COLORS.primary,
  backgroundColor = 'rgba(228, 233, 242, 0.6)',
}: ProgressBarProps) => {
  const validProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View 
      style={[
        styles.container, 
        { height, backgroundColor }, 
        style
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: validProgress }}
    >
      <View 
        style={[
          styles.progress, 
          {
            width: `${validProgress}%`,
            backgroundColor: progressColor,
            // Fix for Android rendering thin progress bars
            ...(Platform.OS === 'android' && validProgress > 0 && validProgress < 3 ? 
              { width: 8 } : {})
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: SIZES.smallRadius,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: SIZES.smallRadius,
  },
}); 