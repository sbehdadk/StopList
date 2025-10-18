import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@stoplist_tasks';
const SUPPORT_EMAIL = 'sinova.stoplist@gmail.com';
const SWIPE_THRESHOLD = 120;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [actionCount, setActionCount] = useState(0);
  const [repeatFrequency, setRepeatFrequency] = useState('none'); // none, daily, weekly, monthly, yearly

  // Request notification permissions and initialize
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Firebase Analytics
        if (analytics) {
          await analytics().setAnalyticsCollectionEnabled(true);
          await analytics().logEvent('app_open', {
            platform: Platform.OS,
            version: Constants.expoConfig?.version || '1.0.0',
          });
        }

        // Initialize Firebase Crashlytics
        if (crashlytics) {
          await crashlytics().setCrashlyticsCollectionEnabled(true);
        }
      } catch (error) {
        console.log('Firebase initialization skipped:', error.message);
        // Non-critical - app continues without Firebase
      }
    };

    initializeApp();
    requestPermissions();
    loadTasks();

    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      showToast('Enable notifications to receive reminders');
    }
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // iOS fallback - could use a library like react-native-toast-message
      Alert.alert('', message);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithAnimation = parsedTasks.map(task => ({
          ...task,
          translateX: new Animated.Value(0),
        }));
        setTasks(tasksWithAnimation);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      const tasksToSave = tasks.map(({ translateX, ...task }) => task);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        translateX: new Animated.Value(0),
        reminderDate: null,
        notificationId: null,
        repeatFrequency: 'none',
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setActionCount(prev => prev + 1);

      // Log analytics (non-critical)
      try {
        if (analytics) {
          analytics().logEvent('task_created', {
            task_length: newTask.trim().length,
          }).catch(() => { });
        }
      } catch (error) {
        // Silently fail - analytics not critical
      }
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
    }
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    setActionCount(prev => prev + 1);
    showToast('Task removed');
  };

  const openReminderModal = (taskId) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task?.reminderDate) {
      setReminderDate(new Date(task.reminderDate));
      setTempDate(new Date(task.reminderDate));
      setRepeatFrequency(task.repeatFrequency || 'none');
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      setReminderDate(defaultDate);
      setTempDate(defaultDate);
      setRepeatFrequency('none');
    }
    setShowReminderModal(true);
  };

  const scheduleReminder = async () => {
    try {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (!task) return;

      if (task.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      }

      const trigger = repeatFrequency === 'none'
        ? { date: reminderDate }
        : {
          repeats: true,
          ...(repeatFrequency === 'daily' && { hour: reminderDate.getHours(), minute: reminderDate.getMinutes() }),
          ...(repeatFrequency === 'weekly' && { weekday: reminderDate.getDay() + 1, hour: reminderDate.getHours(), minute: reminderDate.getMinutes() }),
          ...(repeatFrequency === 'monthly' && { day: reminderDate.getDate(), hour: reminderDate.getHours(), minute: reminderDate.getMinutes() }),
          ...(repeatFrequency === 'yearly' && { month: reminderDate.getMonth() + 1, day: reminderDate.getDate(), hour: reminderDate.getHours(), minute: reminderDate.getMinutes() })
        };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⛔ Stop Reminder",
          body: `Remember: DON'T ${task.text}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      setTasks(tasks.map(t =>
        t.id === selectedTaskId
          ? { ...t, reminderDate: reminderDate.toISOString(), notificationId, repeatFrequency }
          : t
      ));

      setShowReminderModal(false);
      const repeatText = repeatFrequency !== 'none' ? ` (${repeatFrequency})` : '';
      showToast(`✓ Reminder set${repeatText}`);
    } catch (error) {
      showToast('Failed to set reminder');
      console.error('Failed to schedule notification:', error);
    }
  };

  const removeReminder = async () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      setTasks(tasks.map(t =>
        t.id === selectedTaskId
          ? { ...t, reminderDate: null, notificationId: null, repeatFrequency: 'none' }
          : t
      ));
      setShowReminderModal(false);
      showToast('✓ Reminder removed');
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent('StopList Bug Report');
    const body = encodeURIComponent(
      `App Version: ${Constants.expoConfig?.version || '1.0.0'}\n` +
      `Platform: ${Platform.OS}\n` +
      `Device: ${Platform.Version}\n\n` +
      `Describe the bug:\n\n\n` +
      `Steps to reproduce:\n1. \n2. \n3. \n\n` +
      `Expected behavior:\n\n\n` +
      `Actual behavior:\n\n`
    );
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(tempDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setTempDate(newDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(tempDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setTempDate(newDate);
      setReminderDate(newDate);
    }
  };

  const TaskItem = ({ item }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          pan.setValue({ x: gestureState.dx, y: 0 });
        },
        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
            Animated.timing(pan, {
              toValue: { x: gestureState.dx > 0 ? 500 : -500, y: 0 },
              duration: 200,
              useNativeDriver: true,
            }).start(() => deleteTask(item.id));
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    const symbol = item.completed ? '✓' : '⛔';
    const hasReminder = !!item.reminderDate;
    const repeatBadge = item.repeatFrequency && item.repeatFrequency !== 'none' ? ` • ${item.repeatFrequency}` : '';

    return (
      <Animated.View
        style={[
          styles.taskContainer,
          { transform: [{ translateX: pan.x }] }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => toggleTask(item.id)}
          style={styles.taskContent}
        >
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskSymbol}>{symbol}</Text>
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedTask,
              ]}
              numberOfLines={3}
            >
              {item.text}
            </Text>
          </View>
          {hasReminder && (
            <Text style={styles.reminderBadge}>
              🔔 {formatDateTime(item.reminderDate)}{repeatBadge}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openReminderModal(item.id)}
          style={styles.alarmButton}
        >
          <Text style={styles.alarmButtonText}>
            {hasReminder ? '🔔' : '⏰'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Show splash screen first (after all hooks)
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>StopList</Text>
            <TouchableOpacity
              onPress={handleReportBug}
              style={styles.bugButton}
            >
              <Text style={styles.bugButtonText}>🐛</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>What you shouldn't do today</Text>
          <Text style={styles.motivationalQuote}>
            💪 "The best time to stop was yesterday. The next best time is now."
          </Text>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TaskItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>⛔</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first stop-item{'\n'}
                Remind yourself what NOT to do
              </Text>
              <Text style={styles.suggestionTitle}>💡 Common things to stop:</Text>
              <Text style={styles.suggestionText}>
                • Checking social media first thing{'\n'}
                • Eating late at night{'\n'}
                • Procrastinating important tasks{'\n'}
                • Negative self-talk{'\n'}
                • Hitting snooze
              </Text>
            </View>
          }
        />

        {/* Input at bottom */}
        <View style={styles.inputContainerBottom}>
          <View style={styles.inputWrapper}>
            <Text style={styles.stopSymbol}>⛔</Text>
            <TextInput
              style={styles.input}
              placeholder="What should you stop doing?"
              placeholderTextColor="#666"
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={addTask}
              multiline={false}
            />
          </View>
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Modal */}
        <Modal
          isVisible={showReminderModal}
          onBackdropPress={() => setShowReminderModal(false)}
          onSwipeComplete={() => setShowReminderModal(false)}
          swipeDirection="down"
          style={styles.modal}
          backdropOpacity={0.7}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Set Reminder</Text>
            <Text style={styles.modalSubtitle}>
              Get notified when you might forget
            </Text>

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>📅 Date</Text>
                <Text style={styles.dateTimeValue}>
                  {tempDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeLabel}>⏰ Time</Text>
                <Text style={styles.dateTimeValue}>
                  {tempDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Repeat Frequency Selector */}
            <Text style={styles.repeatLabel}>🔁 Repeat</Text>
            <View style={styles.repeatContainer}>
              {['none', 'daily', 'weekly', 'monthly'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.repeatButton,
                    repeatFrequency === freq && styles.repeatButtonActive
                  ]}
                  onPress={() => setRepeatFrequency(freq)}
                >
                  <Text style={[
                    styles.repeatButtonText,
                    repeatFrequency === freq && styles.repeatButtonTextActive
                  ]}>
                    {freq === 'none' ? 'Once' : freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
                textColor="#ffffff"
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
                textColor="#ffffff"
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={scheduleReminder}
              >
                <Text style={styles.modalButtonText}>Set Reminder</Text>
              </TouchableOpacity>

              {tasks.find(t => t.id === selectedTaskId)?.reminderDate && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.removeButton]}
                  onPress={removeReminder}
                >
                  <Text style={styles.modalButtonText}>Remove</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReminderModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* AdMob placeholder - add when monetization is needed */}
        <View style={styles.bannerAdContainer}>
          <Text style={styles.versionText}>
            v{Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  bugButton: {
    padding: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bugButtonText: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b8b9f',
    marginTop: 4,
    fontStyle: 'italic',
  },
  motivationalQuote: {
    fontSize: 12,
    color: '#6d6d7f',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    paddingBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  stopSymbol: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#ff6b6b',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginBottom: 4,
  },
  taskSymbol: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#666',
    opacity: 0.6,
  },
  reminderBadge: {
    fontSize: 11,
    color: '#ffa500',
    marginTop: 6,
    marginLeft: 32,
    fontWeight: '600',
  },
  alarmButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a4e',
  },
  alarmButtonText: {
    fontSize: 22,
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
  },
  deleteButtonText: {
    fontSize: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 80,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#8b8b9f',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  suggestionTitle: {
    fontSize: 14,
    color: '#ffa500',
    fontWeight: '700',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 13,
    color: '#6d6d7f',
    textAlign: 'left',
    lineHeight: 22,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    minHeight: 450,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#3a3a5e',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8b8b9f',
    marginBottom: 30,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#2a2a4e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3a3a5e',
  },
  dateTimeLabel: {
    fontSize: 13,
    color: '#8b8b9f',
    marginBottom: 8,
    fontWeight: '600',
  },
  dateTimeValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  repeatLabel: {
    fontSize: 14,
    color: '#8b8b9f',
    fontWeight: '600',
    marginBottom: 12,
  },
  repeatContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  repeatButton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a5e',
  },
  repeatButtonActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  repeatButtonText: {
    color: '#8b8b9f',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  repeatButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff6b6b',
  },
  removeButton: {
    backgroundColor: '#ffa500',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3a3a5e',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#8b8b9f',
  },
  bannerAdContainer: {
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#444',
    paddingVertical: 4,
  },
});
