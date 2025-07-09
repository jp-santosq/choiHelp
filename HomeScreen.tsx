// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Colors, Layout } from '../constants/Colors'; // Using centralized styles
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For icons

// --- Type Definitions ---
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// --- Mock Data ---
// This data simulates what you would get from a backend API.
// Added `age` and `avatar` to match the Figma design.
const MOCK_USERS = [
  { id: '1', name: 'John Doe', age: 82, avatar: require('../assets/avatar1.png'), lastFallTime: '15:00', hasFallen: true },
  { id: '2', name: 'Jane Smith', age: 78, avatar: require('../assets/avatar2.png'), lastFallTime: '10:30', hasFallen: false },
  { id: '3', name: 'Robert Johnson', age: 88, avatar: require('../assets/avatar3.png'), lastFallTime: '11:45', hasFallen: false },
];
// Note: Make sure you have avatar1.png, avatar2.png, etc., in an `assets` folder.

// --- Reusable User Card Component ---
// --- Reusable User Card Component ---
const UserCard = ({ item, onPress }: { item: typeof MOCK_USERS[0], onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.card, item.hasFallen && styles.alertCard]}
    onPress={onPress}
  >
    <View style={styles.cardHeader}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name} (Age: {item.age})</Text>
        <Text style={[styles.statusText, { color: item.hasFallen ? Colors.alert : Colors.success }]}>
          {item.hasFallen ? '● Fall Detected' : '● All Clear'}
        </Text>
      </View>
    </View>
    {item.hasFallen && (
      <View style={styles.alertDetails}>
        <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.alert} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.alertTitle}>A fall was detected!</Text>
          <Text style={styles.alertTime}>Today at {item.lastFallTime}</Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleUserPress = (user: typeof MOCK_USERS[number]) => {
    const route = user.hasFallen ? 'Detail' : 'Info';
    navigation.navigate(route, { userId: user.id, userName: user.name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monitoring</Text>
        <Text style={styles.headerDate}>{currentDate}</Text>
      </View>
      <FlatList
        data={MOCK_USERS}
        renderItem={({ item }) => (
          <UserCard
            item={item}
            onPress={() => handleUserPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}


// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerDate: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: Layout.padding,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  alertCard: {
    borderColor: Colors.alert,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  alertDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alertBackground,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  alertTitle: {
    color: Colors.alert,
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertTime: {
    color: Colors.alert,
    fontSize: 14,
  },
});
