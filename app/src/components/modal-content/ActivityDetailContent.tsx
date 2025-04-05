import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder data
const activeMinutes = 45;
const activityGoal = 60;

const ActivityDetailContent = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Daily Activity</Text>
        <Text style={styles.value}>{activeMinutes} min</Text>
        <Text style={styles.goalText}>Goal: {activityGoal} min</Text>

      {/* Placeholder for Activity Breakdown, Hourly Activity, Weekly Trend */}
      <Text style={styles.placeholderText}>
        Detailed activity breakdown (light, moderate, intense), hourly view, and weekly trends coming soon.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#555',
      marginBottom: 5,
  },
  value: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#28a745', // Green for activity
      marginBottom: 5,
  },
  goalText: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default ActivityDetailContent; 