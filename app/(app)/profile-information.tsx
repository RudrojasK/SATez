import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../context/AuthContext';

export default function ProfileInformationScreen() {
  const router = useRouter();
  const { user, refreshUser, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasDbError, setHasDbError] = useState(false);
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (user) {
      // Split name into first and last if available
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setSchool(user.school || '');
      setGrade(user.grade?.toString() || '');
      setTargetScore(user.target_score?.toString() || '');
      setAvatarUrl(user.avatar || null);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  // Track changes to profile fields
  useEffect(() => {
    if (!user) return;

    const nameParts = user.name ? user.name.split(' ') : ['', ''];
    const currentFirstName = nameParts[0] || '';
    const currentLastName = nameParts.slice(1).join(' ') || '';
    const currentSchool = user.school || '';
    const currentGrade = user.grade?.toString() || '';
    const currentTargetScore = user.target_score?.toString() || '';

    const hasChanges = 
      firstName !== currentFirstName ||
      lastName !== currentLastName ||
      school !== currentSchool ||
      grade !== currentGrade ||
      targetScore !== currentTargetScore;

    setChangesMade(hasChanges);
  }, [firstName, lastName, school, grade, targetScore, user]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile photo.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        await uploadAvatar(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      
      // Read the file
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Create a unique file path for the avatar
      const filePath = `avatars/${user.id}-${Date.now()}.jpg`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, fileContent, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      // Update the user's profile with the new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      
      // Update local state
      setAvatarUrl(publicUrl);
      
      // Refresh user data
      await refreshUser();
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Upload Failed', 'Failed to upload profile photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setHasDbError(false);
    setDbErrorMessage('');
    
    try {
      // Prepare data to update
      const profileData = {
        name: `${firstName} ${lastName}`.trim(),
        school: school.trim(),
        grade: grade ? parseInt(grade, 10) : undefined,
        target_score: targetScore ? parseInt(targetScore, 10) : undefined
      };
      
      // Update profile using AuthContext
      await updateProfile(profileData);
      
      // Reset change tracking
      setChangesMade(false);
      
      Alert.alert(
        'Success', 
        'Profile information updated successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Check if this is a schema error
      if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
        setHasDbError(true);
        setDbErrorMessage('Database schema issue: Table or column does not exist');
        Alert.alert(
          'Database Error', 
          'There was an issue with the database structure. Please contact support.'
        );
      } else {
        Alert.alert(
          'Error', 
          'Failed to update profile information. Please try again later.'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0d1b2a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Information</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {hasDbError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#fff" />
            <Text style={styles.errorText}>
              Database setup issue detected. Please contact support.
            </Text>
          </View>
        )}
        
        <ScrollView style={styles.container}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="small" color="#4a90e2" />
                </View>
              ) : (
                <Image 
                  source={{ uri: avatarUrl || 'https://i.imgur.com/8a5mJ2s.png' }} 
                  style={styles.avatar} 
                  onError={() => setAvatarUrl(null)}
                />
              )}
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={pickImage}
                disabled={isUploading}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                />
              </View>
              
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, { color: '#6c757d' }]}
                value={email}
                editable={false}
                placeholder="Email address"
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Education</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>School</Text>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={setSchool}
                placeholder="Enter your school name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Grade</Text>
              <TextInput
                style={styles.input}
                value={grade}
                onChangeText={setGrade}
                placeholder="Enter your grade"
                keyboardType="number-pad"
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>SAT Goals</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Target Score</Text>
              <TextInput
                style={styles.input}
                value={targetScore}
                onChangeText={setTargetScore}
                placeholder="Enter your target SAT score"
                keyboardType="number-pad"
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              !changesMade && styles.saveButtonDisabled,
              isSaving && styles.saveButtonLoading
            ]} 
            onPress={handleSave}
            disabled={isSaving || !changesMade}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d1b2a',
  },
  errorBanner: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fde4cf',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  uploadingContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d1b2a',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#0d1b2a',
  },
  helperText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0c0e4',
  },
  saveButtonLoading: {
    backgroundColor: '#3a80d2',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 