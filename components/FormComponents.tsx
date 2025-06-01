import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  validationRules?: ValidationRule[];
  icon?: keyof typeof Ionicons.glyphMap;
  multiline?: boolean;
  maxLength?: number;
  editable?: boolean;
  hasGradient?: boolean;
}

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FormButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  validationRules = [],
  icon,
  multiline = false,
  maxLength,
  editable = true,
  hasGradient = false,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const focusAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  useEffect(() => {
    if (touched) {
      validate();
    }
  }, [value, touched]);

  const validate = () => {
    const newErrors: string[] = [];
    validationRules.forEach((rule) => {
      if (!rule.test(value)) {
        newErrors.push(rule.message);
      }
    });
    setErrors(newErrors);

    Animated.timing(errorAnim, {
      toValue: newErrors.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: errors.length > 0 ? ['#FF6B6B', '#FF6B6B'] : ['#E1E5E9', '#667eea'],
  });

  const labelTranslateY = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const labelScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const labelColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: errors.length > 0 ? ['#FF6B6B', '#FF6B6B'] : ['#8F9BB3', '#667eea'],
  });

  const errorHeight = errorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <Animated.View style={[styles.inputContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.inputWrapper}>
        {hasGradient ? (
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : null}
        
        <Animated.View
          style={[
            styles.inputBox,
            {
              borderColor,
              borderWidth: isFocused ? 2 : 1,
            },
          ]}
        >
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons 
                name={icon} 
                size={20} 
                color={isFocused ? '#667eea' : '#8F9BB3'} 
              />
            </View>
          )}

          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.label,
                {
                  color: labelColor,
                  transform: [
                    { translateY: labelTranslateY },
                    { scale: labelScale },
                  ],
                },
              ]}
            >
              {label}
            </Animated.Text>

            <TextInput
              style={[
                styles.input,
                multiline && styles.multilineInput,
                { marginTop: isFocused || value ? 8 : 0 },
              ]}
              value={value}
              onChangeText={onChangeText}
              placeholder={isFocused ? placeholder : ''}
              placeholderTextColor="#C5CEE0"
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onFocus={handleFocus}
              onBlur={handleBlur}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
              maxLength={maxLength}
              editable={editable}
              selectionColor="#667eea"
            />
          </View>

          {secureTextEntry && (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color="#8F9BB3"
              />
            </TouchableOpacity>
          )}

          {maxLength && (
            <Text style={styles.characterCount}>
              {value.length}/{maxLength}
            </Text>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[styles.errorContainer, { height: errorHeight }]}>
        {errors.map((error, index) => (
          <Text key={index} style={styles.errorText}>
            {error}
          </Text>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

export function FormButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: FormButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      loadingAnim.setValue(0);
    }
  }, [loading]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getButtonStyle = () => {
    let sizeStyle;
    if (size === 'small') {
      sizeStyle = styles.buttonSmall;
    } else if (size === 'large') {
      sizeStyle = styles.buttonLarge;
    } else {
      sizeStyle = styles.buttonMedium;
    }

    let variantStyle;
    switch (variant) {
      case 'secondary':
        variantStyle = styles.buttonSecondary;
        break;
      case 'outline':
        variantStyle = styles.buttonOutline;
        break;
      case 'gradient':
        variantStyle = {}; // Handled by LinearGradient
        break;
      default:
        variantStyle = styles.buttonPrimary;
        break;
    }

    return [
      styles.button,
      sizeStyle,
      variantStyle,
      fullWidth && styles.buttonFullWidth,
      disabled && styles.buttonDisabled,
    ].filter(Boolean);
  };

  const getTextStyle = () => {
    let sizeStyle;
    if (size === 'small') {
      sizeStyle = styles.buttonTextSmall;
    } else if (size === 'large') {
      sizeStyle = styles.buttonTextLarge;
    } else {
      sizeStyle = styles.buttonTextMedium;
    }

    let variantStyle;
    switch (variant) {
      case 'secondary':
        variantStyle = styles.buttonTextSecondary;
        break;
      case 'outline':
        variantStyle = styles.buttonTextOutline;
        break;
      default:
        variantStyle = styles.buttonTextPrimary;
        break;
    }

    return [
      styles.buttonText,
      sizeStyle,
      variantStyle,
      disabled && styles.buttonTextDisabled,
    ].filter(Boolean);
  };

  const loadingRotation = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ButtonContent = () => (
    <View style={styles.buttonContent}>
      {loading ? (
        <Animated.View style={{ transform: [{ rotate: loadingRotation }] }}>
          <Ionicons name="refresh" size={size === 'small' ? 16 : size === 'large' ? 24 : 20} color="#fff" />
        </Animated.View>
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={variant === 'outline' ? '#667eea' : '#fff'} 
              style={styles.buttonIcon} 
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {variant === 'gradient' ? (
          <LinearGradient
            colors={disabled ? ['#C5CEE0', '#E1E5E9'] : ['#667eea', '#764ba2']}
            style={getButtonStyle()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ButtonContent />
          </LinearGradient>
        ) : (
          <View style={getButtonStyle()}>
            <ButtonContent />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
  }),
  email: (message = 'Please enter a valid email'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Minimum ${min} characters required`,
  }),
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Maximum ${max} characters allowed`,
  }),
  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value),
    message,
  }),
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
    message,
  }),
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    position: 'absolute',
    top: 18,
    left: 0,
  },
  input: {
    fontSize: 16,
    color: '#2E3A59',
    padding: 0,
    minHeight: 24,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  passwordToggle: {
    padding: 8,
    marginTop: 10,
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontSize: 12,
    color: '#8F9BB3',
  },
  errorContainer: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
  },

  // Button Styles
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  buttonMedium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#667eea',
  },
  buttonSecondary: {
    backgroundColor: '#8F9BB3',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  buttonDisabled: {
    backgroundColor: '#E1E5E9',
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextMedium: {
    fontSize: 16,
  },
  buttonTextLarge: {
    fontSize: 18,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    color: '#667eea',
  },
  buttonTextDisabled: {
    color: '#8F9BB3',
  },
}); 