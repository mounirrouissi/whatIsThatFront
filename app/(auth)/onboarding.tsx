import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const onboarding = () => {
  const { width, height } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const translateX = useSharedValue(0);
  const router = useRouter();

  const pages = [
    { title: 'Identify Plants', icon: 'leaf', color: ['#43C6AC', '#191654'] },
    { title: 'Discover Animals', icon: 'paw', color: ['#FFD194', '#D1913C'] },
    { title: 'Explore Bugs', icon: 'bug', color: ['#F7971E', '#FFD200'] },
    { title: 'Learn about Mushrooms', icon: 'seedling', color: ['#1D4350', '#A43931'] },
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      translateX.value = withTiming(-width * (currentPage + 1), {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      router.push('(auth)/login');
    }
  };

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.slideContainer, slideStyle, { width: width * pages.length }]}>
        {pages.map((page, index) => (
          <LinearGradient key={index} colors={page.color} style={[styles.slide, { width, height }]}>
            <View style={styles.contentContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name={page.icon} size={64} color="white" />
              </View>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.description}>
                Discover and learn about various {page.title.toLowerCase()} in your surroundings.
              </Text>
            </View>
          </LinearGradient>
        ))}
      </Animated.View>
      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={nextPage} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentPage < pages.length - 1 ? 'Next' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    flexDirection: 'row',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    transform: [{ scale: 1.2 }],
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default onboarding;
