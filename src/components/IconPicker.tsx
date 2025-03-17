import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  title?: string;
  color?: string;
  iconOptions?: { name: string; value: string }[];
}

const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconSelect,
  title = 'Select Icon',
  color,
  iconOptions: propIcons
}) => {
  const { colors, isDarkMode } = useTheme();
  const iconColor = color || colors.primary;
  
  // Default icons if none are provided
  const defaultIcons = [
    { name: 'Water', value: 'water-outline' },
    { name: 'Fitness', value: 'fitness-outline' },
    { name: 'Book', value: 'book-outline' },
    { name: 'Meditation', value: 'body-outline' },
    { name: 'Coding', value: 'code-slash-outline' },
    { name: 'Food', value: 'restaurant-outline' },
    { name: 'Sleep', value: 'bed-outline' },
    { name: 'Writing', value: 'pencil-outline' },
    { name: 'Music', value: 'musical-notes-outline' },
    { name: 'Walking', value: 'walk-outline' },
    { name: 'Study', value: 'school-outline' },
    { name: 'Medicine', value: 'medical-outline' },
    { name: 'Calendar', value: 'calendar-outline' },
    { name: 'Time', value: 'time-outline' },
    { name: 'Home', value: 'home-outline' },
    { name: 'Heart', value: 'heart-outline' },
  ];
  
  const icons = propIcons || defaultIcons;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.iconsContainer}
      >
        {icons.map((icon) => (
          <TouchableOpacity
            key={icon.value}
            style={[
              styles.iconOption,
              selectedIcon === icon.value && [
                styles.selectedIcon,
                { borderColor: iconColor }
              ],
              { backgroundColor: isDarkMode ? '#2c2c2c' : '#f5f5f5' }
            ]}
            onPress={() => onIconSelect(icon.value)}
            accessibilityLabel={`${icon.name} icon`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedIcon === icon.value }}
          >
            <Ionicons 
              name={icon.value as any} 
              size={24} 
              color={selectedIcon === icon.value ? iconColor : colors.text} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.selectedIconContainer}>
        <View 
          style={[
            styles.selectedIconPreview, 
            { 
              backgroundColor: isDarkMode ? '#2c2c2c' : '#f5f5f5',
              borderColor: iconColor,
            }
          ]}
        >
          <Ionicons 
            name={selectedIcon as any} 
            size={24} 
            color={iconColor} 
          />
        </View>
        <Text style={[styles.selectedIconText, { color: colors.text }]}>
          {icons.find(i => i.value === selectedIcon)?.name || 'Custom Icon'}
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const iconSize = Math.min(60, (width - 96) / 5);

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
  iconsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  iconOption: {
    width: iconSize,
    height: iconSize,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIcon: {
    borderWidth: 2,
  },
  selectedIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  selectedIconPreview: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  selectedIconText: {
    fontSize: 16,
  },
});

export default IconPicker; 