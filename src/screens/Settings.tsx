import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeType, AccentColorType } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationSettings, { NotificationPreferences } from '../components/NotificationSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const { theme, setTheme, isDarkMode, accentColor, setAccentColor, colors } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationPreferences>({
    enabled: false,
    dailyReminder: true,
    dailyReminderTime: "20:00",
    weeklyReport: true,
    weeklyReportDay: 0, // Sunday
  });

  // Load notification settings on component mount
  React.useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('notificationSettings');
        if (savedSettings) {
          setNotificationSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    };

    loadNotificationSettings();
  }, []);

  // Theme options
  const themeOptions: { label: string; value: ThemeType }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  // Accent color options
  const accentColors: { label: string; value: AccentColorType; hex: string }[] = [
    { label: 'Purple', value: 'purple', hex: '#6200ee' },
    { label: 'Blue', value: 'blue', hex: '#2196f3' },
    { label: 'Green', value: 'green', hex: '#4caf50' },
    { label: 'Orange', value: 'orange', hex: '#ff9800' },
    { label: 'Pink', value: 'pink', hex: '#e91e63' },
  ];

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  // Save notification settings
  const handleSaveNotificationSettings = async (settings: NotificationPreferences) => {
    try {
      setNotificationSettings(settings);
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        {user ? (
          <>
            <View style={styles.profileInfo}>
              <View
                style={[
                  styles.profileInitial,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.initialText}>
                  {user.displayName?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {user.displayName || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: isDarkMode ? '#bbbbbb' : '#666666' }]}>
                  {user.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.optionButton, { borderColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
              onPress={() => {
                // Navigate to profile screen or show edit profile modal
              }}
            >
              <Ionicons name="person-outline" size={22} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                Edit Profile
              </Text>
              <Ionicons name="chevron-forward" size={22} color={isDarkMode ? '#666666' : '#999999'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { borderColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.error} />
              <Text style={[styles.optionText, { color: colors.error }]}>
                Sign Out
              </Text>
              <View />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => {
              // Navigate to sign in screen
            }}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>

        {/* Theme Selection */}
        <View style={styles.settingGroup}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Theme
          </Text>
          <View style={styles.themeButtons}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeButton,
                  theme === option.value && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setTheme(option.value)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    theme === option.value && styles.activeThemeText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accent Color Selection */}
        <View style={styles.settingGroup}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Accent Color
          </Text>
          <View style={styles.colorOptions}>
            {accentColors.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: option.hex },
                  accentColor === option.value && styles.colorOptionSelected,
                ]}
                onPress={() => setAccentColor(option.value)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <NotificationSettings 
          onSave={handleSaveNotificationSettings}
          initialSettings={notificationSettings}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About
        </Text>
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
        >
          <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            About HabitHub
          </Text>
          <Ionicons name="chevron-forward" size={22} color={isDarkMode ? '#666666' : '#999999'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: isDarkMode ? '#333333' : '#e0e0e0' }]}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <Ionicons name="chevron-forward" size={22} color={isDarkMode ? '#666666' : '#999999'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: 'transparent' }]}
        >
          <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Terms of Service
          </Text>
          <Ionicons name="chevron-forward" size={22} color={isDarkMode ? '#666666' : '#999999'} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: isDarkMode ? '#666666' : '#999999' }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitial: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDetails: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  signInButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  themeButtonText: {
    color: '#666666',
  },
  activeThemeText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  version: {
    fontSize: 14,
  },
});

export default Settings; 