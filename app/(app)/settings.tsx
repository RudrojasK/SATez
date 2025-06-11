import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State for toggle switches
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d1b2a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} /> {/* Empty view for balanced header */}
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <Section title="Account">
          <SettingsItem 
            icon="person-outline" 
            title="Profile Information"
            subtitle="Edit your personal details"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="mail-outline" 
            title="Email"
            subtitle={user?.email || 'user@example.com'}
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="lock-closed-outline" 
            title="Change Password"
            subtitle="Update your security credentials"
            onPress={() => {}}
            hasChevron
          />
        </Section>
        
        {/* Preferences Section */}
        <Section title="Preferences">
          <SettingsItem 
            icon="notifications-outline" 
            title="Push Notifications"
            isToggle
            toggleValue={notifications}
            onToggleChange={setNotifications}
          />
          <SettingsItem 
            icon="moon-outline" 
            title="Dark Mode"
            isToggle
            toggleValue={darkMode}
            onToggleChange={setDarkMode}
          />
          <SettingsItem 
            icon="alarm-outline" 
            title="Study Reminders"
            isToggle
            toggleValue={studyReminders}
            onToggleChange={setStudyReminders}
          />
          <SettingsItem 
            icon="mail-open-outline" 
            title="Email Updates"
            isToggle
            toggleValue={emailUpdates}
            onToggleChange={setEmailUpdates}
          />
        </Section>
        
        {/* App Settings Section */}
        <Section title="App Settings">
          <SettingsItem 
            icon="language-outline" 
            title="Language"
            subtitle="English"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="save-outline" 
            title="Data Usage"
            subtitle="Manage offline content"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="sync-outline" 
            title="Sync Frequency"
            subtitle="Automatic"
            onPress={() => {}}
            hasChevron
          />
        </Section>
        
        {/* Support Section */}
        <Section title="Support">
          <SettingsItem 
            icon="help-circle-outline" 
            title="Help Center"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="chatbubble-outline" 
            title="Contact Support"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="document-text-outline" 
            title="Terms of Service"
            onPress={() => {}}
            hasChevron
          />
          <SettingsItem 
            icon="shield-outline" 
            title="Privacy Policy"
            onPress={() => {}}
            hasChevron
          />
        </Section>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SATez v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  hasChevron?: boolean;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingsItem = ({ 
  icon, 
  title, 
  subtitle, 
  hasChevron = false,
  isToggle = false,
  toggleValue = false,
  onToggleChange,
  onPress
}: SettingsItemProps) => (
  <TouchableOpacity 
    style={styles.settingsItem}
    onPress={onPress}
    disabled={isToggle}
  >
    <View style={styles.settingsItemIcon}>
      <Ionicons name={icon} size={22} color="#4a4a4a" />
    </View>
    <View style={styles.settingsItemContent}>
      <Text style={styles.settingsItemTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
    </View>
    {isToggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggleChange}
        trackColor={{ false: '#e9ecef', true: '#2962ff' }}
        thumbColor="#ffffff"
      />
    ) : hasChevron ? (
      <Ionicons name="chevron-forward" size={20} color="#c4c4c4" />
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d1b2a',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 3,
  },
  logoutButton: {
    backgroundColor: '#f8d7da',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#adb5bd',
  },
}); 