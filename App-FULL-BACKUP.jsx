import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
// Firebase temporarily disabled for build testing
// import analytics from '@react-native-firebase/analytics';
// import crashlytics from '@react-native-firebase/crashlytics';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
// AdMob temporarily disabled for build testing
// import {
//   BannerAd,
//   BannerAdSize,
//   getAdUnitId,
//   initializeAdMob,
//   loadInterstitialAd,
//   showInterstitialAd
// } from './AdMobConfig';

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

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [actionCount, setActionCount] = useState(0);

  // Request notification permissions and initialize ads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Firebase temporarily disabled for build testing
        // await analytics().setAnalyticsCollectionEnabled(true);
        // await crashlytics().setCrashlyticsCollectionEnabled(true);
        // await analytics().logEvent('app_open', {
        //   platform: Platform.OS,
        //   version: Constants.expoConfig?.version || '1.0.0',
        // });
      } catch (error) {
        console.log('Analytics initialization error:', error);
      }
    };

    initializeApp();
    requestPermissions();
    loadTasks();
    // AdMob temporarily disabled
    // initializeAdMob();
    // loadInterstitialAd();

    // Cleanup function
    return () => {
      // Cancel all notifications when app unmounts
    };
  }, []);

  // Show interstitial ad every 5 actions
  // useEffect(() => {
  //   if (actionCount > 0 && actionCount % 5 === 0) {
  //     showInterstitialAd();
  //   }
  // }, [actionCount]);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Enable notifications to receive reminders for your stop-list items.'
      );
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Recreate Animated.Value for each task
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
      // Remove animated values before saving
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
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setActionCount(prev => prev + 1);

      // Firebase temporarily disabled for build testing
      // analytics().logEvent('task_created', {
      //   task_length: newTask.trim().length,
      // }).catch(() => { });
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
  };

  const handleGestureEvent = (task) => {
    return Animated.event(
      [{ nativeEvent: { translationX: task.translateX } }],
      { useNativeDriver: true }
    );
  };

  const handleGestureEnd = ({ nativeEvent }, task) => {
    if (Math.abs(nativeEvent.translationX) > 100) {
      deleteTask(task.id);
    } else {
      Animated.spring(task.translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const openReminderModal = (taskId) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task?.reminderDate) {
      setReminderDate(new Date(task.reminderDate));
      setTempDate(new Date(task.reminderDate));
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      setReminderDate(defaultDate);
      setTempDate(defaultDate);
    }
    setShowReminderModal(true);
  };

  const scheduleReminder = async () => {
    try {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (!task) return;

      // Cancel existing notification if any
      if (task.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      }

      // Schedule new notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⛔ Stop Reminder",
          body: `Remember: DON'T ${task.text}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: reminderDate,
        },
      });

      // Update task with reminder info
      setTasks(tasks.map(t =>
        t.id === selectedTaskId
          ? { ...t, reminderDate: reminderDate.toISOString(), notificationId }
          : t
      ));

      setShowReminderModal(false);
      Alert.alert('✓ Reminder Set', `You'll be reminded at ${formatDateTime(reminderDate)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to set reminder. Please try again.');
      console.error('Failed to schedule notification:', error);
    }
  };

  const removeReminder = async () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      setTasks(tasks.map(t =>
        t.id === selectedTaskId
          ? { ...t, reminderDate: null, notificationId: null }
          : t
      ));
      setShowReminderModal(false);
      Alert.alert('✓ Reminder Removed');
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

  const renderTask = ({ item }) => {
    const symbol = item.completed ? '✓' : '⛔';
    const hasReminder = !!item.reminderDate;

    return (
      <View style={styles.taskContainer}>
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
              🔔 {formatDateTime(item.reminderDate)}
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
      </View>
    );
  };

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
          <Text style={styles.subtitle}>Things you shouldn't do</Text>
        </View>

        <View style={styles.inputContainer}>
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

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>⛔</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first stop-item{'\n'}
              Remind yourself what NOT to do
            </Text>
          </View>
        )}

        {/* Modern Reminder Modal */}
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

        {/* Banner Ad temporarily disabled */}
        <View style={styles.bannerAdContainer}>
          {/* <BannerAd
            unitId={getAdUnitId('banner')}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
          /> */}
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
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
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
    backgroundColor: '#1a1a1a',
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
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
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
    backgroundColor: '#ff3b30',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  listContent: {
    paddingBottom: 100,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
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
    color: '#666',
  },
  reminderBadge: {
    fontSize: 11,
    color: '#ff9500',
    marginTop: 6,
    marginLeft: 32,
    fontWeight: '600',
  },
  alarmButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  alarmButtonText: {
    fontSize: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 80,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    minHeight: 400,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#3a3a3a',
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
    color: '#666',
    marginBottom: 30,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  dateTimeLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  dateTimeValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
    backgroundColor: '#ff3b30',
  },
  removeButton: {
    backgroundColor: '#ff9500',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#666',
  },
  bannerAdContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 10,
    color: '#444',
    paddingVertical: 4,
  },
});
