import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { client as supabase } from '@/utils/supabaseClient';
import { useSupabase } from '@/context/SupabaseContext';
import { useAuth } from '@clerk/clerk-expo';
import { IdentificationDB } from '../../types';
import IdentificationDetails from '@/components/IdentificationDetails';
export const MyObservs = () => {
  const categories = ['animal', 'bird', 'plant'];
  const [data, setData] = useState<{ [key: string]: IdentificationDB[] }>({});
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const [selectedIdentification, setSelectedIdentification] = useState<IdentificationDB | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting to fetch data...');
      try {
        let fetchedData: { [key: string]: any[] } = {};
        for (let category of categories) {
          console.log(`Fetching data for category: ${category}`);

          const { data: identifications, error } = await supabase
            .from('identifications')
            .select('*')
            .eq('type', category)
            .eq('user_id', userId)
            .order('identified_at', { ascending: false });

          console.log("data: " + JSON.stringify(identifications));
          if (error) {
            console.error(`Error fetching data for category ${category}:`, error);
            throw error;
          }

          fetchedData[category] = identifications || [];
        }
        console.log('Data fetching completed.');
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setLoading(false);
        console.log('Loading state set to false.');
      }
    };

    fetchData();
  }, [userId]);

  const renderCategory = (category: string) => {
    const items = data[category] || [];
    return (
      <View key={category}>
        <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
        <FlatList
          data={items}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.itemContainer}> 
              {/* Placeholder for image */}
              <View style={styles.image} /> 
              {/* Placeholder for text */}
              <Text style={styles.itemText}>Loading...</Text> 
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} 
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView>
          {categories.map(renderCategory)}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#eee', // Placeholder background color
    borderRadius: 5,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default MyObservs; 