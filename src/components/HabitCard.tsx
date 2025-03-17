import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '../contexts/HabitContext';
import { useHabits } from '../contexts/HabitContext';
import { useTheme } from '../contexts/ThemeContext';
import { isToday, parseISO } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const { completeHabit } = useHabits();
  const { colors, isDarkMode } = useTheme();
  
  // Check if habit is completed today
  const isCompletedToday = habit.completions.some(
    completion => isToday(parseISO(completion.completedAt))
  );

  // Get icon name based on habit's own icon property
  const getIconName = () => {
    switch (habit.icon) {
      case 'water':
        return 'water-outline';
      case 'fitness':
        return 'fitness-outline';
      case 'book':
        return 'book-outline';
      case 'meditate':
        return 'body-outline';
      case 'code':
        return 'code-slash-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  // Handle habit completion
  const handleComplete = async () => {
    if (!isCompletedToday) {
      await completeHabit(habit.id);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderLeftColor: habit.color || colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getIconName()}
            size={24}
            color={habit.color || colors.primary}
          />
        </View>
        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              isCompletedToday && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
          <Text
            style={[
              styles.description,
              { color: isDarkMode ? '#bbbbbb' : '#666666' },
              isCompletedToday && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {habit.description}
          </Text>
          {habit.streak > 0 && (
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={14} color="#ff9800" />
              <Text style={styles.streakText}>{habit.streak} day streak</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.completionButton,
            isCompletedToday && {
              backgroundColor: habit.color || colors.primary,
            },
          ]}
          onPress={handleComplete}
        >
          <Ionicons
            name={isCompletedToday ? 'checkmark' : 'checkmark-outline'}
            size={22}
            color={isCompletedToday ? '#ffffff' : habit.color || colors.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  completedText: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  streakText: {
    fontSize: 12,
    color: '#ff9800',
    marginLeft: 4,
    fontWeight: '500',
  },
  completionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft: 8,
  },
});

export default HabitCard; 