import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const CustomDateTimePicker = ({ isVisible, onClose, onConfirm, initialDate, mode = 'date' }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const handleMonthChange = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const handleDaySelect = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (type, value) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }
    setSelectedDate(newDate);
  };

  const renderDatePicker = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const currentDay = selectedDate.getDate();

    return (
      <View style={styles.datePickerContainer}>
        {/* Month/Year Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.arrowButton}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.arrowButton}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => handleDaySelect(day)}
              style={[
                styles.dayButton,
                day === currentDay && styles.selectedDay,
              ]}
            >
              <Text style={[
                styles.dayText,
                day === currentDay && styles.selectedDayText,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderTimePicker = () => {
    const currentHour = selectedDate.getHours();
    const currentMinute = selectedDate.getMinutes();

    return (
      <View style={styles.timePickerContainer}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Hour</Text>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                onPress={() => handleTimeChange('hour', hour)}
                style={[
                  styles.timeButton,
                  hour === currentHour && styles.selectedTime,
                ]}
              >
                <Text style={[
                  styles.timeText,
                  hour === currentHour && styles.selectedTimeText,
                ]}>
                  {hour.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.timeSeparator}>:</Text>

        <View style={styles.timeColumn}>
          <Text style={styles.timeLabel}>Minute</Text>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                onPress={() => handleTimeChange('minute', minute)}
                style={[
                  styles.timeButton,
                  minute === currentMinute && styles.selectedTime,
                ]}
              >
                <Text style={[
                  styles.timeText,
                  minute === currentMinute && styles.selectedTimeText,
                ]}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.7}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>
          {mode === 'date' ? '📅 Select Date' : '⏰ Select Time'}
        </Text>

        {mode === 'date' ? renderDatePicker() : renderTimePicker()}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    minHeight: 450,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#3a3a5e',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  datePickerContainer: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  arrowButton: {
    padding: 12,
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
  },
  arrowText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  dayButton: {
    width: (width - 80) / 7,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: '#ff6b6b',
  },
  dayText: {
    color: '#8b8b9f',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b8b9f',
    marginBottom: 12,
  },
  timeScroll: {
    maxHeight: 250,
    width: '100%',
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 4,
    backgroundColor: '#2a2a4e',
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#ff6b6b',
  },
  timeText: {
    color: '#8b8b9f',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: '700',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginHorizontal: 16,
    marginTop: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3a3a5e',
  },
  confirmButton: {
    backgroundColor: '#ff6b6b',
  },
  cancelButtonText: {
    color: '#8b8b9f',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomDateTimePicker;

