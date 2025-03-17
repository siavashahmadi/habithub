import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface WeekdayPickerProps {
  selectedDays: number[];
  onDaySelect: (days: number[]) => void;
  title?: string;
  dayLabels?: string[];
}

const WeekdayPicker: React.FC<WeekdayPickerProps> = ({
  selectedDays,
  onDaySelect,
  title = 'Select Days',
  dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}) => {
  const { colors, isDarkMode } = useTheme();

  // Toggle a day selection
  const toggleDay = (day: number) => {
    const newSelectedDays = [...selectedDays];
    
    if (newSelectedDays.includes(day)) {
      // Remove day if already selected
      const index = newSelectedDays.indexOf(day);
      newSelectedDays.splice(index, 1);
    } else {
      // Add day if not selected
      newSelectedDays.push(day);
    }
    
    onDaySelect(newSelectedDays);
  };

  // Select all days
  const selectAllDays = () => {
    onDaySelect([0, 1, 2, 3, 4, 5, 6]);
  };

  // Clear all selected days
  const clearSelection = () => {
    onDaySelect([]);
  };

  // Select weekdays only (Monday-Friday)
  const selectWeekdays = () => {
    onDaySelect([1, 2, 3, 4, 5]);
  };

  // Select weekends only (Saturday-Sunday)
  const selectWeekends = () => {
    onDaySelect([0, 6]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      )}
      
      <View style={styles.daysContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) 
                ? { backgroundColor: colors.primary } 
                : { 
                    backgroundColor: 'transparent',
                    borderColor: isDarkMode ? '#444' : '#ddd'
                  }
            ]}
            onPress={() => toggleDay(day)}
            accessibilityLabel={`Day ${day}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedDays.includes(day) }}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day)
                  ? { color: '#fff' }
                  : { color: colors.text }
              ]}
            >
              {dayLabels[day]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.presetButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.presetButton,
            { borderColor: isDarkMode ? '#444' : '#ddd' }
          ]}
          onPress={selectAllDays}
        >
          <Text style={{ color: colors.primary }}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.presetButton,
            { borderColor: isDarkMode ? '#444' : '#ddd' }
          ]}
          onPress={selectWeekdays}
        >
          <Text style={{ color: colors.primary }}>Weekdays</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.presetButton,
            { borderColor: isDarkMode ? '#444' : '#ddd' }
          ]}
          onPress={selectWeekends}
        >
          <Text style={{ color: colors.primary }}>Weekends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.presetButton,
            { borderColor: isDarkMode ? '#444' : '#ddd' }
          ]}
          onPress={clearSelection}
        >
          <Text style={{ color: colors.error }}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  presetButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WeekdayPicker; 