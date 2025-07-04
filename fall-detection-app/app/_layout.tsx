// app/_layout.tsx
import { Slot } from 'expo-router';

export default function RootLayout() {
  return <Slot />; // This renders the nested layouts (like (tabs)/_layout.tsx)
}
