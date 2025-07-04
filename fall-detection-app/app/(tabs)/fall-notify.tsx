// app/(tabs)/fall-notify.tsx
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { initLocalNotification, sendFallNotification } from '../../notification/NotificationService';
import { useRouter } from 'expo-router';

export default function FallNotifyScreen() {
  const router = useRouter();

  useEffect(() => {
    initLocalNotification();
  }, []);

  const handleNotify = async () => {
    await sendFallNotification();

    const now = new Date();
    const time = now.toLocaleTimeString();

   router.push(
  `/?title=${encodeURIComponent('⚠️ Fall Detected!')}&body=${encodeURIComponent('Grandma might have fallen down!')}&time=${encodeURIComponent(time)}`
);

  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Fall Notification" onPress={handleNotify} />
    </View>
  );
}
