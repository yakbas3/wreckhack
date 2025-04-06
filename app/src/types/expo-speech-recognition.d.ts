declare module 'expo-speech-recognition' {
  interface SpeechRecognitionEvent {
    value?: string[];
  }

  interface SpeechRecognitionError {
    error?: {
      message?: string;
      code?: string;
    };
  }

  interface SpeechRecognitionModule {
    isAvailableAsync: () => Promise<boolean>;
    requestPermissionsAsync: () => Promise<{ granted: boolean }>;
    startAsync: (options?: { partialResults?: boolean; language?: string }) => Promise<void>;
    stopAsync: () => Promise<void>;
    addListener: (eventName: string, callback: (event: any) => void) => void;
    removeListener: (eventName: string, callback: (event: any) => void) => void;
    removeAllListeners: () => void;
  }

  const SpeechRecognition: SpeechRecognitionModule;
  export default SpeechRecognition;
} 