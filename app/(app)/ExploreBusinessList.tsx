import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import BusinessListCard from "@/components/BusinessListCard";
import { router } from "expo-router";
const handlePress = () => {
    console.log("pressed");
    router.push('/(app)/ExploreBusinessList');
  };
const dummyBusinessList = [
  {
    id: "1",
    name: "Business One",
    address: "123 Main St",
    imageUrl: "https://example.com/business1.jpg",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Business Two",
    address: "456 Elm St",
    imageUrl: "https://example.com/business2.jpg",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Business Three",
    address: "789 Oak St",
    imageUrl: "https://example.com/business3.jpg",
    rating: 4.8,
  },{
    id: "3",
    name: "Business Three",
    address: "789 Oak St",
    imageUrl: "https://example.com/business3.jpg",
    rating: 4.8,
  },{
    id: "3",
    name: "Business Three",
    address: "789 Oak St",
    imageUrl: "https://example.com/business3.jpg",
    rating: 4.8,
  },{
    id: "3",
    name: "Business Three",
    address: "789 Oak St",
    imageUrl: "https://example.com/business3.jpg",
    rating: 4.8,
  },{
    id: "3",
    name: "Business Three",
    address: "789 Oak St",
    imageUrl: "https://example.com/business3.jpg",
    rating: 4.8,
  },
];

export default function ExploreBusinessList() {
  return (
    <ScrollView>
      <FlatList
        data={dummyBusinessList}
        scrollEnabled
        renderItem={({ item, index }) => (
          <BusinessListCard key={index} business={item}   />
        )}
      />
      <View
        style={{
          height: 100,
        }}
      ></View>
    </ScrollView>
  );
}