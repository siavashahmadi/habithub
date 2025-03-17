import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const navigation = useNavigation();
  const { user, updateProfile, signOut } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    // If user is not signed in, show sign in prompt
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.signInPrompt}>
          <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
          <Text style={[styles.promptTitle, { color: colors.text }]}>
            Sign in to manage your profile
          </Text>
          <Text
            style={[
              styles.promptDescription,
              { color: isDarkMode ? '#bbbbbb' : '#666666' },
            ]}
          >
            Create an account to sync your habits across devices and never lose your progress.
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Navigate to sign in screen
            }}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.signUpButton,
              { borderColor: colors.primary },
            ]}
            onPress={() => {
              // Navigate to sign up screen
            }}
          >
            <Text style={[styles.signUpButtonText, { color: colors.primary }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      
      if (displayName.trim() === '') {
        Alert.alert('Error', 'Display name cannot be empty');
        return;
      }
      
      await updateProfile({
        displayName: displayName.trim(),
      });
      
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.profileImage,
            { backgroundColor: colors.primary },
          ]}
        >
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarInitial}>
              {user.displayName?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
            </Text>
          )}
        </View>
        
        {editing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
                  color: colors.text,
                  borderColor: isDarkMode ? '#333333' : '#e0e0e0',
                },
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display Name"
              placeholderTextColor={isDarkMode ? '#888888' : '#aaaaaa'}
              autoFocus
            />
            <View style={styles.editButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.editActionButton,
                  {
                    backgroundColor: colors.error,
                  },
                ]}
                onPress={() => {
                  setDisplayName(user?.displayName || '');
                  setEditing(false);
                }}
              >
                <Text style={styles.editActionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editActionButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                <Text style={styles.editActionButtonText}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user.displayName || 'User'}
            </Text>
            <Text
              style={[
                styles.profileEmail,
                { color: isDarkMode ? '#bbbbbb' : '#666666' },
              ]}
            >
              {user.email}
            </Text>
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="pencil" size={16} color="#ffffff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? '#bbbbbb' : '#666666' },
              ]}
            >
              Total Habits
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' },
            ]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? '#bbbbbb' : '#666666' },
              ]}
            >
              Completed
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: isDarkMode ? '#333333' : '#e0e0e0' },
            ]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
            <Text
              style={[
                styles.statLabel,
                { color: isDarkMode ? '#bbbbbb' : '#666666' },
              ]}
            >
              Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Account Options */}
      <View style={styles.accountOptions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account Options
        </Text>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            { borderColor: isDarkMode ? '#333333' : '#e0e0e0' },
          ]}
          onPress={() => {
            // Navigate to change password screen
          }}
        >
          <Ionicons name="key-outline" size={22} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Change Password
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isDarkMode ? '#666666' : '#999999'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            { borderColor: isDarkMode ? '#333333' : '#e0e0e0' },
          ]}
        >
          <Ionicons name="cloud-download-outline" size={22} color={colors.primary} />
          <Text style={[styles.optionText, { color: colors.text }]}>
            Export Data
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isDarkMode ? '#666666' : '#999999'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            { borderColor: isDarkMode ? '#333333' : '#e0e0e0' },
          ]}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Handle account deletion
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={22} color={colors.error} />
          <Text style={[styles.optionText, { color: colors.error }]}>
            Delete Account
          </Text>
          <View />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            { borderColor: isDarkMode ? '#333333' : '#e0e0e0' },
          ]}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.optionText, { color: colors.error }]}>
            Sign Out
          </Text>
          <View />
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
  editNameContainer: {
    width: '100%',
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  editButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editActionButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  accountOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
  signInPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  promptDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  signInButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile; 