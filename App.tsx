// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import InfoElderly from './screens/InfoElderly';
import EditElderly from './screens/EditElderly';
// If you make VideoPlayerScreen a standalone screen, import it here.
// import VideoPlayerScreen from './screens/VideoPlayerScreen';

// --- Type Definitions for Navigation ---
// This defines the available screens and the parameters they expect.
export type RootStackParamList = {
  Home: undefined;
  Detail: { userId: string; userName: string };
  Info:   { userId: string; userName: string };
  Edit: { userId: string; userName: string }; 
  
  // Example if VideoPlayer were a screen:
  // VideoPlayer: { skeletonImages: number[]; fallTimestamp: string };
};
// ---

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Info" component={InfoElderly} />
        <Stack.Screen name="Edit" component={EditElderly} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
