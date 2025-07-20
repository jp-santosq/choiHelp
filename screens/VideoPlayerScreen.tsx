// screens/VideoPlayerScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, Layout } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VideoPlayerScreenProps {
  skeletonImages: number[]; // Array of require() paths for skeleton images
  fallTimestamp?: string;    // Optional: timestamp of the fall
}

export default function VideoPlayerScreen({ skeletonImages, fallTimestamp }: VideoPlayerScreenProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const FRAME_INTERVAL = 200; // milliseconds per frame (5 fps)

  useEffect(() => {
    // Start playing automatically when component loads
    setIsPlaying(true);

    return () => {
      // Cleanup interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrameIndex(prevIndex => (prevIndex + 1) % skeletonImages.length);
      }, FRAME_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, skeletonImages.length]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);
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
        <Image
          source={skeletonImages[currentFrameIndex]}
          style={styles.skeletonImage}
          resizeMode="contain"
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={Colors.primary} />
        )}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity onPress={restartPlayback} style={styles.controlButton}>
            <MaterialCommunityIcons name="replay" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
            <MaterialCommunityIcons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={50}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoBar}>
        <Text style={styles.frameCounter}>Frame: {currentFrameIndex + 1} / {skeletonImages.length}</Text>
        {fallTimestamp && <Text style={styles.timestampText}>Timestamp: {fallTimestamp}</Text>}
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
    aspectRatio: 4 / 3, // Adjusted for typical skeleton data aspect ratio
    backgroundColor: Colors.darkGray,
    borderRadius: Layout.borderRadius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    padding: Layout.padding
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
    fontWeight: '500'
  },
  timestampText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500'
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});
