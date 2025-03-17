import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useHabits, Habit, HabitFrequency } from '../contexts/HabitContext';
import { useTheme } from '../contexts/ThemeContext';
import ColorPicker from '../components/ColorPicker';
import IconPicker from '../components/IconPicker';
import WeekdayPicker from '../components/WeekdayPicker';
import TimePicker from '../components/TimePicker';

// Define types for the route params
type HabitFormParams = {
  habitId?: string;
};

const HabitForm = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, HabitFormParams>, string>>();
  const { colors, isDarkMode } = useTheme();
  const { addHabit, updateHabit, getHabitById } = useHabits();
  
  // Get habit ID from route params (if editing an existing habit)
  const habitId = route.params?.habitId;
  const existingHabit = habitId ? getHabitById(habitId) : undefined;
  const isEditMode = !!existingHabit;
  
  // Form state
  const [name, setName] = useState(existingHabit?.name || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [frequency, setFrequency] = useState<HabitFrequency>(existingHabit?.frequency || 'daily');
  const [color, setColor] = useState(existingHabit?.color || '#6200ee');
  const [icon, setIcon] = useState(existingHabit?.icon || 'checkmark-circle-outline');
  const [customDays, setCustomDays] = useState<number[]>(existingHabit?.customDays || [1, 3, 5]);
  const [hasReminder, setHasReminder] = useState(existingHabit?.reminders?.length ? true : false);
  const [reminderTime, setReminderTime] = useState(existingHabit?.reminders?.[0]?.time || '09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a habit name');
        return;
      }

      // Validate custom days
      if (frequency === 'custom' && customDays.length === 0) {
        Alert.alert('Error', 'Please select at least one day for custom frequency');
        return;
      }

      // Prepare reminder data
      const reminders = hasReminder
        ? [
            {
              id: existingHabit?.reminders?.[0]?.id || Date.now().toString(),
              habitId: existingHabit?.id || '',
              time: reminderTime,
              days: frequency === 'custom' ? customDays : [0, 1, 2, 3, 4, 5, 6],
              enabled: true,
            },
          ]
        : [];

      // Prepare habit data
      const habitData = {
        name: name.trim(),
        description: description.trim(),
        frequency,
        color,
        icon,
        customDays: frequency === 'custom' ? customDays : undefined,
        reminders,
      };

      if (isEditMode && existingHabit) {
        // Update existing habit
        await updateHabit(existingHabit.id, habitData);
        Alert.alert('Success', 'Habit updated successfully');
      } else {
        // Add new habit
        await addHabit(habitData);
        Alert.alert('Success', 'Habit added successfully');
      }

      // Navigate back to dashboard
      navigation.navigate('Dashboard' as never);
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', 'Failed to save habit. Please try again.');
    }
  };

  // Format time string for display (e.g. "09:00" to "09:00 AM")
  const formatTimeForDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditMode ? 'Edit Habit' : 'Create New Habit'}
      </Text>

      {/* Habit Name */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
              color: colors.text,
              borderColor: isDarkMode ? '#333333' : '#e0e0e0',
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter habit name"
          placeholderTextColor={isDarkMode ? '#888888' : '#aaaaaa'}
        />
      </View>

      {/* Habit Description */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
              color: colors.text,
              borderColor: isDarkMode ? '#333333' : '#e0e0e0',
            },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter habit description"
          placeholderTextColor={isDarkMode ? '#888888' : '#aaaaaa'}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Frequency Section */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
        <View style={styles.frequencyOptions}>
          {['daily', 'weekly', 'monthly', 'custom'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.frequencyOption,
                frequency === option && {
                  backgroundColor: color,
                  borderColor: color,
                },
              ]}
              onPress={() => setFrequency(option as HabitFrequency)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === option && styles.frequencyTextSelected,
                ]}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Days Selection */}
        {frequency === 'custom' && (
          <WeekdayPicker
            selectedDays={customDays}
            onDaySelect={setCustomDays}
            title="Select Days"
            dayLabels={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
          />
        )}
      </View>

      {/* Color Selection */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Color</Text>
        <ColorPicker 
          selectedColor={color} 
          onColorSelect={setColor}
          title="Choose Habit Color" 
        />
      </View>

      {/* Icon Selection */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
        <IconPicker 
          selectedIcon={icon} 
          onIconSelect={setIcon}
          title="Choose Habit Icon"
          color={color}
        />
      </View>

      {/* Reminder Toggle */}
      <View style={styles.inputGroup}>
        <View style={styles.reminderHeader}>
          <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
          <Switch
            value={hasReminder}
            onValueChange={setHasReminder}
            trackColor={{ false: '#e0e0e0', true: `${color}80` }}
            thumbColor={hasReminder ? color : '#f5f5f5'}
          />
        </View>

        {hasReminder && (
          <View
            style={[
              styles.reminderTimeContainer,
              {
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                borderColor: isDarkMode ? '#333333' : '#e0e0e0',
              },
            ]}
          >
            <Ionicons name="time-outline" size={22} color={color} />
            <Text style={[styles.reminderTimeText, { color: colors.text }]}>
              {formatTimeForDisplay(reminderTime)}
            </Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={[styles.changeTimeText, { color: color }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: color }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {isEditMode ? 'Update Habit' : 'Create Habit'}
        </Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelButtonText, { color: colors.text }]}>
          Cancel
        </Text>
      </TouchableOpacity>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <TimePicker
          initialTime={reminderTime}
          onConfirm={(time) => {
            setReminderTime(time);
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  frequencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frequencyText: {
    color: '#666666',
  },
  frequencyTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  reminderTimeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  changeTimeText: {
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
  },
});

export default HabitForm; 