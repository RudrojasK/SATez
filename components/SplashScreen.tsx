import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textPosition = useSharedValue(50);

  useEffect(() => {
    // Start animation sequence
    scale.value = withSequence(
      withSpring(1.2, { damping: 15 }),
      withSpring(1, { damping: 12 })
    );
    
    opacity.value = withTiming(1, { duration: 1000 });
    textPosition.value = withTiming(0, { 
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });

    // Trigger completion after animations
    const timeout = setTimeout(onAnimationComplete, 2500);
    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: textPosition.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#304ffe', '#2962ff']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
          />
        </Animated.View>
        
        <Animated.Text style={[styles.text, textStyle]}>
          SATez
        </Animated.Text>
        
        <Animated.Text style={[styles.subText, textStyle]}>
          Your Path to SAT Success
        </Animated.Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
  },
  subText: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 10,
  },
}); 