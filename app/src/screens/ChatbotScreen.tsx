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
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import NetInfo, { NetInfoState, NetInfoWifiState } from '@react-native-community/netinfo';
import { API_URLS, updateBaseUrl } from '../config/api.js';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Monitor network connectivity and update API URL if needed
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant microphone access to use voice recording.');
        }
      } catch (err) {
        console.error('Error requesting permissions:', err);
      }
    })();
  }, []);

  // Prevent tab switching while loading
  useEffect(() => {
    if (isLoading) {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    }
  }, [isLoading, navigation]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start voice recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);

      // Get the recording URI
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('No recording URI available');
      }

      // For now, we'll use a placeholder message
      // In a real app, you would send this audio file to a speech-to-text service
      await sendMessage("Voice message recorded. Speech-to-text conversion coming soon!");
      
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to process voice recording');
    }

    setRecording(null);
  };

  const speakResponse = async (text: string) => {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });
    } catch (err) {
      console.error('Failed to speak response', err);
    }
  };

  const sendMessage = async (messageText: string = inputText.trim()) => {
    if (!messageText) return;

    if (!isConnected) {
      Alert.alert('No Connection', 'Please check your internet connection and try again.');
      return;
    }

    if (messageText === inputText) {
      setInputText('');
    }
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: messageText, isUser: true }]);
    setIsLoading(true);

    try {
      console.log('Sending request to:', API_URLS.chat);
      const response = await fetch(API_URLS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_message: messageText,
          session_id: sessionId,
          health_data_snapshot: {
            steps: 5200,
            sleep: 7.5,
            activity: 45,
            resting_hr: 68
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.detail || 'Network response was not ok');
      }

      const data = await response.json();
      
      // Store the session ID for future messages
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      
      // Add bot response to chat
      const botResponse = data.ai_response;
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
      
      // Speak the response
      await speakResponse(botResponse);
      
    } catch (error) {
      console.error('Error in chat request:', error);
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (!isConnected) {
        errorMessage = 'No internet connection. Please check your connection and try again.';
      }
      
      setMessages(prev => [...prev, {
        text: errorMessage,
        isUser: false
      }]);
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
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
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Chat Assistant</Text>
          {!isConnected && (
            <Text style={styles.connectionWarning}>No Connection</Text>
          )}
          {isLoading && (
            <ActivityIndicator 
              style={styles.headerLoader} 
              color="#fff" 
            />
          )}
        </View>
        
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContentContainer}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                !message.isUser && styles.botMessageText
              ]}>{message.text}</Text>
            </View>
          ))}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Animated.View 
                style={[
                  styles.recordingDot,
                  { opacity: pulseAnim }
                ]} 
              />
              <Text style={styles.recordingText}>
                Recording...
              </Text>
            </View>
          )}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            editable={!isLoading && !isRecording}
          />
          <TouchableOpacity 
            style={[styles.iconButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons 
              name={isRecording ? "stop" : "mic"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              (!inputText.trim() || isLoading || isRecording) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading || isRecording}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLoader: {
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f44336',
    marginRight: 8,
    opacity: 1,
  },
  recordingText: {
    fontSize: 16,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    padding: 12,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 20,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  iconButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionWarning: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 8,
  },
}); 