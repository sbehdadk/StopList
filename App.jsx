import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Add a task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          translateX: new Animated.Value(0), // Unique animated value for each task
        },
      ]);
      setNewTask('');
    }
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle pan gesture events for each task
  const handleGestureEvent = (task) => {
    return Animated.event(
      [{ nativeEvent: { translationX: task.translateX } }],
      { useNativeDriver: true }
    );
  };

  const handleGestureEnd = ({ nativeEvent }, task) => {
    if (Math.abs(nativeEvent.translationX) > 100) {
      // Delete task if swiped beyond threshold
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    } else {
      // Reset swipe position
      Animated.spring(task.translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  // Render individual task
  const renderTask = ({ item }) => {
    const symbol = item.completed ? '✓' : '-'; // Completed or default symbol

    return (
      <PanGestureHandler
        onGestureEvent={handleGestureEvent(item)}
        onEnded={(event) => handleGestureEnd(event, item)}
      >
        <Animated.View
          style={[
            styles.taskContainer,
            { transform: [{ translateX: item.translateX }] },
          ]}
        >
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedTask,
              ]}
            >
              {`${symbol} ${item.text}`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>To-Do List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a task..."
            placeholderTextColor="#888"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  taskText: {
    fontSize: 20,
    color: '#fff',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
