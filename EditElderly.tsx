import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Colors, Layout } from '../constants/Colors';

type EditRoute = RouteProp<RootStackParamList, 'Edit'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Edit'>;

export default function EditElderly() {
  const { params } = useRoute<EditRoute>();
  const navigation = useNavigation<Nav>();

  // local state (prefill later when you fetch real data)
  const [name, setName] = useState(params.userName);
  const [phone, setPhone] = useState('+31 6 0000 0000');

  const handleSave = async () => {
    // 🔗 TODO: call your backend here
    // await api.updateUser(params.userId, { name, phone });
    Alert.alert('Saved!', 'Info updated in database (stub).');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Layout.padding, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
