import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../contexts/ThemeContext';
import TimePicker from './TimePicker';

interface NotificationSettingsProps {
  onSave: (settings: NotificationPreferences) => void;
  initialSettings?: NotificationPreferences;
}

export interface NotificationPreferences {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // format: "HH:MM"
  weeklyReport: boolean;
  weeklyReportDay: number; // 0-6 (Sunday-Saturday)
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  onSave, 
  initialSettings 
}) => {
  const { theme, colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [settings, setSettings] = useState<NotificationPreferences>(
    initialSettings || {
      enabled: false,
      dailyReminder: true,
      dailyReminderTime: "20:00",
      weeklyReport: true,
      weeklyReportDay: 0, // Sunday
    }
  );

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status === 'granted') {
      // Enable notifications if permissions are granted
      const updatedSettings = { ...settings, enabled: true };
      setSettings(updatedSettings);
      onSave(updatedSettings);
    }
  };

  const handleToggleNotifications = (value: boolean) => {
    if (value && !hasPermission) {
      requestPermissions();
    } else {
      const updatedSettings = { ...settings, enabled: value };
      setSettings(updatedSettings);
      onSave(updatedSettings);
    }
  };

  const handleToggleSetting = (key: keyof NotificationPreferences, value: boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    onSave(updatedSettings);
  };

  const handleTimeChange = (time: string) => {
    const updatedSettings = { ...settings, dailyReminderTime: time };
    setSettings(updatedSettings);
    onSave(updatedSettings);
    setShowTimePicker(false);
  };

  const handleDayChange = (day: number) => {
    const updatedSettings = { ...settings, weeklyReportDay: day };
    setSettings(updatedSettings);
    onSave(updatedSettings);
  };

  const getDayName = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.mainToggleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <Switch
          value={settings.enabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={Platform.OS === 'ios' ? undefined : colors.background}
        />
      </View>

      {!hasPermission && settings.enabled && (
        <TouchableOpacity 
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestPermissions}
        >
          <Text style={[styles.permissionButtonText, { color: colors.background }]}>
            Grant Notification Permissions
          </Text>
        </TouchableOpacity>
      )}

      {settings.enabled && (
        <>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="time-outline" size={22} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Daily Reminder</Text>
            </View>
            <Switch
              value={settings.dailyReminder}
              onValueChange={(value) => handleToggleSetting('dailyReminder', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.background}
            />
          </View>

          {settings.dailyReminder && (
            <TouchableOpacity 
              style={[styles.timeSelector, { borderColor: colors.border }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.timeText, { color: colors.text }]}>
                Reminder Time: {settings.dailyReminderTime}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          )}

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="calendar-outline" size={22} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Weekly Report</Text>
            </View>
            <Switch
              value={settings.weeklyReport}
              onValueChange={(value) => handleToggleSetting('weeklyReport', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.background}
            />
          </View>

          {settings.weeklyReport && (
            <View style={[styles.daySelector, { borderColor: colors.border }]}>
              <Text style={[styles.dayText, { color: colors.text }]}>
                Report Day: {getDayName(settings.weeklyReportDay)}
              </Text>
              <View style={styles.dayButtons}>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      { 
                        backgroundColor: settings.weeklyReportDay === day 
                          ? colors.primary 
                          : colors.card,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => handleDayChange(day)}
                  >
                    <Text 
                      style={[
                        styles.dayButtonText, 
                        { 
                          color: settings.weeklyReportDay === day 
                            ? colors.background 
                            : colors.text 
                        }
                      ]}
                    >
                      {getDayName(day).charAt(0)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {showTimePicker && (
        <TimePicker
          initialTime={settings.dailyReminderTime}
          onConfirm={handleTimeChange}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  mainToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  permissionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  permissionButtonText: {
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 15,
  },
  daySelector: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  dayText: {
    fontSize: 15,
    marginBottom: 12,
  },
  dayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontWeight: '600',
  },
});

export default NotificationSettings; 