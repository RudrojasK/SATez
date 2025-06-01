import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AdvancedModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animationType?: 'slide' | 'fade' | 'scale' | 'spring' | 'flip';
  position?: 'center' | 'bottom' | 'top' | 'fullscreen';
  backgroundColor?: string;
  useBlur?: boolean;
  hasGradient?: boolean;
  closable?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  borderRadius?: number;
  showIndicator?: boolean;
}

export default function AdvancedModal({
  visible,
  onClose,
  children,
  animationType = 'slide',
  position = 'center',
  backgroundColor = '#FFFFFF',
  useBlur = false,
  hasGradient = false,
  closable = true,
  size = 'medium',
  borderRadius = 24,
  showIndicator = false,
}: AdvancedModalProps) {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const showModal = () => {
    const animations = [];

    // Backdrop animation
    animations.push(
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    );

    // Modal-specific animations
    switch (animationType) {
      case 'fade':
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        );
        break;

      case 'scale':
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        );
        break;

      case 'spring':
        animations.push(
          Animated.spring(modalAnim, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          })
        );
        break;

      case 'flip':
        animations.push(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide':
      default:
        const slideTarget = position === 'bottom' ? 0 : 
                          position === 'top' ? 0 : 0;
        animations.push(
          Animated.spring(slideAnim, {
            toValue: slideTarget,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        );
        break;
    }

    Animated.parallel(animations).start();
  };

  const hideModal = () => {
    const animations = [];

    // Backdrop animation
    animations.push(
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    );

    // Reset modal animations
    switch (animationType) {
      case 'fade':
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;

      case 'scale':
        animations.push(
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;

      case 'spring':
        animations.push(
          Animated.spring(modalAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;

      case 'flip':
        animations.push(
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;

      case 'slide':
      default:
        const slideTarget = position === 'bottom' ? height : 
                          position === 'top' ? -height : height;
        animations.push(
          Animated.timing(slideAnim, {
            toValue: slideTarget,
            duration: 250,
            useNativeDriver: true,
          })
        );
        animations.push(
          Animated.timing(modalAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          })
        );
        break;
    }

    Animated.parallel(animations).start();
  };

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return { width: width * 0.8, maxHeight: height * 0.4 };
      case 'medium':
        return { width: width * 0.9, maxHeight: height * 0.6 };
      case 'large':
        return { width: width * 0.95, maxHeight: height * 0.8 };
      case 'fullscreen':
        return { width: width, height: height };
      default:
        return { width: width * 0.9, maxHeight: height * 0.6 };
    }
  };

  const getModalPosition = (): { justifyContent: 'flex-start' | 'flex-end' | 'center'; paddingTop?: number; paddingBottom?: number; padding?: number } => {
    switch (position) {
      case 'top':
        return { justifyContent: 'flex-start', paddingTop: 60 };
      case 'bottom':
        return { justifyContent: 'flex-end', paddingBottom: 40 };
      case 'fullscreen':
        return { justifyContent: 'center', padding: 0 };
      case 'center':
      default:
        return { justifyContent: 'center' };
    }
  };

  const getModalTransform = (): any[] => {
    const transforms: any[] = [];

    switch (animationType) {
      case 'fade':
        transforms.push({ opacity: modalAnim });
        break;

      case 'scale':
        transforms.push({ opacity: modalAnim });
        transforms.push({ scale: scaleAnim });
        break;

      case 'spring':
        transforms.push({ opacity: modalAnim });
        transforms.push({ scale: scaleAnim });
        break;

      case 'flip':
        const rotateY = rotateAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['180deg', '90deg', '0deg'],
        });
        transforms.push({ opacity: modalAnim });
        transforms.push({ rotateY });
        break;

      case 'slide':
      default:
        transforms.push({ opacity: modalAnim });
        if (position === 'bottom') {
          transforms.push({ translateY: slideAnim });
        } else if (position === 'top') {
          transforms.push({ translateY: slideAnim });
        } else {
          transforms.push({ translateY: slideAnim });
        }
        break;
    }

    return transforms;
  };

  if (!visible) return null;

  const Backdrop = useBlur ? BlurView : View;
  const backdropProps = useBlur 
    ? { intensity: 20, tint: 'dark' as const }
    : {};

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.7)" />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closable ? onClose : undefined}>
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
            <Backdrop
              style={StyleSheet.absoluteFillObject}
              {...backdropProps}
            />
            {!useBlur && (
              <View style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
              ]} />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>

        <View style={[styles.modalContainer, getModalPosition()]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                getModalSize(),
                {
                  borderRadius: position === 'fullscreen' ? 0 : borderRadius,
                  transform: getModalTransform(),
                },
              ]}
            >
              {hasGradient ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { borderRadius: position === 'fullscreen' ? 0 : borderRadius }
                  ]}
                />
              ) : (
                <View 
                  style={[
                    StyleSheet.absoluteFillObject,
                    { 
                      backgroundColor,
                      borderRadius: position === 'fullscreen' ? 0 : borderRadius 
                    }
                  ]} 
                />
              )}

              {showIndicator && position === 'bottom' && (
                <View style={styles.indicator} />
              )}

              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    ...Platform.select({
      android: {
        elevation: 25,
      },
    }),
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    minHeight: '100%',
  },
}); 