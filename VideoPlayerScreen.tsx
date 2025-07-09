import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/Colors';
import { RootStackParamList } from '../App';

interface VideoPlayerScreenProps {
  skeletonImages: number[];
  fallTimestamp?: string;
  userId?: string;    // 👈  pass these from DetailScreen if you have them
  userName?: string;  // 👈
}

export default function VideoPlayerScreen({
  skeletonImages,
  fallTimestamp,
  userId,
  userName,
}: VideoPlayerScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const FRAME_INTERVAL = 200; // ms per frame (5 fps)

  // Auto-play on mount
 useEffect(() => {
  setIsPlaying(true);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);


  // Play / pause loop
 useEffect(() => {
  if (isPlaying) {
    intervalRef.current = setInterval(() => {
      setCurrentFrameIndex((i) => (i + 1) % skeletonImages.length);
    }, FRAME_INTERVAL);
  } else if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isPlaying, skeletonImages.length]);

  const togglePlayPause = () => setIsPlaying((p) => !p);
  const restartPlayback = () => setCurrentFrameIndex(0);

  if (!skeletonImages || skeletonImages.length === 0) {
    return (
      <View style={[styles.playerContainer, styles.centerContent]}>
        <Text style={styles.errorText}>No skeleton data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        {/* --- Info shortcut button --- */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() =>
            navigation.navigate('Info', {
              userId: userId ?? '0',
              userName: userName ?? 'Unknown',
            })
          }
        >
          <MaterialCommunityIcons
            name="account-details-outline"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Image
          source={skeletonImages[currentFrameIndex]}
          style={styles.skeletonImage}
          resizeMode="contain"
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            size="large"
            color={Colors.primary}
          />
        )}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity onPress={restartPlayback} style={styles.controlButton}>
            <MaterialCommunityIcons name="replay" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
            <MaterialCommunityIcons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={50}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.frameCounter}>
          Frame: {currentFrameIndex + 1} / {skeletonImages.length}
        </Text>
        {fallTimestamp && (
          <Text style={styles.timestampText}>Timestamp: {fallTimestamp}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.darkGray,
    borderRadius: Layout.borderRadius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 👇 kleine info-knop rechtsboven
  infoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  centerContent: {
    padding: Layout.padding,
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlButton: {
    marginHorizontal: 20,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  frameCounter: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});
