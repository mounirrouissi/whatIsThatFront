import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import primary from "@/constants/Colors";
import Intro from "@/components/Intro";
import About from "@/components/About";
import Reviews from "@/components/Reviews";

export default function BusinessDetail() {
  const { businessid } = useLocalSearchParams();
  const [business, setBusiness] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetBsuinessDetailById();
  }, []);

  /**
   * Used to get BusinessDetail by Id
   * For now, using dummy data
   **/
  const GetBsuinessDetailById = async () => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      // Assuming businessid is a string for simplicity
      const dummyBusiness = {
        id: businessid,
        name: "Dummy Business",
        address: "123 Dummy St",
        imageUrl: "https://example.com/dummy.jpg",
        rating: 4.5,
        about: "This is a dummy business for demonstration purposes.",
        reviews: [
          {
            id: "1",
            userName: "John Doe",
            userImage: "https://example.com/user1.jpg",
            comment: "Great service!",
            rating: 5,
          },
          {
            id: "2",
            userName: "Jane Doe",
            userImage: "https://example.com/user2.jpg",
            comment: "Excellent food!",
            rating: 4,
          },
        ],
      };
      setBusiness(dummyBusiness);
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          style={{
            marginTop: "70%",
          }}
          size={"large"}
          color={primary.primary}
        />
      ) : (
        <View>
          {/* Intro */}
          <Intro business={business} />

          {/* Action Buttons */}
        

          {/* About Section  */}
          <About business={business} />

          {/* Reviews Section  */}
          <Reviews business={business} />
        </View>
      )}
    </ScrollView>
  );
}