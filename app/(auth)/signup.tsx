import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { signUp } = useAuth();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const nameErrorAnim = useRef(new Animated.Value(0)).current;
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordErrorAnim = useRef(new Animated.Value(0)).current;
  const strengthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Validation functions
  const validateName = (nameText: string) => {
    if (!nameText.trim()) {
      setNameError('Full name is required');
      setNameValid(false);
      return false;
    }
    if (nameText.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      setNameValid(false);
      return false;
    }
    setNameError('');
    setNameValid(true);
    return true;
  };

  const validateEmail = (emailText: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailText.trim()) {
      setEmailError('Email is required');
      setEmailValid(false);
      return false;
    }
    
    if (!emailRegex.test(emailText)) {
      setEmailError('Please enter a valid email address');
      setEmailValid(false);
      return false;
    }
    
    setEmailError('');
    setEmailValid(true);
    return true;
  };

  const calculatePasswordStrength = (passwordText: string) => {
    let strength = 0;
    if (passwordText.length >= 8) strength += 25;
    if (/[a-z]/.test(passwordText)) strength += 25;
    if (/[A-Z]/.test(passwordText)) strength += 25;
    if (/[0-9]/.test(passwordText)) strength += 25;
    if (/[^A-Za-z0-9]/.test(passwordText)) strength += 25;
    return Math.min(strength, 100);
  };

  const validatePassword = (passwordText: string) => {
    const strength = calculatePasswordStrength(passwordText);
    setPasswordStrength(strength);
    
    // Animate strength meter
    Animated.timing(strengthAnim, {
      toValue: strength / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    if (!passwordText.trim()) {
      setPasswordError('Password is required');
      setPasswordValid(false);
      return false;
    }
    
    if (passwordText.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setPasswordValid(false);
      return false;
    }
    
    if (strength < 50) {
      setPasswordError('Password is too weak');
      setPasswordValid(false);
      return false;
    }
    
    setPasswordError('');
    setPasswordValid(true);
    return true;
  };

  const validateConfirmPassword = (confirmPasswordText: string) => {
    if (!confirmPasswordText.trim()) {
      setConfirmPasswordError('Please confirm your password');
      setConfirmPasswordValid(false);
      return false;
    }
    
    if (confirmPasswordText !== password) {
      setConfirmPasswordError('Passwords do not match');
      setConfirmPasswordValid(false);
      return false;
    }
    
    setConfirmPasswordError('');
    setConfirmPasswordValid(true);
    return true;
  };

  // Handle input changes with validation
  const handleNameChange = (text: string) => {
    setName(text);
    if (formSubmitted || text.length > 0) {
      validateName(text);
      animateErrorMessage(nameErrorAnim, !!nameError);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (formSubmitted || text.length > 0) {
      validateEmail(text);
      animateErrorMessage(emailErrorAnim, !!emailError);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (formSubmitted || text.length > 0) {
      validatePassword(text);
      animateErrorMessage(passwordErrorAnim, !!passwordError);
    }
    
    // Re-validate confirm password if it exists
    if (confirmPassword && (formSubmitted || confirmPassword.length > 0)) {
      validateConfirmPassword(confirmPassword);
      animateErrorMessage(confirmPasswordErrorAnim, !!confirmPasswordError);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (formSubmitted || text.length > 0) {
      validateConfirmPassword(text);
      animateErrorMessage(confirmPasswordErrorAnim, !!confirmPasswordError);
    }
  };

  // Animate error messages
  const animateErrorMessage = (anim: Animated.Value, show: boolean) => {
    Animated.timing(anim, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Shake animation for form errors
  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSignup = async () => {
    setFormSubmitted(true);
    
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    // Animate error messages
    animateErrorMessage(nameErrorAnim, !isNameValid);
    animateErrorMessage(emailErrorAnim, !isEmailValid);
    animateErrorMessage(passwordErrorAnim, !isPasswordValid);
    animateErrorMessage(confirmPasswordErrorAnim, !isConfirmPasswordValid);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      triggerShakeAnimation();
      return;
    }

    // Button pulse animation
    Animated.sequence([
      Animated.timing(buttonPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setIsLoading(true);
      await signUp(email.trim(), password, name.trim());
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const floatingTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  // Get input border color based on validation state
  const getInputBorderColors = (isValid: boolean, hasError: boolean, isFocused: boolean) => {
    if (hasError && formSubmitted) {
      return ['#e74c3c', '#c0392b']; // Red for errors
    }
    if (isValid && formSubmitted) {
      return ['#27ae60', '#2ecc71']; // Green for valid
    }
    if (isFocused) {
      return ['#667eea', '#764ba2']; // Blue for focused
    }
    return ['#f8f9fa', '#f1f3f4']; // Default gray
  };

  // Get icon color based on state
  const getIconColor = (isValid: boolean, hasError: boolean, isFocused: boolean) => {
    if (hasError && formSubmitted) return '#e74c3c';
    if (isValid && formSubmitted) return '#27ae60';
    if (isFocused) return '#667eea';
    return '#666';
  };

  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 25) return '#e74c3c';
    if (passwordStrength < 50) return '#f39c12';
    if (passwordStrength < 75) return '#f1c40f';
    return '#27ae60';
  };

  // Get password strength text
  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated background gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating background shapes */}
      <Animated.View 
        style={[
          styles.floatingShape1,
          { transform: [{ translateY: floatingTransform }] }
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.shapeGradient}
        />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.floatingShape2,
          { transform: [{ translateY: floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }) }] }
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
          style={styles.shapeGradient}
        />
      </Animated.View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] }
                ]}
              >
                <View style={styles.logoCircle}>
                  <Image 
                    source={require('../../assets/images/dailySAT.jpg.jpg')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.brandName}>SATez</Text>
              </Animated.View>
              <Text style={styles.welcomeText}>Join SATez! 🚀</Text>
              <Text style={styles.subtitleText}>Create your account to start your SAT prep journey</Text>
            </Animated.View>

            <Animated.View 
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { translateX: shakeAnim }
                  ],
                }
              ]}
            >
              <View style={styles.formCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                  style={StyleSheet.absoluteFillObject}
                />
                
                {/* Full Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={[
                    styles.inputWrapper,
                    (nameFocused || nameValid || (nameError && formSubmitted)) && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={getInputBorderColors(nameValid, !!nameError, nameFocused) as [string, string]}
                      style={styles.inputGradientBorder}
                    >
                      <View style={styles.inputInner}>
                        <Ionicons 
                          name="person-outline" 
                          size={20} 
                          color={getIconColor(nameValid, !!nameError, nameFocused)}
                          style={styles.inputIcon} 
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your full name"
                          placeholderTextColor="#999"
                          value={name}
                          onChangeText={handleNameChange}
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setNameFocused(false)}
                          autoCapitalize="words"
                          autoCorrect={false}
                        />
                        {nameValid && formSubmitted && (
                          <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
                        )}
                        {nameError && formSubmitted && (
                          <Ionicons name="close-circle" size={20} color="#e74c3c" />
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  {/* Name Error Message */}
                  <Animated.View 
                    style={[
                      styles.errorContainer,
                      {
                        opacity: nameErrorAnim,
                        transform: [
                          {
                            translateY: nameErrorAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Ionicons name="warning" size={14} color="#e74c3c" />
                    <Text style={styles.errorText}>{nameError}</Text>
                  </Animated.View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[
                    styles.inputWrapper,
                    (emailFocused || emailValid || (emailError && formSubmitted)) && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={getInputBorderColors(emailValid, !!emailError, emailFocused) as [string, string]}
                      style={styles.inputGradientBorder}
                    >
                      <View style={styles.inputInner}>
                        <Ionicons 
                          name="mail-outline" 
                          size={20} 
                          color={getIconColor(emailValid, !!emailError, emailFocused)}
                          style={styles.inputIcon} 
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter your email"
                          placeholderTextColor="#999"
                          value={email}
                          onChangeText={handleEmailChange}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        {emailValid && formSubmitted && (
                          <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
                        )}
                        {emailError && formSubmitted && (
                          <Ionicons name="close-circle" size={20} color="#e74c3c" />
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  {/* Email Error Message */}
                  <Animated.View 
                    style={[
                      styles.errorContainer,
                      {
                        opacity: emailErrorAnim,
                        transform: [
                          {
                            translateY: emailErrorAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Ionicons name="warning" size={14} color="#e74c3c" />
                    <Text style={styles.errorText}>{emailError}</Text>
                  </Animated.View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    (passwordFocused || passwordValid || (passwordError && formSubmitted)) && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={getInputBorderColors(passwordValid, !!passwordError, passwordFocused) as [string, string]}
                      style={styles.inputGradientBorder}
                    >
                      <View style={styles.inputInner}>
                        <Ionicons 
                          name="lock-closed-outline" 
                          size={20} 
                          color={getIconColor(passwordValid, !!passwordError, passwordFocused)}
                          style={styles.inputIcon} 
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Create a password"
                          placeholderTextColor="#999"
                          value={password}
                          onChangeText={handlePasswordChange}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}
                        >
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={20} 
                            color={getIconColor(passwordValid, !!passwordError, passwordFocused)}
                          />
                        </TouchableOpacity>
                        {passwordValid && formSubmitted && (
                          <Ionicons name="checkmark-circle" size={20} color="#27ae60" style={styles.validationIcon} />
                        )}
                        {passwordError && formSubmitted && (
                          <Ionicons name="close-circle" size={20} color="#e74c3c" style={styles.validationIcon} />
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthMeter}>
                        <Animated.View 
                          style={[
                            styles.strengthFill,
                            {
                              width: strengthAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                                extrapolate: 'clamp',
                              }),
                              backgroundColor: getStrengthColor(),
                            }
                          ]}
                        />
                      </View>
                      <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                        {getStrengthText()}
                      </Text>
                    </View>
                  )}
                  
                  {/* Password Error Message */}
                  <Animated.View 
                    style={[
                      styles.errorContainer,
                      {
                        opacity: passwordErrorAnim,
                        transform: [
                          {
                            translateY: passwordErrorAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Ionicons name="warning" size={14} color="#e74c3c" />
                    <Text style={styles.errorText}>{passwordError}</Text>
                  </Animated.View>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    (confirmPasswordFocused || confirmPasswordValid || (confirmPasswordError && formSubmitted)) && styles.inputWrapperFocused
                  ]}>
                    <LinearGradient
                      colors={getInputBorderColors(confirmPasswordValid, !!confirmPasswordError, confirmPasswordFocused) as [string, string]}
                      style={styles.inputGradientBorder}
                    >
                      <View style={styles.inputInner}>
                        <Ionicons 
                          name="shield-checkmark-outline" 
                          size={20} 
                          color={getIconColor(confirmPasswordValid, !!confirmPasswordError, confirmPasswordFocused)}
                          style={styles.inputIcon} 
                        />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Confirm your password"
                          placeholderTextColor="#999"
                          value={confirmPassword}
                          onChangeText={handleConfirmPasswordChange}
                          onFocus={() => setConfirmPasswordFocused(true)}
                          onBlur={() => setConfirmPasswordFocused(false)}
                          secureTextEntry={!showConfirmPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIcon}
                        >
                          <Ionicons 
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                            size={20} 
                            color={getIconColor(confirmPasswordValid, !!confirmPasswordError, confirmPasswordFocused)}
                          />
                        </TouchableOpacity>
                        {confirmPasswordValid && formSubmitted && (
                          <Ionicons name="checkmark-circle" size={20} color="#27ae60" style={styles.validationIcon} />
                        )}
                        {confirmPasswordError && formSubmitted && (
                          <Ionicons name="close-circle" size={20} color="#e74c3c" style={styles.validationIcon} />
                        )}
                      </View>
                    </LinearGradient>
                  </View>
                  
                  {/* Confirm Password Error Message */}
                  <Animated.View 
                    style={[
                      styles.errorContainer,
                      {
                        opacity: confirmPasswordErrorAnim,
                        transform: [
                          {
                            translateY: confirmPasswordErrorAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Ionicons name="warning" size={14} color="#e74c3c" />
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  </Animated.View>
                </View>

                <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
                  <TouchableOpacity 
                    style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.signupButtonGradient}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View style={[styles.spinner, { 
                            transform: [{ 
                              rotate: floatAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              })
                            }] 
                          }]} />
                          <Text style={styles.signupButtonText}>Creating Account...</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.signupButtonText}>Create Account</Text>
                          <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#fff', '#f8f9fa']}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-google" size={20} color="#DB4437" />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#000', '#333']}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="logo-apple" size={20} color="#fff" />
                      <Text style={[styles.socialButtonText, { color: '#fff' }]}>Apple</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginGradient}
                    >
                      <Text style={styles.loginLink}>Sign In</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  floatingShape1: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.1,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.6,
  },
  floatingShape2: {
    position: 'absolute',
    top: height * 0.7,
    left: width * 0.05,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.4,
  },
  shapeGradient: {
    flex: 1,
    borderRadius: 60,
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.04,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  brandName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGradientBorder: {
    padding: 2,
    borderRadius: 16,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  validationIcon: {
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#e74c3c',
    marginLeft: 6,
    flex: 1,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  strengthMeter: {
    flex: 1,
    height: 4,
    backgroundColor: '#e1e5e9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
  },
  signupButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginTop: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e1e5e9',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  socialButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loginLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 