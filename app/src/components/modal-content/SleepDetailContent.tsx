import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder data
const lastNightSleep = '7.5 hours';

const SleepDetailContent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last Night's Sleep</Text>
      <Text style={styles.value}>{lastNightSleep}</Text>

      {/* Placeholder for Sleep Stages, Timeline, Week Overview */}
      <Text style={styles.placeholderText}>
        Detailed sleep stages, timeline, and weekly overview coming soon.
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
      color: '#343a40',
      marginBottom: 20,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default SleepDetailContent; 