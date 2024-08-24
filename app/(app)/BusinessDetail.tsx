import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext'; // Ensure this import is correct
import Intro from '@/components/Intro';
import Fact from '@/components/Fact';
import Reviews from '@/components/Reviews';
import React from 'react';

export default function BusinessDetail() {
  const { business } = useLocalSearchParams();
  const [businessDetail, setBusinessDetail] = useState(null);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchFactsByEncyclopediaEntryId } = useSupabase(); // Ensure this import is correct

  useEffect(() => {
    const fetchData = async () => {
      if (business) {
        const parsedBusiness = JSON.parse(business);
        setBusinessDetail(parsedBusiness);

        try {
          const fetchedFacts = await fetchFactsByEncyclopediaEntryId("8b44b686-88f1-474b-b44f-129b5d4df6e7");
          setFacts(fetchedFacts);
        } catch (error) {
          console.error('Error fetching facts:', error);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [business]);

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          style={{
            marginTop: "70%",
          }}
          size={"large"}
          color={"#007aff"}
        />
      ) : (
        businessDetail && (
          <View>
            {/* Intro */}
            <Intro business={businessDetail} />

            {/* Facts Section */}
            <Fact facts={facts} />

            {/* Reviews Section */}
            <Reviews business={businessDetail} />
          </View>
        )
      )}
    </ScrollView>
  );
}
