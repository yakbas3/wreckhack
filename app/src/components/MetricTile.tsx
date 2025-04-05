import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MetricTileProps {
  title: string;
  value: string | number;
  unit?: string;
  onPress?: () => void;
  // Added props for goal progress
  currentValue?: number;
  goal?: number;
}

const MetricTile: React.FC<MetricTileProps> = ({
  title,
  value,
  unit,
  onPress,
  currentValue,
  goal,
}) => {

  const renderProgress = () => {
    if (typeof currentValue === 'number' && typeof goal === 'number' && goal > 0) {
      const progress = Math.round((currentValue / goal) * 100);
      // Clamp progress between 0 and 100
      const clampedProgress = Math.max(0, Math.min(progress, 100));
      return (
        <Text style={styles.progressText}>
          {clampedProgress}% of goal
        </Text>
        // Replace with a visual progress bar/ring later
      );
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </View>
      {/* Render progress indicator */}
      {renderProgress()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 8,
    minWidth: '40%',
    flexGrow: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 130, // Ensure consistent height
    justifyContent: 'space-between', // Space out title, value, progress
  },
  title: {
    fontSize: 16,
    color: '#666',
    // marginBottom: 10, // Removed margin, using justify-content now
    fontWeight: '500',
    textAlign: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 5, // Add some vertical margin around value
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  unit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#007bff', // Blue color for progress
    fontWeight: '500',
    marginTop: 5, // Add space above progress text
  },
});

export default MetricTile; 