import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
};

export const SkeletonLoader = ({
  width: itemWidth = width - 32,
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-width, { duration: 0 }),
        withTiming(width, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        {
          width: itemWidth,
          height,
          borderRadius,
          backgroundColor: '#E1E9EE',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'transparent']}
        />
      </Animated.View>
    </View>
  );
};

export const SkeletonScreen = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader height={40} style={styles.marginBottom} />
      <SkeletonLoader height={200} style={styles.marginBottom} />
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.listItem}>
          <SkeletonLoader width={60} height={60} borderRadius={30} style={styles.avatar} />
          <View style={styles.textContainer}>
            <SkeletonLoader width={200} height={20} style={styles.marginBottom} />
            <SkeletonLoader width={150} height={15} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  marginBottom: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
}); 