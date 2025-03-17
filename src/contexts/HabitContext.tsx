import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { firestore } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { formatISO, parseISO, isToday, startOfDay, isWithinInterval, subDays } from 'date-fns';

// Define habit types
export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface HabitReminder {
  id: string;
  habitId: string;
  time: string; // Time in 24-hour format: HH:MM
  days: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  enabled: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string; // ISO date string
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  customDays?: number[]; // For custom frequency
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  color: string;
  icon: string;
  reminders: HabitReminder[];
  streak: number;
  completions: HabitCompletion[];
}

// Define habit context interface
interface HabitContextType {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'streak' | 'completions'>) => Promise<Habit>;
  updateHabit: (id: string, habitData: Partial<Habit>) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (id: string) => Promise<void>;
  getTodayCompletedHabits: () => Habit[];
  getTodayHabits: () => Habit[];
  getWeeklyStats: () => { completed: number; total: number; percentage: number };
  getHabitById: (id: string) => Habit | undefined;
}

// Create habit context with default values
const HabitContext = createContext<HabitContextType>({
  habits: [],
  isLoading: true,
  addHabit: async () => ({ 
    id: '', 
    userId: '', 
    name: '', 
    description: '', 
    frequency: 'daily', 
    createdAt: '', 
    updatedAt: '', 
    color: '', 
    icon: '',
    reminders: [],
    streak: 0,
    completions: [] 
  }),
  updateHabit: async () => ({ 
    id: '', 
    userId: '', 
    name: '', 
    description: '', 
    frequency: 'daily', 
    createdAt: '', 
    updatedAt: '', 
    color: '', 
    icon: '',
    reminders: [],
    streak: 0,
    completions: [] 
  }),
  deleteHabit: async () => {},
  completeHabit: async () => {},
  getTodayCompletedHabits: () => [],
  getTodayHabits: () => [],
  getWeeklyStats: () => ({ completed: 0, total: 0, percentage: 0 }),
  getHabitById: () => undefined,
});

// Habit provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load habits from storage on user change
  useEffect(() => {
    const loadHabits = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          setHabits([]);
          return;
        }

        // In a real app, this would fetch habits from Firestore
        // For now, we'll load from AsyncStorage
        const savedHabits = await AsyncStorage.getItem(`habits-${user.id}`);
        
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        } else {
          // Create demo habits for new users
          const demoHabits: Habit[] = [
            {
              id: '1',
              userId: user.id,
              name: 'Drink Water',
              description: 'Drink at least 8 glasses of water per day',
              frequency: 'daily',
              createdAt: formatISO(new Date()),
              updatedAt: formatISO(new Date()),
              color: '#2196f3',
              icon: 'water',
              reminders: [
                {
                  id: '1',
                  habitId: '1',
                  time: '10:00',
                  days: [1, 2, 3, 4, 5, 6, 0],
                  enabled: true,
                }
              ],
              streak: 0,
              completions: []
            },
            {
              id: '2',
              userId: user.id,
              name: 'Exercise',
              description: 'Go for a run or do a workout for at least 30 minutes',
              frequency: 'weekly',
              customDays: [1, 3, 5], // Monday, Wednesday, Friday
              createdAt: formatISO(new Date()),
              updatedAt: formatISO(new Date()),
              color: '#4caf50',
              icon: 'fitness',
              reminders: [
                {
                  id: '2',
                  habitId: '2',
                  time: '18:00',
                  days: [1, 3, 5],
                  enabled: true,
                }
              ],
              streak: 0,
              completions: []
            }
          ];
          
          setHabits(demoHabits);
          await AsyncStorage.setItem(`habits-${user.id}`, JSON.stringify(demoHabits));
        }
      } catch (error) {
        console.error('Failed to load habits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, [user]);

  // Save habits to storage when they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        if (user && habits.length > 0) {
          await AsyncStorage.setItem(`habits-${user.id}`, JSON.stringify(habits));
        }
      } catch (error) {
        console.error('Failed to save habits:', error);
      }
    };

    saveHabits();
  }, [habits, user]);

  // Add a new habit
  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'streak' | 'completions'>) => {
    try {
      if (!user) {
        throw new Error('User not signed in');
      }

      const now = formatISO(new Date());
      
      // Create a new habit
      const newHabit: Habit = {
        id: Date.now().toString(), // Generate a temporary ID
        userId: user.id,
        createdAt: now,
        updatedAt: now,
        streak: 0,
        completions: [],
        ...habitData,
      };
      
      // Add to state
      setHabits(prevHabits => [...prevHabits, newHabit]);
      
      return newHabit;
    } catch (error) {
      console.error('Add habit error:', error);
      throw error;
    }
  };

  // Update an existing habit
  const updateHabit = async (id: string, habitData: Partial<Habit>) => {
    try {
      if (!user) {
        throw new Error('User not signed in');
      }
      
      // Find the habit to update
      const habitIndex = habits.findIndex(h => h.id === id);
      
      if (habitIndex === -1) {
        throw new Error('Habit not found');
      }
      
      // Update the habit
      const updatedHabit: Habit = {
        ...habits[habitIndex],
        ...habitData,
        updatedAt: formatISO(new Date()),
      };
      
      // Update state
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = updatedHabit;
      setHabits(updatedHabits);
      
      return updatedHabit;
    } catch (error) {
      console.error('Update habit error:', error);
      throw error;
    }
  };

  // Delete a habit
  const deleteHabit = async (id: string) => {
    try {
      if (!user) {
        throw new Error('User not signed in');
      }
      
      // Remove from state
      setHabits(prevHabits => prevHabits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Delete habit error:', error);
      throw error;
    }
  };

  // Mark a habit as completed
  const completeHabit = async (id: string) => {
    try {
      if (!user) {
        throw new Error('User not signed in');
      }
      
      // Find the habit to complete
      const habitIndex = habits.findIndex(h => h.id === id);
      
      if (habitIndex === -1) {
        throw new Error('Habit not found');
      }
      
      const habit = habits[habitIndex];
      const now = new Date();
      const todayStr = formatISO(now);
      
      // Check if habit was already completed today
      const completedToday = habit.completions.some(
        c => isToday(parseISO(c.completedAt))
      );
      
      if (completedToday) {
        return; // Already completed today
      }
      
      // Calculate new streak
      let newStreak = habit.streak;
      
      // If the last completion was yesterday, increase streak
      const lastCompletion = habit.completions[habit.completions.length - 1];
      if (lastCompletion) {
        const lastCompletionDate = parseISO(lastCompletion.completedAt);
        const yesterday = subDays(now, 1);
        
        if (
          isToday(lastCompletionDate) || 
          isWithinInterval(lastCompletionDate, {
            start: startOfDay(yesterday),
            end: now
          })
        ) {
          newStreak += 1;
        } else {
          // Streak broken, reset to 1
          newStreak = 1;
        }
      } else {
        // First completion, set streak to 1
        newStreak = 1;
      }
      
      // Add new completion
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(), // Generate a temporary ID
        habitId: id,
        completedAt: todayStr,
      };
      
      // Update the habit
      const updatedHabit: Habit = {
        ...habit,
        streak: newStreak,
        completions: [...habit.completions, newCompletion],
        updatedAt: todayStr,
      };
      
      // Update state
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = updatedHabit;
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Complete habit error:', error);
      throw error;
    }
  };

  // Get today's completed habits
  const getTodayCompletedHabits = () => {
    return habits.filter(habit => 
      habit.completions.some(c => isToday(parseISO(c.completedAt)))
    );
  };

  // Get all habits for today
  const getTodayHabits = () => {
    const today = new Date().getDay();
    
    return habits.filter(habit => {
      if (habit.frequency === 'daily') {
        return true;
      }
      
      if (habit.frequency === 'weekly' && today === 1) { // Monday
        return true;
      }
      
      if (habit.frequency === 'monthly' && new Date().getDate() === 1) { // First day of month
        return true;
      }
      
      if (habit.frequency === 'custom' && habit.customDays?.includes(today)) {
        return true;
      }
      
      return false;
    });
  };

  // Get weekly stats
  const getWeeklyStats = () => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    
    // Count completed habits in the last 7 days
    let completed = 0;
    let total = 0;
    
    habits.forEach(habit => {
      habit.completions.forEach(completion => {
        const completionDate = parseISO(completion.completedAt);
        if (completionDate >= sevenDaysAgo && completionDate <= now) {
          completed += 1;
        }
      });
      
      // Count total expected completions in last 7 days
      // This is simplified and would need a more sophisticated calculation
      // based on habit frequency in a real app
      if (habit.frequency === 'daily') {
        total += 7;
      } else if (habit.frequency === 'weekly') {
        total += 1;
      } else if (habit.frequency === 'custom' && habit.customDays) {
        // Count number of days in the last week that match custom days
        let customTotal = 0;
        for (let i = 0; i < 7; i++) {
          const day = (now.getDay() - i + 7) % 7;
          if (habit.customDays.includes(day)) {
            customTotal += 1;
          }
        }
        total += customTotal;
      }
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Get a habit by ID
  const getHabitById = (id: string) => {
    return habits.find(h => h.id === id);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        getTodayCompletedHabits,
        getTodayHabits,
        getWeeklyStats,
        getHabitById,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use habits
export const useHabits = () => useContext(HabitContext); 