import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import StepsDetailContent from './modal-content/StepsDetailContent';
import SleepDetailContent from './modal-content/SleepDetailContent';
import ActivityDetailContent from './modal-content/ActivityDetailContent';
import HeartRateDetailContent from './modal-content/HeartRateDetailContent';

interface MetricDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  metricType: string; // e.g., 'Steps', 'Sleep'
  // metricData: any; // We will pass detailed data here later
}

const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  isVisible,
  onClose,
  metricType,
  // metricData,
}) => {

  // Function to render the correct content based on metricType
  const renderMetricContent = () => {
    switch (metricType) {
      case 'Steps':
        return <StepsDetailContent />;
      case 'Sleep':
        return <SleepDetailContent />;
      case 'Activity':
        return <ActivityDetailContent />;
      case 'Heart Rate':
        return <HeartRateDetailContent />;
      default:
        return (
          <View style={styles.contentPlaceholder}>
            <Text>Details for {metricType} not implemented yet.</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{metricType} Details</Text>

            {/* Render the specific metric content */}
            {renderMetricContent()}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  contentPlaceholder: {
    marginVertical: 20,
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    marginTop: 'auto',
    paddingTop: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MetricDetailModal; 