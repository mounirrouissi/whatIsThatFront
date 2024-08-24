import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import  primary  from "../constants/Colors";
import { useRouter } from "expo-router";

export default function BusinessListCard({ business }) {
  const router = useRouter();
  const handlePress = () => {
    console.log("pressed");
    router.push('/(app)/ExploreBusinessList');
  };const handlePress2 = () => {
    console.log("pressed");
    router.push('/(app)/BusinessDetail');
  };
  return (
    <TouchableOpacity
    
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 15,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
      // onPress={() => router.push("/businessdetail/" + business.id)}
      onPress={handlePress2}
    >
      <Image
        source={{ uri: business.imageUrl }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 15,
        }}
      />
      <View style={{ flex: 1, gap: 7 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          {business.name}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            color: primary.primary,
            fontSize: 15,
          }}
        >
          {business.address}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Image
            source={{ uri: "https://via.placeholder.com/300x200?text=Hi" }}
            style={{
              width: 15,
              height: 15,
            }}
          />
          <Text style={{ fontFamily: "outfit" }}>4.5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}