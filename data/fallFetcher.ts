import { supabase } from '../supabaseClient';
import { saveFallHistory } from './mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchLatestFall = async () => {
  const { data: falls, error } = await supabase
    .from('fall_events')
    .select('*')
    .order('detected_at', { ascending: false })
    .limit(1);

  console.log('[Supabase] Raw falls data:', falls);
  if (error) {
    console.error('[Supabase] Error fetching falls:', error);
    return null;
  }

  const latest = falls?.[0];
  if (!latest) {
    console.log('[Supabase] No fall data found');
    return null;
  }

  const path = latest.video_path;
  console.log('[Supabase] Attempting to get public URL for:', path);

  const { data: signed } = supabase.storage
    .from('videos')
    .getPublicUrl(path);

  console.log('[Supabase] Public video URL:', signed?.publicUrl);

  
const newFall = {
  ...latest,
  videoUrl: signed?.publicUrl ?? '',
  skeletons: [],             // fallback if not available
  isResolved: false,  
  timestamp: latest.detected_at,       // default status

};

await saveFallHistory([newFall]); // overwrites previous history
const stored = await AsyncStorage.getItem('@ElderlyMonitoringApp:fallHistory');
console.log('[DEBUG] Saved fallHistory:', stored);
return {
  ...newFall
};
};

