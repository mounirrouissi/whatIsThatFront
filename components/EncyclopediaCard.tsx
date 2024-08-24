import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function EncyclopediaCard({ business }) {
  const router = useRouter();

  const handlePress2 = () => {
    console.log("pressed");
    // Pass the entire business object as a parameter
    router.push({
      pathname: '/(app)/BusinessDetail',
      params: { business: JSON.stringify(business) },
    });
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
            color: "#007aff",
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
