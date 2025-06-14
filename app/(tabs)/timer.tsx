import { useAuth } from '@/app/context/AuthContext';
import { COLORS, SHADOWS, SIZES } from '@/constants/Colors';
import { studySessionsService } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface StudySession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  subject: string;
  notes: string;
  date: string;
}

type TimerState = 'stopped' | 'running' | 'paused';

export default function TimerScreen() {
  const { user } = useAuth();
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerState === 'running' && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000) + pausedTime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, startTime, pausedTime]);

  const loadSessions = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const dbSessions = await studySessionsService.getSessions(user.id);
      // Convert database sessions to app format
      const appSessions: StudySession[] = dbSessions.map(session => ({
        id: session.id,
        startTime: new Date(session.start_time).getTime(),
        endTime: new Date(session.end_time).getTime(),
        duration: session.duration,
        subject: session.subject,
        notes: session.notes,
        date: new Date(session.created_at).toLocaleDateString(),
      }));
      setSessions(appSessions);
    } catch (error) {
      console.error('Failed to load study sessions:', error);
      Alert.alert('Error', 'Failed to load study sessions');
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (sessionData: {
    startTime: number;
    endTime: number;
    duration: number;
    subject: string;
    notes: string;
  }) => {
    if (!user?.id) return null;
    
    try {
      const savedSession = await studySessionsService.saveSession(user.id, sessionData);
      if (savedSession) {
        // Convert to app format and add to local state
        const appSession: StudySession = {
          id: savedSession.id,
          startTime: new Date(savedSession.start_time).getTime(),
          endTime: new Date(savedSession.end_time).getTime(),
          duration: savedSession.duration,
          subject: savedSession.subject,
          notes: savedSession.notes,
          date: new Date(savedSession.created_at).toLocaleDateString(),
        };
        setSessions(prev => [appSession, ...prev]);
        return appSession;
      }
      return null;
    } catch (error) {
      console.error('Failed to save study sessions:', error);
      Alert.alert('Error', 'Failed to save study session');
      return null;
    }
  };

  const startTimer = () => {
    if (timerState === 'stopped') {
      setStartTime(Date.now());
      setElapsedTime(0);
      setPausedTime(0);
    } else if (timerState === 'paused') {
      setStartTime(Date.now());
    }
    setTimerState('running');
  };

  const pauseTimer = () => {
    if (timerState === 'running') {
      setPausedTime(elapsedTime);
      setTimerState('paused');
    }
  };

  const stopTimer = async () => {
    if (timerState !== 'stopped' && elapsedTime > 0) {
      const sessionData = {
        startTime: startTime! - (pausedTime * 1000),
        endTime: Date.now(),
        duration: elapsedTime,
        subject: subject.trim() || 'General Study',
        notes: notes.trim(),
      };
      
      const savedSession = await saveSession(sessionData);
      
      if (savedSession) {
        Alert.alert(
          'Session Saved!',
          `Study session of ${formatTime(elapsedTime)} has been logged.`,
          [{ text: 'OK' }]
        );
      }
    }
    
    setTimerState('stopped');
    setElapsedTime(0);
    setStartTime(null);
    setPausedTime(0);
    setSubject('');
    setNotes('');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteSession = (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this study session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await studySessionsService.deleteSession(sessionId);
              if (success) {
                setSessions(prev => prev.filter(s => s.id !== sessionId));
              } else {
                Alert.alert('Error', 'Failed to delete study session');
              }
            } catch (error) {
              console.error('Error deleting session:', error);
              Alert.alert('Error', 'Failed to delete study session');
            }
          },
        },
      ]
    );
  };

  const getTotalStudyTime = (): string => {
    const total = sessions.reduce((sum, session) => sum + session.duration, 0);
    return formatTime(total);
  };

  // Show loading or login required state
  if (!user?.id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={48} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Please log in to use the study timer</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderSession = ({ item }: { item: StudySession }) => (
    <View style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionSubject}>{item.subject}</Text>
        <Text style={styles.sessionDuration}>{formatTime(item.duration)}</Text>
      </View>
      <Text style={styles.sessionDate}>{item.date}</Text>
      {item.notes && (
        <Text style={styles.sessionNotes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteSession(item.id)}
      >
        <Ionicons name="trash-outline" size={16} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Timer</Text>
        <TouchableOpacity
          style={styles.logsButton}
          onPress={() => setShowLogs(true)}
        >
          <Ionicons name="list-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.timerState}>
            {timerState === 'running' ? 'Running' : 
             timerState === 'paused' ? 'Paused' : 'Stopped'}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          {timerState === 'stopped' && (
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Ionicons name="play" size={32} color="#FFF" />
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          
          {timerState === 'running' && (
            <>
              <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                <Ionicons name="pause" size={32} color="#FFF" />
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <Ionicons name="stop" size={32} color="#FFF" />
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
            </>
          )}
          
          {timerState === 'paused' && (
            <>
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <Ionicons name="play" size={32} color="#FFF" />
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <Ionicons name="stop" size={32} color="#FFF" />
                <Text style={styles.buttonText}>Stop</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.subjectInput}
          placeholder="What are you studying? (e.g., Math, Reading)"
          placeholderTextColor={COLORS.textLight}
          value={subject}
          onChangeText={setSubject}
          editable={timerState === 'stopped'}
        />
        
        <TouchableOpacity
          style={styles.notesButton}
          onPress={() => setShowNotes(true)}
        >
          <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
          <Text style={styles.notesButtonText}>
            {notes ? 'Edit Notes' : 'Add Notes'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Today's Progress</Text>
        <Text style={styles.statsText}>
          Total Study Time: {getTotalStudyTime()}
        </Text>
        <Text style={styles.statsText}>
          Sessions Completed: {sessions.filter(s => s.date === new Date().toLocaleDateString()).length}
        </Text>
      </View>

      {/* Study Logs Modal */}
      <Modal visible={showLogs} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Study Logs</Text>
            <TouchableOpacity onPress={() => setShowLogs(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          {sessions.length === 0 ? (
            loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.emptyText}>Loading study sessions...</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>No study sessions yet</Text>
                <Text style={styles.emptySubtext}>Start your first study session!</Text>
              </View>
            )
          ) : (
            <FlatList
              data={sessions}
              renderItem={renderSession}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.sessionsList}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Notes Modal */}
      <Modal visible={showNotes} animationType="slide" transparent={true}>
        <View style={styles.notesModalOverlay}>
          <View style={styles.notesModal}>
            <View style={styles.notesModalHeader}>
              <Text style={styles.notesModalTitle}>Session Notes</Text>
              <TouchableOpacity onPress={() => setShowNotes(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about your study session..."
              placeholderTextColor={COLORS.textLight}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={styles.saveNotesButton}
              onPress={() => setShowNotes(false)}
            >
              <Text style={styles.saveNotesText}>Save Notes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logsButton: {
    padding: 8,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  timerState: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  startButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    minWidth: 100,
    ...SHADOWS.medium,
  },
  pauseButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    minWidth: 100,
    ...SHADOWS.medium,
  },
  stopButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    minWidth: 100,
    ...SHADOWS.medium,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  inputContainer: {
    padding: SIZES.padding,
    gap: 12,
  },
  subjectInput: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  notesButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  statsContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.card,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
  sessionsList: {
    padding: SIZES.padding,
  },
  sessionItem: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    ...SHADOWS.small,
    position: 'relative',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sessionDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  sessionNotes: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  notesModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesModal: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: '90%',
    maxHeight: '70%',
  },
  notesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  notesInput: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: SIZES.radius,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
    marginBottom: 16,
  },
  saveNotesButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  saveNotesText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 