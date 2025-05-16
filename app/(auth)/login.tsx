import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { signInWithEmail, signUpWithEmail, isLoading } = useAuth();
  const router = useRouter();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (!isLogin) {
      if (!confirmPassword) {
        setConfirmPasswordError('Please confirm your password');
        return false;
      } else if (confirmPassword !== password) {
        setConfirmPasswordError('Passwords do not match');
        return false;
      } else {
        setConfirmPasswordError('');
        return true;
      }
    }
    return true;
  };

  const handleSignIn = async () => {
    if (validateEmail() && validatePassword()) {
      try {
        await signInWithEmail(email, password);
        // Navigation to main app will be handled by root layout based on auth state
      } catch (error: any) {
        Alert.alert('Sign In Error', error.message);
      }
    }
  };

  const handleSignUp = async () => {
    if (validateEmail() && validatePassword() && validateConfirmPassword()) {
      try {
        await signUpWithEmail(email, password);
        Alert.alert('Sign Up Successful', 'Your account has been created successfully. You can now login.');
        setIsLogin(true);
      } catch (error: any) {
        Alert.alert('Sign Up Error', error.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (isLogin) {
      await handleSignIn();
    } else {
      await handleSignUp();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Login to access your account' 
                : 'Sign up to get started with our app'}
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={validateConfirmPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                  />
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </>
            )}
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.switchModeContainer}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={() => {
                setIsLogin(!isLogin);
                setEmailError('');
                setPasswordError('');
                setConfirmPasswordError('');
              }}>
                <Text style={styles.switchLink}>
                  {isLogin ? "Sign Up" : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E5BFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 15,
    marginTop: -10,
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#2E5BFF',
    borderRadius: 12,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: '#2E5BFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  switchLink: {
    color: '#2E5BFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 