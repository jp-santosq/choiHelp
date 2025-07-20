// App.tsx
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeData } from './data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import InfoElderly from './screens/InfoElderly';
import AddEditMember from './screens/AddEditMemberScreen';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Detail: { userId: string; userName: string; fallFlags?: Record<string, boolean> };
  Info: { userId: string; userName: string };
  AddEditMember: { userId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const resetAndInit = async () => {
      console.log('🧹 Clearing AsyncStorage...');

      console.log('🧠 Initializing mock data...');
      await initializeData();
    };

    resetAndInit();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Monitoring Dashboard' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Fall Incident Details' }}
        />
        <Stack.Screen
          name="Info"
          component={InfoElderly}
          options={{ title: 'Elderly Info' }}
        />
        <Stack.Screen
          name="AddEditMember"
          component={AddEditMember}
          options={({ route }) => ({
            title: route.params?.userId ? 'Edit Member' : 'Add New Member',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
