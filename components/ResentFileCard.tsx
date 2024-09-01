import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  LinearTransition,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { router, useNavigation, useRouter } from "expo-router";
import React from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IconObject } from "@/app/types";

export default function RecentFileCard({ iconObject }: { iconObject: IconObject }) {
  const router = useRouter();
  const theme = useColorScheme();

  const handlePress = () => {
    console.log("pressed"+iconObject.name);
    router.push({
        pathname: '/(app)/EncyclopediaEntries',
        params: { categoryName: iconObject.name }
      });
  };

  return (
    <Animated.View
      layout={LinearTransition}
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={[styles.container, { backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}
    >
      <TouchableOpacity style={styles.touchable} onPress={handlePress}>
        <LinearGradient
          colors={["#4A90E2", "#50E3C2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={iconObject.icon}
              size={56}
              color="white"
              style={styles.icon}
            />
          </View>
        </LinearGradient>
        <View style={[styles.textContainer, { backgroundColor: theme === 'dark' ? '#2C2C2C' : '#FFFFFF' }]}>
          <Text style={[styles.title, { color: theme === 'dark' ? '#FFFFFF' : '#333333' }]}>
            {iconObject.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 240,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
    overflow: 'hidden',
    margin: 15,
    transform: [{ scale: 1 }],
  },
  touchable: {
    flex: 1,
    activeOpacity: 0.7,
  },
  gradient: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 30,
    padding: 20,
  },
  icon: {
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontWeight: "700",
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
});
