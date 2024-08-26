import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, StyleSheet, Dimensions, Animated, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = height * 0.5;

const onboardingData = [
  {
    image: images.natureCollage,
    title: "Discover Nature's\nWonders with NatureID",
    description: "Explore and Identify Plants, Animals, Bugs, and More: Your Personal Guide to the Natural World",
    backgroundColor: '#0A3D0A',
  },
  {
    image: images.leafPath,
    title: "Identify Plants\nwith Ease",
    description: "Snap a photo and get instant identification of plants, trees, and flowers in your surroundings",
    backgroundColor: '#1A5E1A',
  },
];

const Onboarding = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      } else {
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    return (
      <Animated.View style={[styles.itemContainer, { backgroundColor: item.backgroundColor }]}>
        <Animated.Image
          source={item.image}
          style={[styles.image, { transform: [{ scale }] }]}
          resizeMode="cover"
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, { transform: [{ scale }], opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0A3D0A" style="light" />
      
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />

      {renderDots()}

      <View style={styles.footer}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={() => setShowButton(true)}
        >
          <Ionicons name="arrow-forward-circle" size={60} color="white" />
        </TouchableOpacity>
        {showButton && (
          <CustomButton
            title="Start Exploring"
            containerStyles={styles.button}
            handlePress={async () => {
              await AsyncStorage.setItem('onboardingStatus', 'true');
              router.replace('/(auth)/auth');
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3D0A',
  },
  itemContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 30,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  description: {
    fontSize: 18,
    color: '#e5e5e5',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 30,
  },
  arrowButton: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.secondary,
    width: '80%',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 220,
    width: '100%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
});

export default Onboarding;