import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



export async function initLocalNotification() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

export async function sendFallNotification() {
  console.log("📣 Sending 7 local notifications...");
  for (let i = 1; i <= 7; i++) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ Fall Detected! #${i}`,
        body: 'Grandma might have fallen down!',
        sound: 'default',
      },
      trigger:{ seconds: i },  
    });
  }
}
