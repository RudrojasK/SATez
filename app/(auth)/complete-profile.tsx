import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CompleteProfileScreen() {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();
  
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // If user already has these fields filled, redirect to home
    if (user?.school && user?.grade && user?.target_score) {
      router.replace('/');
    }
    
    // Pre-fill any existing data
    if (user?.school) setSchool(user.school);
    if (user?.grade) setGrade(user.grade.toString());
    if (user?.target_score) setTargetScore(user.target_score.toString());
  }, [user]);
  
  const handleSubmit = async () => {
    if (!school) {
      Alert.alert('Missing Information', 'Please enter your school name.');
      return;
    }
    
    // Validate grade
    const gradeNum = parseInt(grade, 10);
    if (isNaN(gradeNum) || gradeNum < 9 || gradeNum > 12) {
      Alert.alert('Invalid Grade', 'Please enter a valid grade (9-12).');
      return;
    }
    
    // Validate target score
    const scoreNum = parseInt(targetScore, 10);
    if (isNaN(scoreNum) || scoreNum < 400 || scoreNum > 1600) {
      Alert.alert('Invalid Target Score', 'Please enter a valid SAT score (400-1600).');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await updateProfile({
        school,
        grade: gradeNum,
        target_score: scoreNum
      });
      
      // Redirect to home screen
      router.replace('/');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update your profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2962ff" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Please provide some additional information to personalize your experience.
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>School Name</Text>
            <TextInput
              style={styles.input}
              value={school}
              onChangeText={setSchool}
              placeholder="Enter your school name"
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade Level</Text>
            <TextInput
              style={styles.input}
              value={grade}
              onChangeText={setGrade}
              placeholder="Enter your grade (9-12)"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target SAT Score</Text>
            <TextInput
              style={styles.input}
              value={targetScore}
              onChangeText={setTargetScore}
              placeholder="Enter your target score (400-1600)"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Complete Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#2962ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 