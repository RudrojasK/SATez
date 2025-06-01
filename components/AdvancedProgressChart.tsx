import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ProgressChartProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
    gradient: readonly [string, string];
  }[];
  title: string;
  subtitle?: string;
}

export default function AdvancedProgressChart({ data, title, subtitle }: ProgressChartProps) {
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;
  const containerAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Container animation
    Animated.parallel([
      Animated.timing(containerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered progress bar animations
    const animations = animatedValues.map((animValue, index) =>
      Animated.timing(animValue, {
        toValue: 1,
        duration: 1200,
        delay: index * 200,
        useNativeDriver: false,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const ProgressBar = ({ item, index }: { item: typeof data[0]; index: number }) => {
    const animatedValue = animatedValues[index];
    const progress = item.value / item.maxValue;

    const animatedWidth = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, progress],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{item.label}</Text>
          <Text style={styles.progressValue}>
            {item.value}/{item.maxValue}
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground} />
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${progress * 100}%`],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
          
          {/* Animated percentage indicator */}
          <Animated.View
            style={[
              styles.progressIndicator,
              {
                left: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${Math.min(progress * 100, 95)}%`],
                }),
                opacity: animatedValue,
              },
            ]}
          >
            <View style={[styles.indicatorDot, { backgroundColor: item.color }]} />
            <Text style={styles.indicatorText}>{Math.round(progress * 100)}%</Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.cardGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="analytics" size={24} color="#6C5CE7" />
          </View>
        </View>

        <View style={styles.chartContainer}>
          {data.map((item, index) => (
            <ProgressBar key={index} item={item} index={index} />
          ))}
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeGrid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: '#FFF',
  },
  cardGradient: {
    padding: 20,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    gap: 20,
  },
  progressItem: {
    position: 'relative',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  progressBarContainer: {
    height: 12,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    borderRadius: 6,
  },
  progressIndicator: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  decorativeGrid: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    opacity: 0.1,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#6C5CE7',
    marginVertical: 2,
    borderRadius: 1,
  },
}); 