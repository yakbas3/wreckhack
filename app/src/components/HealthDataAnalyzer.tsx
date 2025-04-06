import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

interface HealthDataAnalyzerProps {
  data: any;
  type: 'steps' | 'sleep' | 'comparison' | 'heart_rate';
  date?: string;
}

export const HealthDataAnalyzer: React.FC<HealthDataAnalyzerProps> = ({ data, type, date }) => {
  const screenWidth = Dimensions.get('window').width;

  const renderHeartRateChart = () => {
    console.log('HealthDataAnalyzer: Received heart rate data:', JSON.stringify(data, null, 2));

    if (!data || data.length === 0) {
      return <Text>No heart rate data available</Text>;
    }

    const chartData = {
      labels: data.map((d: any) => d.time.split(':')[0]),
      datasets: [{
        data: data.map((d: any) => d.value),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2
      }]
    };

    const avgHeartRate = Math.round(
      data.reduce((sum: number, d: any) => sum + d.value, 0) / data.length
    );

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Heart Rate on {date}</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" bpm"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ff0000"
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: '#e3e3e3',
            },
            propsForLabels: {
              fontSize: 10,
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          segments={5}
        />
        <Text style={styles.averageHeartRate}>
          Average Heart Rate: {avgHeartRate} BPM
        </Text>
      </View>
    );
  };

  const renderStepsChart = () => {
    console.log('HealthDataAnalyzer: Received data:', JSON.stringify(data, null, 2));

    if (!data || data.length === 0) {
      console.log('HealthDataAnalyzer: No data available');
      return <Text>No data available</Text>;
    }

    const chartData = {
      labels: data.map((d: any) => d.hour.split(':')[0]),
      datasets: [{
        data: data.map((d: any) => Number(d.steps) || 0)
      }]
    };

    const totalSteps = data.reduce((sum: number, d: any) => sum + (Number(d.steps) || 0), 0);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Steps on {date}</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" steps"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            fillShadowGradientFrom: '#4CAF50',
            fillShadowGradientTo: '#4CAF50',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.7,
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: '#e3e3e3',
            },
            propsForLabels: {
              fontSize: 10,
              rotation: 0
            },
            formatYLabel: (yLabel: string) => yLabel,
            formatTopBarValue: (topBarValue: number) => Math.round(topBarValue).toString()
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          showBarTops={true}
          showValuesOnTopOfBars={true}
          withInnerLines={true}
          fromZero={true}
          segments={5}
        />
        <Text style={styles.totalSteps}>
          Total Steps: {totalSteps.toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderSleepChart = () => {
    const chartData = {
      labels: ['Deep Sleep', 'Light Sleep', 'REM', 'Awake'],
      datasets: [{
        data: [
          data.deepSleep || 0,
          data.lightSleep || 0,
          data.remSleep || 0,
          data.awakeTime || 0
        ]
      }]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sleep Analysis for {date}</Text>
        <Text style={styles.sleepSummary}>
          Total Sleep: {data.totalSleep} hours
        </Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderComparisonChart = () => {
    if (!data || !data.steps || !data.heartRate) {
      return <Text>No comparison data available</Text>;
    }

    const stepsData = {
      labels: data.steps.map((d: any) => d.hour.split(':')[0]),
      datasets: [{
        data: data.steps.map((d: any) => Number(d.steps) || 0)
      }]
    };

    const heartRateData = {
      labels: data.heartRate.map((d: any) => d.time.split(':')[0]),
      datasets: [{
        data: data.heartRate.map((d: any) => d.value),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2
      }]
    };

    const commonChartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 0,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForBackgroundLines: {
        strokeWidth: 1,
        stroke: '#e3e3e3',
      },
      propsForLabels: {
        fontSize: 9,
        rotation: 0
      },
      formatXLabel: (label: string) => {
        // Show every third hour to prevent crowding
        const hour = parseInt(label);
        return hour % 3 === 0 ? label.padStart(2, '0') : '';
      },
      formatYLabel: (label: string) => {
        const value = parseInt(label);
        if (value >= 1000) {
          return (value / 1000).toFixed(1) + 'k';
        }
        return value.toString();
      }
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Steps and Heart Rate Impact Analysis</Text>
        
        <Text style={styles.chartSubtitle}>Steps Throughout the Day</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={stepsData}
            width={screenWidth - 40}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              ...commonChartConfig,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              fillShadowGradientFrom: '#4CAF50',
              fillShadowGradientTo: '#4CAF50',
              barPercentage: 0.6,
              propsForVerticalLabels: {
                fontSize: 10,
              }
            }}
            style={styles.chart}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            fromZero={true}
            segments={4}
            verticalLabelRotation={0}
          />
        </View>

        <Text style={styles.chartSubtitle}>Heart Rate Response</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={heartRateData}
            width={screenWidth - 40}
            height={180}
            yAxisLabel=""
            yAxisSuffix=" bpm"
            chartConfig={{
              ...commonChartConfig,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: "#ff0000"
              },
              propsForVerticalLabels: {
                fontSize: 10,
              }
            }}
            bezier
            style={styles.chart}
            segments={4}
            verticalLabelRotation={0}
          />
        </View>

        <Text style={styles.narrative}>{data.narrative}</Text>
      </View>
    );
  };

  switch (type) {
    case 'heart_rate':
      return renderHeartRateChart();
    case 'steps':
      return renderStepsChart();
    case 'sleep':
      return renderSleepChart();
    case 'comparison':
      return renderComparisonChart();
    default:
      return <Text>Unsupported data type</Text>;
  }
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sleepSummary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  totalSteps: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 16,
    textAlign: 'center'
  },
  averageHeartRate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff0000',
    marginTop: 16,
    textAlign: 'center'
  },
  chartSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  narrative: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    lineHeight: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  chartWrapper: {
    marginHorizontal: -8, // Compensate for internal padding
    marginBottom: 8,
  }
}); 