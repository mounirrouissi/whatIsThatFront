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
    console.log("pressed");
    router.push('/(app)/ExploreBusinessList');
  };
  return (
    <Animated.View
      layout={LinearTransition}
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.container}
    >
      <TouchableOpacity style={styles.touchable}
      onPress={handlePress}>
        <LinearGradient
          colors={["#007bff", "#00bfff"]}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name={iconObject.name} size={32} color="white" style={styles.icon} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {iconObject.icon}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 180,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: 'center',
  },
});
