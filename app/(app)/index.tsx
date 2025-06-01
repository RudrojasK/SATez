import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { signOut, user, session, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Debug user data
  useEffect(() => {
    console.log("Home Screen - User data:", user);
    console.log("Home Screen - Session data:", session);
  }, [user, session]);
  
  // Refresh user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setRefreshing(true);
      try {
        await refreshUser();
      } catch (error) {
        console.error("Error refreshing user data:", error);
      } finally {
        setRefreshing(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Format the user's email to get a display name
  useEffect(() => {
    if (user?.email) {
      // Extract name from email (part before @)
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      const formatted = emailName
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setUserName(formatted);
    }
  }, [user]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      // The root layout should handle redirecting to (auth)/login
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Sign Out Error', 'There was a problem signing out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if user data is not available yet
  if (!user || refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E5BFF" />
          <Text style={styles.loadingText}>
            {refreshing ? 'Refreshing user data...' : 'Loading user data...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f7f8fa" barStyle="dark-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.nameText}>{userName || 'User'}</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.userInfoHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.emailText}>{user.email}</Text>
              <Text style={styles.userIdText}>User ID: {user.id?.substring(0, 8) || 'Unknown'}...</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={20} color="#2E5BFF" />
            <Text style={styles.infoText}>
              Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="verified-user" size={20} color="#2E5BFF" />
            <Text style={styles.infoText}>
              Email verified: {user.email_confirmed_at ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={async () => {
              setRefreshing(true);
              try {
                await refreshUser();
                Alert.alert('Success', 'User data refreshed');
              } catch (error) {
                console.error("Error refreshing:", error);
              } finally {
                setRefreshing(false);
              }
            }}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Refresh User Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.signOutButton]} 
            onPress={handleSignOut}
            disabled={loading}
          >
            <MaterialIcons name="logout" size={20} color="#fff" />
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Debug info section */}
        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>Debug Information</Text>
          <Text style={styles.debugText}>User ID: {user.id || 'Not available'}</Text>
          <Text style={styles.debugText}>Email: {user.email || 'Not available'}</Text>
          <Text style={styles.debugText}>Created: {user.created_at || 'Not available'}</Text>
          <Text style={styles.debugText}>Email confirmed: {user.email_confirmed_at ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>Session: {session ? 'Active' : 'Not active'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E5BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 13,
    color: '#888',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#2E5BFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginBottom: 12,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  debugCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ffcc00',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 