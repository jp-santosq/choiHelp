import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchLatestFall } from '../data/fallFetcher';
import {
  mockUserDetails,
  updateFallStatus,
  deleteUser,
  loadUsers,
  loadFallHistory,
} from '../data/mockData';
import { User } from '../screens/types/User';
import { ResizeMode, Video } from 'expo-av';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;

interface FallIncident {
  id: string;
  timestamp: string;
  type: string;
  skeletons: any[];
  videoUrl?: string; 
  isResolved: boolean;
}

export default function DetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const { userId, userName } = route.params;

  const userDetails = mockUserDetails[userId] || { heartRate: 'N/A', fallRisk: 'N/A' };
  const [fallToShow, setFallToShow] = useState<FallIncident | null>(null);
  
/*
  useFocusEffect(
  useCallback(() => {
    const load = async () => {
      const history = await loadFallHistory();
      const latest = history[0];
      setFallToShow(latest);
    };
    load();
  }, [])
);
*/
useFocusEffect(
   useCallback(() => {
     // On focus, fetch latest event then load from storage
     (async () => {
       // 1) hit Supabase and save into AsyncStorage
       await fetchLatestFall();

       // 2) now read the up-to-date fall history
       const history = await loadFallHistory();
       setFallToShow(history[0]);
     })();
   }, [])
 );
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isSimulatedFall, setIsSimulatedFall] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const users = await loadUsers();
        const currentUser = users.find(u => u.id === userId);
        setUserProfile(currentUser || null);

        const history = await loadFallHistory();
        const userFalls = history.filter(fall => fall.id === userId);

        const latestUnresolvedFall = userFalls
          .filter(fall => !fall.isResolved)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        const latestOverallFall = userFalls
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        const fallFromFlags = route.params?.fallFlags?.[userId] ?? false;

        if (!latestUnresolvedFall && fallFromFlags) {
          // Simuleer een fall als er geen echte is, maar flag staat aan
          setFallToShow({
            id: 'simulated',
            timestamp: new Date().toISOString(),
            type: 'Manual Toggle',
            skeletons: [],
            isResolved: false,
          });
          setIsSimulatedFall(true);
        } else {
          setFallToShow(latestUnresolvedFall || latestOverallFall || null);
          setIsSimulatedFall(false);
        }
      };

      fetchUserData();
    }, [userId, route.params])
  );

  const callPhoneNumber = (number: string) => Linking.openURL(`tel:${number}`);

  const markAsResolved = () => {
    Alert.alert('Confirmation', 'Mark this incident as resolved?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          if (fallToShow?.id === 'simulated') {
            Alert.alert('Note', 'This was a manually toggled fall. Please reset from Home.');
            return;
          }

          if (fallToShow) {
            await updateFallStatus(fallToShow.id, true);
            const history = await loadFallHistory();
            const userFalls = history.filter(fall => fall.id === userId);

            const latestUnresolvedFall = userFalls
              .filter(fall => !fall.isResolved)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            const latestOverallFall = userFalls
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            setFallToShow(latestUnresolvedFall || latestOverallFall || null);
            Alert.alert('Done', 'The incident has been marked as resolved.');
          }
        },
      },
    ]);
  };

  const handleDeleteUser = () => {
    Alert.alert('Delete Member', `Are you sure you want to delete ${userName}'s profile?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUser(userId);
          navigation.goBack();
        },
      },
    ]);
  };

  const formattedFallTime = fallToShow
    ? new Date(fallToShow.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const formattedFallDate = fallToShow
    ? new Date(fallToShow.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <View style={styles.container}>
      {/* heart rate + risk */}
      <View style={styles.headerInfoContainer}>
        <View style={styles.headerInfoItem}>
          <Text style={styles.headerInfoLabel}>❤️ Heart Rate</Text>
          <Text style={styles.headerInfoValue}>{userDetails.heartRate} bpm</Text>
        </View>
        <View style={styles.headerInfoItem}>
          <Text style={styles.headerInfoLabel}>⚠️ Fall Risk</Text>
          <Text style={styles.headerInfoValue}>{userDetails.fallRisk}</Text>
        </View>
      </View>

      {/* fall detection info */}
      {fallToShow ? (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Latest Fall Detection</Text>
          <Text style={styles.infoText}>Date: {formattedFallDate}</Text>
          <Text style={styles.infoText}>Time: {formattedFallTime}</Text>
          <Text style={styles.infoText}>Type: {fallToShow.type}</Text>
          <Text style={fallToShow.isResolved ? styles.resolvedText : styles.unresolvedText}>
            {fallToShow.isResolved ? '✅ Resolved' : '🚨 Unresolved'}
          </Text>
        </View>
      ) : (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>No Fall History</Text>
          <Text style={styles.infoText}>No recent falls have been detected for this user.</Text>
        </View>
      )}

      {/* skeleton images */}
      {fallToShow ? (
  <View style={styles.skeletonSection}>
    <Text style={styles.sectionTitle}>
      {fallToShow.isResolved ? 'Fall History' : 'Fall Video'}
    </Text>

    {fallToShow.videoUrl ? (
      <Video
        source={{ uri: fallToShow.videoUrl }}
        style={{ width: '100%', height: 300 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    ) : (
      <Text style={styles.noDataText}>No video available.</Text>
    )}
  </View>
) : (
  <View style={styles.skeletonSection}>
    <Text style={styles.sectionTitle}>Fall Video</Text>
    <Text style={styles.noDataText}>No video available.</Text>
  </View>
)}

      {/* action buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.success }]}
          onPress={markAsResolved}
          disabled={!fallToShow || fallToShow.isResolved}
        >l
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={Colors.white} />
          <Text style={styles.actionButtonText}>Mark as Resolved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => callPhoneNumber('09012345678')}
        >
          <MaterialCommunityIcons name="phone-forward" size={24} color={Colors.white} />
          <Text style={styles.actionButtonText}>Call Caregiver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.alert }]}
          onPress={() => callPhoneNumber('119')}
        >
          <MaterialCommunityIcons name="ambulance" size={24} color={Colors.white} />
          <Text style={styles.actionButtonText}>Emergency Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Layout.padding },
  headerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius,
    paddingVertical: Layout.padding,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  headerInfoItem: { alignItems: 'center', flex: 1 },
  headerInfoLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  headerInfoValue: { fontSize: 22, fontWeight: 'bold', color: Colors.darkGray },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  infoTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: Colors.text },
  infoText: { fontSize: 16, color: Colors.darkGray, marginBottom: 4 },
  resolvedText: { fontSize: 16, fontWeight: 'bold', color: Colors.success, marginTop: 8 },
  unresolvedText: { fontSize: 16, fontWeight: 'bold', color: Colors.alert, marginTop: 8 },
  skeletonSection: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: Colors.text },
  skeletonScrollView: { height: 200 },
  skeletonImage: {
    width: 250,
    height: 200,
    marginRight: 10,
    borderRadius: Layout.borderRadius / 2,
    backgroundColor: Colors.lightGray,
  },
  scrollHint: { textAlign: 'center', fontSize: 12, color: Colors.gray, marginTop: 8 },
  noDataText: { fontSize: 16, color: Colors.darkGray, textAlign: 'center', paddingVertical: 20 },
  actionButtonsContainer: {
     flexDirection: 'row',
    flexWrap: 'wrap',             // 🔑 allow wrapping
    justifyContent: 'space-between',
    gap: 8,                       // optional spacing between buttons
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
    flexGrow: 1,                 // 🔑 grow to fit space
    flexBasis: '30%',           // 🔑 roughly 3 per row
    minWidth: 100,              // prevent buttons from becoming too small
    maxWidth: '100%', 
  },
  actionButtonText: { color: Colors.white, fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
});
