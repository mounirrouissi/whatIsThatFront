import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { BackButton } from '@/components/BackButton'; // Add this import at the top

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const SPACING = 10;
const BACKDROP_HEIGHT = height * 0.65;

// Dummy data for additional images
const dummyImages = [
  'https://images.dog.ceo//breeds//poodle-miniature//n02113712_8473.jpg',
  'https://images.dog.ceo//breeds//poodle-miniature//n02113712_8473.jpg',
  'https://images.dog.ceo//breeds//poodle-miniature//n02113712_8473.jpg',
  'https://images.dog.ceo//breeds//poodle-miniature//n02113712_8473.jpg',
];

export default function ObservationDetail() {
  const { observation: observationString, category } = useLocalSearchParams();
  const observation = JSON.parse(observationString as string);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [images, setImages] = useState([observation.image_url, ...dummyImages]);

  useEffect(() => {
    // You can fetch more images or details here if needed
  }, []);

  const Backdrop = () => (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <Animated.FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],
            outputRange: [0, width],
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: item }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
        <BackButton backTo={"(app)/Observations"}/> 
      <Backdrop />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  transform: [{ translateY }],
                  backgroundColor: 'white',
                  borderRadius: 34,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.posterImage}
                />
                <Text style={styles.title} numberOfLines={1}>
                  {observation.type || 'Unknown'}
                </Text>
                <Text style={styles.detail}>Category: {category}</Text>
                <Text style={styles.detail}>
                  Identified At: {new Date(observation.identified_at).toLocaleString()}
                </Text>
                <Text style={styles.detail}>
                  Resemblance Rank: {observation.resemblance_rank}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {observation.description || 'No description available.'}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});