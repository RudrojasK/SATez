import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

const { width } = Dimensions.get('window');

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  value: string;
  icon: string;
  gradient: readonly [string, string];
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  onPress?: () => void;
  style?: ViewStyle;
  delay?: number;
}

export default function DashboardCard({
  title,
  subtitle,
  value,
  icon,
  gradient,
  trend,
  onPress,
  style,
  delay = 0
}: DashboardCardProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const slideValue = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();
  }, [delay]);

  const handlePress = () => {
    if (onPress) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: animatedValue,
          transform: [
            { scale: scaleValue },
            { translateY: slideValue }
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={24} color="#FFF" />
              </View>
              {trend && (
                <View style={[
                  styles.trendContainer,
                  { backgroundColor: trend.direction === 'up' ? 'rgba(76, 217, 100, 0.2)' : 'rgba(255, 59, 48, 0.2)' }
                ]}>
                  <Ionicons 
                    name={trend.direction === 'up' ? 'arrow-up' : 'arrow-down'} 
                    size={12} 
                    color={trend.direction === 'up' ? '#4CD964' : '#FF3B30'} 
                  />
                  <Text style={[
                    styles.trendText,
                    { color: trend.direction === 'up' ? '#4CD964' : '#FF3B30' }
                  ]}>
                    {trend.value}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.body}>
              <Text style={styles.value}>{value}</Text>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.footer}>
              <View style={styles.decorativeLine} />
            </View>
          </View>

          {/* Background decorative elements */}
          <View style={styles.backgroundDecor1} />
          <View style={styles.backgroundDecor2} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  touchable: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 20,
    minHeight: 140,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  footer: {
    marginTop: 16,
  },
  decorativeLine: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    width: '60%',
  },
  backgroundDecor1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -20,
    right: -20,
  },
  backgroundDecor2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 10,
    left: -10,
  },
}); 