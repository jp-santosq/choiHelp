// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

// Define the bottom tab navigation layout
export default function TabsLayout() {
  return (
    <Tabs>
      {/* Home screen tab */}
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      
      {/* Fall notification test tab */}
      <Tabs.Screen name="fall-notify" options={{ title: 'Notification Test' }} />
    </Tabs>
  );
}
