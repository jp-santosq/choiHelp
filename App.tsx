// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
// If you make VideoPlayerScreen a standalone screen, import it here.
// import VideoPlayerScreen from './screens/VideoPlayerScreen';

// --- Type Definitions for Navigation ---
// This defines the available screens and the parameters they expect.
export type RootStackParamList = {
  Home: undefined; // The Home screen takes no parameters
  Detail: { 
    userId: string; 
    userName: string; 
  };
  // Example if VideoPlayer were a screen:
  // VideoPlayer: { skeletonImages: number[]; fallTimestamp: string };
};
// ---

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Monitoring Dashboard' // Screen title in the header
          }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ 
            title: 'Fall Incident Details' // Screen title in the header
          }} 
        />
        {/*
        <Stack.Screen 
          name="VideoPlayer"
          component={VideoPlayerScreen}
          options={{ title: 'Event Playback' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
