import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useHabits } from '../contexts/HabitContext';
import { useTheme } from '../contexts/ThemeContext';
import { Habit } from '../contexts/HabitContext';
import HabitCard from '../components/HabitCard';
import ProgressCircle from '../components/ProgressCircle';

const Dashboard = () => {
  const { habits, isLoading, getTodayHabits, getTodayCompletedHabits, getWeeklyStats } = useHabits();
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState({ completed: 0, total: 0, percentage: 0 });
  const progressValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!isLoading) {
      const todayHabitsList = getTodayHabits();
      setTodayHabits(todayHabitsList);
      setStats(getWeeklyStats());

      // Animate the progress circle
      Animated.timing(progressValue, {
        toValue: getWeeklyStats().percentage / 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isLoading, habits]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTodayHabits(getTodayHabits());
    setStats(getWeeklyStats());
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Weekly Stats Section */}
      <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}>
        <Text style={[styles.statsTitle, { color: colors.text }]}>Weekly Progress</Text>
        <View style={styles.statsContent}>
          <ProgressCircle
            percentage={stats.percentage}
            color={colors.primary}
            size={100}
            strokeWidth={10}
            progressValue={progressValue}
          />
          <View style={styles.statsDetails}>
            <Text style={[styles.statsPercentage, { color: colors.text }]}>
              {stats.percentage}%
            </Text>
            <Text style={[styles.statsSubtitle, { color: colors.text }]}>
              {stats.completed}/{stats.total} tasks
            </Text>
          </View>
        </View>
      </View>

      {/* Today's Habits Section */}
      <View style={styles.todayContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Habits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Add' as never)}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {todayHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.primary} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No habits scheduled for today
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Add' as never)}
            >
              <Text style={styles.addButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={todayHabits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onPress={() => {
                  // Navigate to habit details
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.habitsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          />
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsDetails: {
    flex: 1,
    alignItems: 'center',
  },
  statsPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  todayContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  habitsList: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Dashboard; 