import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder data
const restingHR = 68;
const averageHR = 75; // Example average

const HeartRateDetailContent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resting Heart Rate</Text>
      <Text style={styles.value}>{restingHR} bpm</Text>

      {/* Placeholder for HR Over Day, Zones, Historical Trends */}
      <Text style={styles.placeholderText}>
        Detailed heart rate chart (over the day), time in zones, and historical trends coming soon.
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
    marginBottom: 10,
  },
  value: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#dc3545', // Red for heart rate
      marginBottom: 20,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default HeartRateDetailContent; 