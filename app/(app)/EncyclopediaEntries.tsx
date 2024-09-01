import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import EncyclopediaCard from "@/components/EncyclopediaCard";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useSupabase} from '@/context/SupabaseContext'; // Adjust the import path as needed
import { EncyclopediaEntry } from "../types";

export default function EncyclopediaList() {
  const { categoryName } = useGlobalSearchParams();
  const {fetchEncyclopediaEntriesByCategory} = useSupabase(); // Adjust the import path as needed
  const [businessList, setBusinessList] = useState<any[]>([]);
console.log("someParam", categoryName +"");  
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data");
      try {
        if (fetchEncyclopediaEntriesByCategory) {
          const data:EncyclopediaEntry[] = await fetchEncyclopediaEntriesByCategory(categoryName as string); // Replace 'Animals' with your desired category
          console.log("entries are ", data);
          const formattedData = data.map((item: EncyclopediaEntry, index: number) => ({
            id: item.id,
            name: item.name,
            address: item.description, // Adjust if needed
          imageUrl: item.image_url,
          rating: Math.random() * 5, // Replace with actual rating if available
        }));
        setBusinessList(formattedData);
      }
    } catch (error) {
      console.error("Error fetching encyclopedia entries:", error);
    }
  }

    fetchData();
  }, []);

  return (
    <ScrollView>
      <FlatList
        data={businessList}
        scrollEnabled
        renderItem={({ item, index }) => (
          <EncyclopediaCard key={index} business={item} />
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
