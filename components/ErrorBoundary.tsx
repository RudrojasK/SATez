import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { Component, ReactNode } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      fadeAnim: new Animated.Value(0),
      scaleAnim: new Animated.Value(0.8),
      slideAnim: new Animated.Value(50),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Animate error display
    Animated.parallel([
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }

  handleRetry = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset state
      this.setState({
        hasError: false,
        error: null,
        fadeAnim: new Animated.Value(0),
        scaleAnim: new Animated.Value(0.8),
        slideAnim: new Animated.Value(50),
      });
    });
  };

  handleReportError = () => {
    // In a real app, this would send the error to a logging service
    console.log('Error reported:', this.state.error);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
          
          <LinearGradient
            colors={['#1a1a1a', '#2d2d2d']}
            style={StyleSheet.absoluteFillObject}
          />

          <Animated.View
            style={[
              styles.content,
              {
                opacity: this.state.fadeAnim,
                transform: [
                  { scale: this.state.scaleAnim },
                  { translateY: this.state.slideAnim },
                ],
              },
            ]}
          >
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.iconGradient}
              >
                <Ionicons name="warning" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Error Message */}
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.subtitle}>
              We encountered an unexpected error. Don't worry, it's not your fault.
            </Text>

            {/* Error Details (for development) */}
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details:</Text>
                <Text style={styles.errorMessage}>
                  {this.state.error.message}
                </Text>
                <Text style={styles.errorStack}>
                  {this.state.error.stack?.slice(0, 200)}...
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={this.handleRetry}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={this.handleReportError}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={16} color="#8F9BB3" />
                <Text style={styles.secondaryButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <View style={[styles.floatingElement, styles.element1]}>
                <Ionicons name="ellipse" size={8} color="rgba(255,255,255,0.1)" />
              </View>
              <View style={[styles.floatingElement, styles.element2]}>
                <Ionicons name="triangle" size={12} color="rgba(255,255,255,0.05)" />
              </View>
              <View style={[styles.floatingElement, styles.element3]}>
                <Ionicons name="square" size={6} color="rgba(255,255,255,0.08)" />
              </View>
            </View>
          </Animated.View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    maxWidth: width * 0.9,
  },
  iconContainer: {
    marginBottom: 32,
    borderRadius: 50,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  errorDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  errorStack: {
    fontSize: 10,
    color: '#8F9BB3',
    fontFamily: 'monospace',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8F9BB3',
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
  },
  element1: {
    top: '10%',
    left: '15%',
  },
  element2: {
    top: '25%',
    right: '20%',
  },
  element3: {
    bottom: '30%',
    left: '25%',
  },
}); 