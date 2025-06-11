import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

export default function AdminToolsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  
  const runProfileFieldsMigration = async () => {
    setIsLoading(true);
    
    try {
      // Try to add each column separately to handle cases where some already exist
      let messages = [];
      
      try {
        const { error: schoolError } = await supabase.rpc('execute_sql', {
          query: 'ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS school TEXT;'
        });
        
        if (schoolError) {
          messages.push(`School column error: ${schoolError.message}`);
        } else {
          messages.push('School column added successfully');
        }
      } catch (error: any) {
        messages.push(`School column error: ${error?.message || 'Unknown error'}`);
      }
      
      try {
        const { error: gradeError } = await supabase.rpc('execute_sql', {
          query: 'ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grade INTEGER;'
        });
        
        if (gradeError) {
          messages.push(`Grade column error: ${gradeError.message}`);
        } else {
          messages.push('Grade column added successfully');
        }
      } catch (error: any) {
        messages.push(`Grade column error: ${error?.message || 'Unknown error'}`);
      }
      
      try {
        const { error: scoreError } = await supabase.rpc('execute_sql', {
          query: 'ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_score INTEGER;'
        });
        
        if (scoreError) {
          messages.push(`Target score column error: ${scoreError.message}`);
        } else {
          messages.push('Target score column added successfully');
        }
      } catch (error: any) {
        messages.push(`Target score column error: ${error?.message || 'Unknown error'}`);
      }
      
      Alert.alert(
        'Migration Results',
        messages.join('\n\n'),
        [
          { 
            text: 'OK', 
            onPress: () => {
              // If any were successful, show success message
              if (messages.some(msg => msg.includes('successfully'))) {
                Alert.alert(
                  'Migration Partially Successful',
                  'Some columns were added successfully. You may need to follow the manual instructions in README-database-update.md for the remaining columns.',
                  [{ text: 'OK' }]
                );
              }
            } 
          }
        ]
      );
    } catch (error: any) {
      console.error('Migration error:', error);
      
      Alert.alert(
        'Migration Failed',
        `An error occurred while running the migration: ${error?.message || 'Unknown error'}. You may need to run the SQL manually. Please check README-database-update.md for instructions.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkTableStructure = async () => {
    setIsLoading(true);
    
    try {
      // Attempt to query one record with these fields to check if they exist
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, email, school, grade, target_score')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST204') {
          // Column doesn't exist error
          Alert.alert(
            'Schema Check Failed',
            'One or more columns are missing from the user_profiles table. Please run the complete setup to fix this issue.',
            [{ text: 'OK' }]
          );
        } else {
          throw error;
        }
      } else {
        Alert.alert(
          'Schema Check Successful',
          'All required columns exist in the user_profiles table.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Schema check error:', error);
      
      Alert.alert(
        'Schema Check Failed',
        `An error occurred while checking the table structure: ${error?.message || 'Unknown error'}. Please run the complete setup to ensure all tables and columns exist.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const runCompleteSetup = async () => {
    setIsTableLoading(true);
    
    try {
      // This is a comprehensive setup that creates or repairs the entire user_profiles table
      const setupQuery = `
      -- First check if the user_profiles table exists, if not create it
      CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          name TEXT,
          avatar_url TEXT,
          school TEXT,
          grade INTEGER,
          target_score INTEGER,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
      );

      -- Add any missing columns that might not exist in the table
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS name TEXT;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS school TEXT;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grade INTEGER;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_score INTEGER;
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
      `;

      // Execute the setup query
      const { error: setupError } = await supabase.rpc('execute_sql', {
        query: setupQuery
      });
      
      if (setupError) {
        throw setupError;
      }
      
      // Check if the setup was successful by querying the table
      const { error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (checkError) {
        throw checkError;
      }
      
      Alert.alert(
        'Setup Successful',
        'The user_profiles table has been successfully created or updated with all required columns.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Complete setup error:', error);
      
      Alert.alert(
        'Setup Failed',
        `An error occurred during the complete setup: ${error?.message || 'Unknown error'}. You may need to run the SQL manually using the Supabase dashboard.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsTableLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d1b2a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Tools</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Setup & Migrations</Text>
          <Text style={styles.sectionDescription}>
            Use these tools to update your database schema to support new features.
            Only use these tools if you have admin access to the database.
          </Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="construct-outline" size={24} color="#0d1b2a" />
              <Text style={styles.cardTitle}>Complete Database Setup</Text>
            </View>
            <Text style={styles.cardDescription}>
              This will create or repair the user_profiles table with all required columns.
              Use this if you're getting errors about missing tables or columns.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.checkButton]}
                onPress={checkTableStructure}
                disabled={isLoading || isTableLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Check Schema</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.setupButton]}
                onPress={runCompleteSetup}
                disabled={isLoading || isTableLoading}
              >
                {isTableLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Run Setup</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.card, {marginTop: 20}]}>
            <View style={styles.cardHeader}>
              <Ionicons name="add-circle-outline" size={24} color="#0d1b2a" />
              <Text style={styles.cardTitle}>Profile Fields Migration</Text>
            </View>
            <Text style={styles.cardDescription}>
              This migration adds the school, grade, and target_score fields to the user_profiles table.
              Only use this if the table exists but is missing specific columns.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.runButton]}
                onPress={runProfileFieldsMigration}
                disabled={isLoading || isTableLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Run Migration</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Note: These tools are intended for development purposes only.
            For production environments, please follow the instructions in README-database-update.md.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d1b2a',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d1b2a',
    marginLeft: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButton: {
    backgroundColor: '#6c757d',
    marginRight: 8,
  },
  runButton: {
    backgroundColor: '#2962ff',
    flex: 1,
  },
  setupButton: {
    backgroundColor: '#198754',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimerContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 18,
  },
}); 