import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

// Placeholder data for the hourly steps chart - reformatted for react-native-chart-kit
const hourlyStepsData = {
  labels: ['6a', '7a', '8a', '9a', '12p', '1p', '3p', '5p'], // X-axis labels
  datasets: [
    {
      data: [300, 800, 1200, 500, 1500, 400, 200, 300], // Y-axis values
    },
  ],
};

// Chart configuration
const screenWidth = Dimensions.get('window').width;
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Blue color for bars/labels
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`, // Gray for labels
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
  barPercentage: 0.6, // Adjust bar width relative to spacing
};

// Placeholder data for current steps and goal
const currentSteps = 5200;
const stepGoal = 8000;
const goalProgress = Math.round((currentSteps / stepGoal) * 100);

const StepsDetailContent = () => {
  return (
    <View style={styles.container}>
      {/* Goal Progress */}
      <View style={styles.goalSection}>
        <Text style={styles.goalText}>
          Goal: {stepGoal.toLocaleString()} steps
        </Text>
        <Text style={styles.progressText}>
          Progress: {currentSteps.toLocaleString()} steps ({goalProgress}%)
        </Text>
        {/* You could add a progress bar here */}
      </View>

      {/* Hourly Chart */}
      <Text style={styles.chartTitle}>Steps per Hour</Text>
      <BarChart
        style={styles.chartStyle}
        data={hourlyStepsData}
        width={screenWidth * 0.8} // Width based on screen size (adjust multiplier as needed)
        height={220} // Fixed height for the chart
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={-45} // Rotate labels
        showValuesOnTopOfBars={true} // Show values on bars
        fromZero={true} // Ensure Y-axis starts at 0
      />

      {/* Add Weekly Trend / Streaks / Tips later */}
      <Text style={styles.comingSoon}>Weekly trends and streaks coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  goalSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#555',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    // Add other specific styles if needed
  },
  comingSoon: {
      marginTop: 20,
      fontStyle: 'italic',
      color: '#888',
  }
});

export default StepsDetailContent; 