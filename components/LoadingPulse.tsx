import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface LoadingPulseProps {
  size?: number;
  color?: string;
  pulseCount?: number;
  duration?: number;
  intensity?: number;
}

export default function LoadingPulse({
  size = 100,
  color = '#667eea',
  pulseCount = 3,
  duration = 2000,
  intensity = 0.8,
}: LoadingPulseProps) {
  const pulseAnims = useRef(
    Array.from({ length: pulseCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = pulseAnims.map((anim, index) => 
      createPulseAnimation(anim, (index * duration) / pulseCount)
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [pulseAnims, pulseCount, duration]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {pulseAnims.map((anim, index) => {
        const scale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 2],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [intensity, intensity * 0.3, 0],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.pulse,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
      
      {/* Core gradient center */}
      <View style={[styles.core, { width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2 }]}>
        <LinearGradient
          colors={[color, `${color}80`]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
  },
  core: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
}); 