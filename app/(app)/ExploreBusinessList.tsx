import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import EncyclopediaCard from "@/components/EncyclopediaCard";
import { router, useLocalSearchParams } from "expo-router";
import { useSupabase} from '@/context/SupabaseContext'; // Adjust the import path as needed

export default function EncyclopediaList() {
  const { someParam } = useLocalSearchParams();
  const {fetchEncyclopediaEntriesByCategory} = useSupabase(); // Adjust the import path as needed
  const [businessList, setBusinessList] = useState<any[]>([]);
console.log("someParam", someParam +"");  
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data");
      try {
        if (fetchEncyclopediaEntriesByCategory) {
          const data = await fetchEncyclopediaEntriesByCategory(someParam as string); // Replace 'Animals' with your desired category
          const formattedData = data.map((item: any, index: number) => ({
            id: index.toString(),
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
