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
    router.push({
        pathname: '/(app)/EncyclopediaEntries',
        params: { someParam: iconObject.name }
      });
  };
  return (
    <Animated.View
      layout={LinearTransition}
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={styles.container}
    >
      <TouchableOpacity style={styles.touchable} onPress={handlePress}>
        <LinearGradient
          colors={["#007bff", "#00bfff"]}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name={iconObject.icon} size={40} color="white" style={styles.icon} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {iconObject.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

  
const styles = StyleSheet.create({
    container: {
      width: 160,
      height: 200,
      borderRadius: 22, // slightly rounded corners for modern look
      backgroundColor: 'white',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25, // reduced shadow opacity for a softer effect
      shadowRadius: 5.5,
      elevation: 9,
      overflow: 'hidden',
      margin: 10, // balanced margin for layout symmetry
      transform: [{ scale: 1 }], // initial scale
    },
    touchable: {
      flex: 1,
      activeOpacity: 0.8, // reduces opacity on press for better feedback
    },
    gradient: {
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // relative positioning for overlay
    },
    icon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 22,
      padding: 12,
      position: 'absolute',
      zIndex: 1, // elevate icon above overlay
    },
    textContainer: {
      flex: 1,
      padding: 18, // adjusted padding for better content balance
      justifyContent: 'center',
    },
    title: {
      fontWeight: "700",
      fontSize: 18,
      textAlign: 'center',
      color: '#333',
      letterSpacing: 0.5, // adds letter spacing for a polished text appearance
    },
  });
  