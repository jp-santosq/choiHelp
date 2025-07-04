import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const { title, body, time } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {title && (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
          <Text style={{ fontSize: 18, marginBottom: 5 }}>{body}</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>Time: {time}</Text>
        </>
      )}
      {!title && (
        <Text style={{ fontSize: 18, color: 'gray' }}>No notification received yet.</Text>
      )}
    </View>
  );
}
