import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../screens/types/User';

const USERS_STORAGE_KEY = '@ElderlyMonitoringApp:users';
const FALL_HISTORY_STORAGE_KEY = '@ElderlyMonitoringApp:fallHistory';

const testUser: User = {
  id: 'test-user',
  fullName: '夏目漱石',
  age: 81,
  photoUri: require('../assets/avatar2.png'),
  dateOfBirth: '1944-01-01',
  gender: 'Female',
};

export const mockUserDetails: { [key: string]: { heartRate: number | string; fallRisk: string } } = {
  'test-user': { heartRate: 76, fallRisk: 'Medium' },
};

export let mockFallHistory: any[] = [];

export const saveUsers = async (users: User[]) => {
  const jsonValue = JSON.stringify(users);
  await AsyncStorage.setItem(USERS_STORAGE_KEY, jsonValue);
};

export const loadUsers = async (): Promise<User[]> => {
  const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  return jsonValue ? JSON.parse(jsonValue) : [];
};

export const saveFallHistory = async (history: typeof mockFallHistory) => {
  const jsonValue = JSON.stringify(history);
  await AsyncStorage.setItem(FALL_HISTORY_STORAGE_KEY, jsonValue);
};

export const loadFallHistory = async (): Promise<typeof mockFallHistory> => {
  const jsonValue = await AsyncStorage.getItem(FALL_HISTORY_STORAGE_KEY);
  return jsonValue ? JSON.parse(jsonValue) : [];
};

export const updateFallStatus = async (fallId: string, resolved: boolean) => {
  const history = await loadFallHistory();
  const index = history.findIndex(f => f.id === fallId);
  if (index !== -1) {
    history[index].isResolved = resolved;
    await saveFallHistory(history);
    const memIndex = mockFallHistory.findIndex(f => f.id === fallId);
    if (memIndex !== -1) {
      mockFallHistory[memIndex].isResolved = resolved;
    }
  }
};

export const deleteUser = async (userId: string) => {
  const users = await loadUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  await saveUsers(filteredUsers);

  const history = await loadFallHistory();
  const filteredHistory = history.filter(h => h.id !== userId);
  mockFallHistory = filteredHistory;
  await saveFallHistory(filteredHistory);
};

export const initializeData = async () => {
  const users = await loadUsers();
  if (users.length === 0) {
    await saveUsers([testUser]);
  }
  const history = await loadFallHistory();
  if (history.length === 0) {
    await saveFallHistory([]); // start empty
  }
  mockFallHistory = await loadFallHistory(); // always sync from storage

};

export const addUser = async (newUser: User) => {
  const users = await loadUsers();
  const updatedUsers = [...users, newUser];
  await saveUsers(updatedUsers);
};

export const initializeUsers = async () => {
  const existing = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  if (!existing) {
    // Insert your default users here
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([testUser]));
  }
};