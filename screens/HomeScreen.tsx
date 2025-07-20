import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadUsers, loadFallHistory, initializeData } from '../data/mockData';
import { fetchLatestFall } from '../data/fallFetcher';
import { useEffect } from 'react';
import { User } from '../screens/types/User';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface UserDisplayItem {
  id: string;
  name: string;
  age?: number;
  avatar?: any;
  hasFallen: boolean;
  lastFallTime: string;
}

const UserCard = ({
  item,
  onPress,
  onToggleFall,
}: {
  item: UserDisplayItem;
  onPress: () => void;
  onToggleFall: () => void;
}) => (
  <View style={[styles.card, item.hasFallen && styles.alertCard]}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardHeader}>
        {item.avatar ? (
          <Image source={item.avatar} style={styles.avatar} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={60}
            color={Colors.gray}
            style={styles.avatarPlaceholder}
          />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.name} {item.age ? `(Age: ${item.age})` : ''}
          </Text>
          <Text
            style={[
              styles.statusText,
              { color: item.hasFallen ? Colors.alert : Colors.success },
            ]}
          >
            {item.hasFallen ? '● Fall Detected' : '● No Issues'}
          </Text>
        </View>
      </View>

      {item.hasFallen && (
        <View style={styles.alertDetails}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.alert} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.alertTitle}>A fall has been detected!</Text>
            <Text style={styles.alertTime}>Today {item.lastFallTime}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  
  const [users, setUsers] = useState<UserDisplayItem[]>([]);
  const [fallFlags, setFallFlags] = useState<Record<string, boolean>>({});

  const fetchUsers = useCallback(
    async () => {
      const storedUsers: User[] = await loadUsers();
      const fallHistory = await loadFallHistory();

      const processedUsers: UserDisplayItem[] = storedUsers.map((user) => {
        const userFalls = fallHistory;
        const latestFall = userFalls[0];
        const hasUnresolvedFall = latestFall && !latestFall.isResolved;
        const raw = latestFall?.timestamp ?? latestFall?.detected_at;
        const lastFallTime = raw
          ? new Date(raw).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A';

        return {
          id: user.id,
          name: user.fullName,
          age: user.age,
          avatar: user.photoUri ? { uri: user.photoUri } : undefined,
          hasFallen: hasUnresolvedFall,
          lastFallTime,
        };
      });

      setUsers(processedUsers);
    },
    [fallFlags]
  );

  useEffect(() => {
    (async () => {
      await initializeData();  // seed storage if empty
      await fetchUsers();      // ← load users right away (no fall needed)
    })();
  }, [fetchUsers]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchLatestFall();  // always sync latest fall into storage
      await fetchUsers();       // always reload users → cards appear/refresh
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  useFocusEffect(
  useCallback(() => {
    fetchUsers();
  }, [fallFlags])
);

  const toggleFallFlag = (userId: string) => {
    setFallFlags(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  useEffect(() => {
    fetchUsers();
  }, [fallFlags]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Monitoring</Text>
            <Text style={styles.headerDate}>{currentDate}</Text>
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={() => navigation.navigate('AddEditMember', { userId: undefined })}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.addMemberButtonText}>Add New Member</Text>
            </TouchableOpacity>
          </View>
        }
        data={users}
        renderItem={({ item }) => (
          <UserCard
            item={item}
            onPress={() =>
              navigation.navigate('Detail', {
                userId: item.id,
                userName: item.name,
              })
            }
            onToggleFall={() => toggleFallFlag(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
header: {
  paddingHorizontal: Layout.padding,
  paddingTop: Layout.padding,
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: Colors.text,
},

headerDate: {
  fontSize: 14,
  color: Colors.textSecondary,
  marginLeft: 12,
},

addMemberButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.white,
  borderRadius: Layout.borderRadius,
  paddingVertical: 6,
  paddingHorizontal: 10,
  marginLeft: 'auto',
  ...Layout.cardShadow,
},

addMemberButtonText: {
  marginLeft: 6,
  color: Colors.primary,
  fontWeight: 'bold',
  fontSize: 14,
},

  listContainer: { padding: Layout.padding },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius,
    padding: Layout.padding,
    marginBottom: Layout.margin,
    ...Layout.cardShadow,
  },
  alertCard: { borderColor: Colors.alert, borderWidth: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '600', color: Colors.text },
  statusText: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  alertDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alertBackground,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  alertTitle: { color: Colors.alert, fontWeight: 'bold', fontSize: 16 },
  alertTime: { color: Colors.alert, fontSize: 14 },
});
