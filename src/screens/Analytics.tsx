import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '../contexts/HabitContext';
import { useTheme } from '../contexts/ThemeContext';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { subDays, format, parseISO } from 'date-fns';

const Analytics = () => {
  const { habits, getWeeklyStats } = useHabits();
  const { colors, isDarkMode } = useTheme();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
    streaks: [] as number[],
    maxStreak: 0,
    totalCompleted: 0,
  });
  
  // Calculate stats when habits change
  useEffect(() => {
    if (habits.length > 0) {
      // Get weekly stats from context
      const weeklyStats = getWeeklyStats();
      
      // Calculate streaks
      const streaks = habits.map(habit => habit.streak);
      const maxStreak = Math.max(...streaks, 0);
      
      // Calculate total completed 
      let totalCompleted = 0;
      habits.forEach(habit => {
        totalCompleted += habit.completions.length;
      });
      
      setStats({
        ...weeklyStats,
        streaks,
        maxStreak,
        totalCompleted,
      });
    }
  }, [habits, getWeeklyStats]);

  // Generate dates for the chart (last 7 days for week, or 30 days for month)
  const generateDates = () => {
    const today = new Date();
    const days = period === 'week' ? 7 : 30;
    const dates = [];
    
    for (let i = days - 1; i >= 0; i--) {
      dates.push(format(subDays(today, i), 'MM/dd'));
    }
    
    return dates;
  };

  // Calculate completion data for each day in the period
  const calculateCompletionData = () => {
    const today = new Date();
    const days = period === 'week' ? 7 : 30;
    const data = new Array(days).fill(0);
    
    habits.forEach(habit => {
      habit.completions.forEach(completion => {
        const completionDate = parseISO(completion.completedAt);
        const daysAgo = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysAgo < days) {
          data[days - 1 - daysAgo]++;
        }
      });
    });
    
    return data;
  };

  // Prepare data for Line Chart
  const lineChartData = {
    labels: generateDates(),
    datasets: [
      {
        data: calculateCompletionData(),
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
    legend: ['Completed Habits'],
  };

  // Prepare data for Bar Chart
  const barChartData = {
    labels: generateDates(),
    datasets: [
      {
        data: calculateCompletionData(),
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundGradientTo: isDarkMode ? '#1a1a1a' : '#ffffff',
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  // Get screen width for chart
  const screenWidth = Dimensions.get('window').width - 32;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Weekly Completion"
          value={`${stats.percentage}%`}
          icon="checkmark-circle"
          color={colors.primary}
          isDarkMode={isDarkMode}
          textColor={colors.text}
        />
        <StatCard
          title="Longest Streak"
          value={stats.maxStreak.toString()}
          icon="flame"
          color="#ff9800"
          isDarkMode={isDarkMode}
          textColor={colors.text}
        />
        <StatCard
          title="Active Habits"
          value={habits.length.toString()}
          icon="list"
          color="#4caf50"
          isDarkMode={isDarkMode}
          textColor={colors.text}
        />
        <StatCard
          title="Total Completed"
          value={stats.totalCompleted.toString()}
          icon="trophy"
          color="#f44336"
          isDarkMode={isDarkMode}
          textColor={colors.text}
        />
      </View>

      {/* Chart Controls */}
      <View style={styles.chartControls}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              chartType === 'line' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setChartType('line')}
          >
            <Text
              style={{
                color: chartType === 'line' ? '#ffffff' : colors.text,
              }}
            >
              Line
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              chartType === 'bar' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setChartType('bar')}
          >
            <Text
              style={{
                color: chartType === 'bar' ? '#ffffff' : colors.text,
              }}
            >
              Bar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              period === 'week' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setPeriod('week')}
          >
            <Text
              style={{
                color: period === 'week' ? '#ffffff' : colors.text,
              }}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              period === 'month' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setPeriod('month')}
          >
            <Text
              style={{
                color: period === 'month' ? '#ffffff' : colors.text,
              }}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart */}
      <View
        style={[
          styles.chartContainer,
          { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
        ]}
      >
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Habit Completion History
        </Text>
        {chartType === 'line' ? (
          <LineChart
            data={lineChartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            fromZero
          />
        ) : (
          <BarChart
            data={barChartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        )}
      </View>

      {/* Habits Table */}
      {habits.length > 0 && (
        <View
          style={[
            styles.habitsTableContainer,
            { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
          ]}
        >
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Habit Performance
          </Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { color: colors.text, flex: 3 }]}>
              Habit
            </Text>
            <Text style={[styles.headerText, { color: colors.text, flex: 1 }]}>
              Streak
            </Text>
            <Text style={[styles.headerText, { color: colors.text, flex: 1 }]}>
              Total
            </Text>
          </View>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.tableRow}>
              <View style={[styles.habitNameCell, { flex: 3 }]}>
                <View
                  style={[
                    styles.habitColorDot,
                    { backgroundColor: habit.color || colors.primary },
                  ]}
                />
                <Text
                  style={[styles.habitNameText, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {habit.name}
                </Text>
              </View>
              <View style={[styles.habitCell, { flex: 1 }]}>
                <Text style={{ color: colors.text }}>{habit.streak}</Text>
              </View>
              <View style={[styles.habitCell, { flex: 1 }]}>
                <Text style={{ color: colors.text }}>
                  {habit.completions.length}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  isDarkMode: boolean;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  isDarkMode,
  textColor,
}) => {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
      ]}
    >
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: textColor }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  chartControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  habitsTableContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
  habitNameCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  habitNameText: {
    flex: 1,
  },
  habitCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Analytics; 