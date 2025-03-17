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

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  title?: string;
  colors?: { name: string; hex: string }[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  title = 'Select Color',
  colors: propColors
}) => {
  const { colors: themeColors, isDarkMode } = useTheme();
  
  // Default colors if none are provided
  const defaultColors = [
    { name: 'Purple', hex: '#6200ee' },
    { name: 'Blue', hex: '#2196f3' },
    { name: 'Green', hex: '#4caf50' },
    { name: 'Red', hex: '#f44336' },
    { name: 'Orange', hex: '#ff9800' },
    { name: 'Pink', hex: '#e91e63' },
    { name: 'Teal', hex: '#009688' },
    { name: 'Indigo', hex: '#3f51b5' },
    { name: 'Cyan', hex: '#00bcd4' },
    { name: 'Yellow', hex: '#ffeb3b' },
    { name: 'Amber', hex: '#ffc107' },
    { name: 'Brown', hex: '#795548' },
  ];
  
  const colorOptions = propColors || defaultColors;
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      {title && (
        <Text style={[styles.title, { color: themeColors.text }]}>
          {title}
        </Text>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorContainer}
      >
        {colorOptions.map((color) => (
          <TouchableOpacity
            key={color.hex}
            style={[
              styles.colorOption,
              { backgroundColor: color.hex },
              selectedColor === color.hex && styles.selectedColor,
              isDarkMode && selectedColor === color.hex && { borderColor: '#ffffff' }
            ]}
            onPress={() => onColorSelect(color.hex)}
            accessibilityLabel={`${color.name} color`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedColor === color.hex }}
          >
            {selectedColor === color.hex && (
              <Ionicons 
                name="checkmark" 
                size={20} 
                color="#ffffff" 
                style={styles.checkIcon} 
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.selectedColorContainer}>
        <View 
          style={[
            styles.selectedColorPreview, 
            { backgroundColor: selectedColor }
          ]}
        />
        <Text style={[styles.selectedColorText, { color: themeColors.text }]}>
          {colorOptions.find(c => c.hex === selectedColor)?.name || 'Custom Color'}
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const colorSize = Math.min(48, (width - 80) / 6);

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
  colorContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  colorOption: {
    width: colorSize,
    height: colorSize,
    borderRadius: colorSize / 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  checkIcon: {
    opacity: 0.9,
  },
  selectedColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  selectedColorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedColorText: {
    fontSize: 16,
  },
});

export default ColorPicker; 