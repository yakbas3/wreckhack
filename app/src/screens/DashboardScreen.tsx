import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import MetricTile from '../components/MetricTile'; // Import the MetricTile component
import MetricDetailModal from '../components/MetricDetailModal'; // Import the modal component

const DashboardScreen = () => {
  // State for modal visibility and selected metric
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Placeholder data - replace with actual data fetching later
  const metrics = {
    steps: { value: 5200, unit: 'steps', goal: 8000 },
    sleep: { value: 7.5, unit: 'hours', goal: 8 },
    activity: { value: 45, unit: 'min', goal: 60 },
    heartRate: { value: 68, unit: 'bpm', type: 'Resting' },
  };

  const handleTilePress = (metricName: string) => {
    setSelectedMetric(metricName);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMetric(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Replace with actual avatar/name component */}
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.userName}>User Name</Text>
          {/* Replace with actual goal calculation */}
          <Text style={styles.headerGoal}>Daily Goal: 75%</Text>
        </View>

        {/* Metrics Grid Section */}
        <View style={styles.grid}>
          <MetricTile
            title="Steps"
            value={metrics.steps.value.toLocaleString()}
            unit={metrics.steps.unit}
            onPress={() => handleTilePress('Steps')}
            currentValue={metrics.steps.value}
            goal={metrics.steps.goal}
          />
          <MetricTile
            title="Sleep"
            value={metrics.sleep.value}
            unit={metrics.sleep.unit}
            onPress={() => handleTilePress('Sleep')}
            currentValue={metrics.sleep.value}
            goal={metrics.sleep.goal}
          />
          <MetricTile
            title="Activity"
            value={metrics.activity.value}
            unit={metrics.activity.unit}
            onPress={() => handleTilePress('Activity')}
            currentValue={metrics.activity.value}
            goal={metrics.activity.goal}
          />
          <MetricTile
            title={`${metrics.heartRate.type} HR`}
            value={metrics.heartRate.value}
            unit={metrics.heartRate.unit}
            onPress={() => handleTilePress('Heart Rate')}
          />
          {/* Add more tiles as needed */}
        </View>
      </ScrollView>

      {/* Render the Modal */}
      {selectedMetric && (
        <MetricDetailModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          metricType={selectedMetric}
          // Pass detailed data here later
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Slightly different light background
  },
  container: {
    padding: 15,
    paddingBottom: 30, // Add padding at the bottom if scroll content is long
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    // Add image component here later
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  headerGoal: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#28a745', // Slightly different green
  },
  grid: {
    flexDirection: 'row', // Arrange children in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'space-between', // Distribute space between items
    marginHorizontal: -8, // Counteract the margin added in MetricTile
  },
});

export default DashboardScreen; 