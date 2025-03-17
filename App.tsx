import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { HabitProvider } from './src/contexts/HabitContext';
import { 
  View, 
  ActivityIndicator, 
  useColorScheme as _useColorScheme
} from 'react-native';

// Import screens
import Dashboard from './src/screens/Dashboard';
import Analytics from './src/screens/Analytics';
import HabitForm from './src/screens/HabitForm';
import Settings from './src/screens/Settings';
import Profile from './src/screens/Profile';

// Define the type for our tab navigator
type RootTabParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Add: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = _useColorScheme();
  
  useEffect(() => {
    // Simulate loading resources
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <HabitProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = "";

                    if (route.name === 'Dashboard') {
                      iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Analytics') {
                      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Add') {
                      iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Settings') {
                      iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Profile') {
                      iconName = focused ? 'person' : 'person-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#6200ee',
                  tabBarInactiveTintColor: 'gray',
                  headerShown: true,
                })}
              >
                <Tab.Screen name="Dashboard" component={Dashboard} />
                <Tab.Screen name="Analytics" component={Analytics} />
                <Tab.Screen name="Add" component={HabitForm} />
                <Tab.Screen name="Settings" component={Settings} />
                <Tab.Screen name="Profile" component={Profile} />
              </Tab.Navigator>
            </NavigationContainer>
          </HabitProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 