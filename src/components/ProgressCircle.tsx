import React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Create Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  percentage: number;
  color: string;
  size: number;
  strokeWidth: number;
  progressValue?: Animated.Value;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  color,
  size,
  strokeWidth,
  progressValue,
}) => {
  // Calculate values for SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const half = size / 2;

  // Use animated value if provided, otherwise calculate based on percentage
  const strokeDashoffset = progressValue
    ? progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
      })
    : circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          stroke="#E6E6E6"
          fill="none"
          cx={half}
          cy={half}
          r={radius}
          strokeWidth={strokeWidth / 2}
        />
        {/* Progress circle */}
        {progressValue ? (
          <AnimatedCircle
            stroke={color}
            fill="none"
            cx={half}
            cy={half}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${half}, ${half}`}
          />
        ) : (
          <Circle
            stroke={color}
            fill="none"
            cx={half}
            cy={half}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            rotation="-90"
            origin={`${half}, ${half}`}
          />
        )}
      </Svg>
      {/* Display percentage text in the center */}
      <View style={[styles.percentageContainer, { width: size, height: size }]}>
        <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProgressCircle; 