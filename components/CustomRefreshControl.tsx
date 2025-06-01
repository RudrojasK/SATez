import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface Props {
  refreshing: boolean;
  style?: ViewStyle;
  progressViewOffset?: number;
}

export const CustomRefreshControl: React.FC<Props> = ({
  refreshing,
  style,
  progressViewOffset = 0,
}) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (refreshing) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      rotation.value = withSpring(0);
    }
  }, [refreshing]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        { top: progressViewOffset },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={['#2962ff', '#1a237e']}
        style={styles.spinner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
}); 