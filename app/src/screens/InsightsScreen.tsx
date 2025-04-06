import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { HealthDataAnalyzer } from '../components/HealthDataAnalyzer';
import { HealthDataService } from '../services/HealthDataService';

interface Message {
  text: string;
  isUser: boolean;
  data?: any;
  type?: 'steps' | 'sleep' | 'comparison' | 'heart_rate';
  date?: string;
}

export default function InsightsScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const healthDataService = HealthDataService.getInstance();

  useEffect(() => {
    const initializeData = async () => {
      await healthDataService.loadData();
    };
    initializeData();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    setMessages(prev => [...prev, {
      text: userMessage,
      isUser: true
    }]);

    try {
      const analysis = healthDataService.analyzeQuery(userMessage);
      let responseData;
      let responseText = '';

      switch (analysis.type) {
        case 'steps':
          if (analysis.date) {
            await healthDataService.loadData();
            responseData = healthDataService.getStepsForDate(analysis.date);
            responseText = `Here are your steps for ${analysis.date}`;
          } else {
            responseText = 'Please specify a date to see your steps data.';
          }
          break;

        case 'heart_rate':
          if (analysis.date) {
            responseData = healthDataService.getHeartRateForDate(analysis.date);
            responseText = `Here's your heart rate for ${analysis.date}`;
          } else {
            responseText = 'Please specify a date to see your heart rate data.';
          }
          break;

        case 'sleep':
          if (analysis.date) {
            responseData = healthDataService.getSleepForDate(analysis.date);
            responseText = `Here's your sleep analysis for ${analysis.date}`;
          } else {
            responseText = 'Please specify a date to see your sleep data.';
          }
          break;

        case 'comparison':
          if (analysis.date) {
            const impactAnalysis = healthDataService.analyzeStepsHeartRateImpact(analysis.date);
            responseData = {
              steps: healthDataService.getStepsForDate(analysis.date),
              heartRate: healthDataService.getHeartRateForDate(analysis.date),
              narrative: impactAnalysis.narrative
            };
            responseText = impactAnalysis.narrative;
          } else {
            responseText = 'Please specify a date to analyze the impact of steps on heart rate.';
          }
          break;
      }

      setMessages(prev => [...prev, {
        text: responseText,
        isUser: false,
        data: responseData,
        type: analysis.type,
        date: analysis.date
      }]);

    } catch (error) {
      console.error('Error processing query:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Health Insights</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              {message.data && message.type && (
                <HealthDataAnalyzer
                  data={message.data}
                  type={message.type}
                  date={message.date}
                />
              )}
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your health data..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 