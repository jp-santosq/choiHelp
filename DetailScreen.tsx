// screens/DetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Colors, Layout } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VideoPlayerScreen from './VideoPlayerScreen'; // Import the player component


// --- Type Definitions ---
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

// --- Mock Data ---
// In a real app, this data would be fetched based on the userId
const MOCK_FALL_DATA = {
  timestamp: '15:00 on June 30, 2025',
  // Array of image paths for the skeleton animation
  skeletonImages: [
    require('../assets/skeleton_frame_001.png'),
    require('../assets/skeleton_frame_002.png'),
    require('../assets/skeleton_frame_003.png'),
    require('../assets/skeleton_frame_004.png'),
    require('../assets/skeleton_frame_005.png'),
  ],
};
// Note: Make sure you have skeleton frame images in an `assets` folder.

export default function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { userId, userName } = route.params;

  // Set the screen title dynamically
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `${userName}'s Details` });
  }, [navigation, userName]);

  // --- Action Handlers ---
  const handleActionPress = (action: 'clear' | 'helper' | 'emergency') => {
    let title = 'Action Confirmation';
    let message = '';

    switch (action) {
      case 'clear':
        title = 'Mark as "No Problem"';
        message = `Are you sure you want to mark this incident for ${userName} as resolved?`;
        break;
      case 'helper':
        title = 'Call a Helper';
        message = `This will initiate a call to a designated helper for ${userName}. Proceed?`;
        // In a real app: Linking.openURL('tel:...');
        break;
      case 'emergency':
        title = 'Call Emergency Services';
        message = `You are about to call emergency services (e.g., 119) for ${userName}. \n\nONLY PROCEED IN A REAL EMERGENCY.`;
        // In a real app: Linking.openURL('tel:119');
        break;
    }

    Alert.alert(title, message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Confirm', style: 'default' }]);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Skeleton Playback Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fall Event Playback</Text>
          <VideoPlayerScreen 
            skeletonImages={MOCK_FALL_DATA.skeletonImages} 
            fallTimestamp={MOCK_FALL_DATA.timestamp}
          />
        </View>

        {/* --- Actions Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose an Action</Text>
          <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={() => handleActionPress('clear')}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color={Colors.success} />
            <Text style={[styles.actionButtonText, { color: Colors.success }]}>No Problem / False Alarm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.helperButton]} onPress={() => handleActionPress('helper')}>
             <MaterialCommunityIcons name="account-heart-outline" size={24} color={Colors.primary} />
            <Text style={[styles.actionButtonText, { color: Colors.primary }]}>Call a Helper</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]} onPress={() => handleActionPress('emergency')}>
            <MaterialCommunityIcons name="ambulance" size={24} color={Colors.white} />
            <Text style={[styles.actionButtonText, { color: Colors.white }]}>Call Emergency Services</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: Layout.padding,
  },
  section: {
    marginBottom: Layout.margin * 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.margin,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.padding,
    borderRadius: Layout.borderRadius,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  helperButton: {
    backgroundColor: Colors.primaryLight,
  },
  emergencyButton: {
    backgroundColor: Colors.alert,
  },
});
