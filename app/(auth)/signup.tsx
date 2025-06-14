import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
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
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { signUp } = useAuth();

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      
      // Sign up with additional user metadata
      await signUp(
        email.trim(),
        password,
        fullName,
        {
          school: school.trim(),
          grade: grade ? parseInt(grade, 10) : undefined,
          target_score: targetScore ? parseInt(targetScore, 10) : undefined
        }
      );
      
      // The AuthContext will handle navigation after signup
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>S</Text>
                </View>
                <Text style={styles.brandName}>SATez</Text>
              </View>
              <Text style={styles.welcomeText}>Join SATez</Text>
              <Text style={styles.subtitleText}>
                Create your account to start your SAT prep journey
              </Text>
              
              <View style={styles.stepIndicator}>
                <View style={[styles.stepDot, currentStep >= 1 && styles.activeStepDot]}>
                  <Text style={[styles.stepNumber, currentStep >= 1 && styles.activeStepNumber]}>1</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={[styles.stepDot, currentStep >= 2 && styles.activeStepDot]}>
                  <Text style={[styles.stepNumber, currentStep >= 2 && styles.activeStepNumber]}>2</Text>
                </View>
              </View>
            </View>

            {currentStep === 1 ? (
              // Step 1: Account Details
              <View style={styles.formContainer}>
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Text style={styles.inputLabel}>First Name<Text style={styles.requiredStar}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="First"
                        placeholderTextColor="#999"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Text style={styles.inputLabel}>Last Name<Text style={styles.requiredStar}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Last"
                        placeholderTextColor="#999"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email<Text style={styles.requiredStar}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password<Text style={styles.requiredStar}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Create a password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
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
                        color="#666" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password<Text style={styles.requiredStar}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirm your password"
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
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
                        color="#666" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.nextButton}
                  onPress={handleNextStep}
                >
                  <Text style={styles.nextButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            ) : (
              // Step 2: Education Info
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>School Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="school-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your school name"
                      placeholderTextColor="#999"
                      value={school}
                      onChangeText={setSchool}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Grade Level</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your grade (e.g., 11)"
                      placeholderTextColor="#999"
                      value={grade}
                      onChangeText={setGrade}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Target SAT Score</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="trophy-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your target score (e.g., 1400)"
                      placeholderTextColor="#999"
                      value={targetScore}
                      onChangeText={setTargetScore}
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                  <Text style={styles.helperText}>These details help us personalize your SAT prep experience</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handlePrevStep}
                  >
                    <Ionicons name="arrow-back" size={20} color="#4a90e2" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <View style={styles.spinner} />
                        <Text style={styles.signupButtonText}>Creating Account...</Text>
                      </View>
                    ) : (
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={20} color="#000" />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0d1b2a',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: '#4a90e2',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  activeStepNumber: {
    color: '#fff',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e9ecef',
    marginHorizontal: 8,
  },
  formContainer: {
    flex: 1,
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#dc3545',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputIcon: {
    paddingLeft: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 12,
    color: '#212529',
  },
  eyeIcon: {
    padding: 12,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  backButtonText: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  signupButton: {
    flex: 1,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: '#a0c0e4',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    marginRight: 8,
    transform: [{ rotate: '45deg' }],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  dividerText: {
    color: '#6c757d',
    marginHorizontal: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#212529',
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
    color: '#6c757d',
  },
  loginLink: {
    fontSize: 15,
    color: '#4a90e2',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 