import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="person-outline" size={24} color="#555" />
                <Text style={styles.settingText}>Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={24} color="#555" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon-outline" size={24} color="#555" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="language-outline" size={24} color="#555" />
                <Text style={styles.settingText}>Language</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="help-circle-outline" size={24} color="#555" />
                <Text style={styles.settingText}>Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle-outline" size={24} color="#555" />
                <Text style={styles.settingText}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 