import { Dimensions } from 'react-native';
import {
    Easing,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface LayoutsType {
  screen: {
    width: number;
    height: number;
  };
}

interface ProgressType {
  progress: {
    interpolate: (config: {
      inputRange: number[];
      outputRange: number[];
    }) => number;
  };
}

interface CardStyleInterpolatorProps {
  current: ProgressType;
  next?: ProgressType;
  layouts: LayoutsType;
}

export const CustomTransition = {
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }: CardStyleInterpolatorProps) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                })
              : 1,
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

export const useSlideAnimation = (isVisible: boolean) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            isVisible ? 0 : height,
            {
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }
          ),
        },
      ],
    };
  });

  return animatedStyle;
};

export const useFadeAnimation = (isVisible: boolean) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        isVisible ? 1 : 0,
        {
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }
      ),
    };
  });

  return animatedStyle;
}; 