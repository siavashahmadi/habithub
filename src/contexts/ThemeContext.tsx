import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme types
export type ThemeType = 'light' | 'dark' | 'system';
export type AccentColorType = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

// Define theme interface
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
  accentColor: AccentColorType;
  setAccentColor: (color: AccentColorType) => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    success: string;
    warning: string;
    error: string;
  };
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
  accentColor: 'purple',
  setAccentColor: () => {},
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    card: '#f2f2f2',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  },
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [accentColor, setAccentColor] = useState<AccentColorType>('purple');

  // Load saved theme and accent color from storage
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedAccentColor = await AsyncStorage.getItem('accentColor');
        
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
        
        if (savedAccentColor) {
          setAccentColor(savedAccentColor as AccentColorType);
        }
      } catch (error) {
        console.error('Failed to load theme preferences:', error);
      }
    };

    loadThemePreferences();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };

    saveThemePreference();
  }, [theme]);

  // Save accent color preference when it changes
  useEffect(() => {
    const saveAccentColorPreference = async () => {
      try {
        await AsyncStorage.setItem('accentColor', accentColor);
      } catch (error) {
        console.error('Failed to save accent color preference:', error);
      }
    };

    saveAccentColorPreference();
  }, [accentColor]);

  // Determine if dark mode based on theme and system preference
  const isDarkMode = 
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Accent color palette
  const accentColors = {
    purple: '#6200ee',
    blue: '#2196f3',
    green: '#4caf50',
    orange: '#ff9800',
    pink: '#e91e63',
  };

  // Theme colors
  const lightColors = {
    primary: accentColors[accentColor],
    background: '#ffffff',
    card: '#f2f2f2',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };

  const darkColors = {
    primary: accentColors[accentColor],
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#2c2c2c',
    notification: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        accentColor,
        setAccentColor,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext); 