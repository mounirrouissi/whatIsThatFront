import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { client as supabase } from '@/utils/supabaseClient';
import { useSupabase } from '@/context/SupabaseContext';
import { useAuth } from '@clerk/clerk-expo';
import { IdentificationDB } from '../../types';
import IdentificationDetails from '@/components/IdentificationDetails';
import { Link, useRouter } from 'expo-router';
import { Observation } from '@/app/types';

export const Observations = () => {
  const categories = ['animal', 'bird', 'plant'];
  const [data, setData] = useState<{ [key: string]: IdentificationDB[] }>({});
  const [favorites, setFavorites] = useState<IdentificationDB[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const { getFavoritesByUserId } = useSupabase();
  const [selectedIdentification, setSelectedIdentification] = useState<IdentificationDB | null>(null);
  const router = useRouter();

  const handlePress = (observation: Observation) => {
    console.log("observation", observation);
    router.push({
      pathname: '(modals)/observationDetail',
      params: { observation: JSON.stringify(observation),
        category: observation.type // Add this line to pass the category

       },
    });
  };
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

        //   console.log("data: " + JSON.stringify(identifications[0].common_name));
          if (error) {
            console.error(`Error fetching data for category ${category}:`, error);
            throw error;
          }

          fetchedData[category] = identifications || [];
        }

        // Fetch favorites
        const favoriteIds = await getFavoritesByUserId(userId);
        
        const favoriteEntries = await supabase
          .from('encyclopedia_entries')
          .select('*')
          .in('id', favoriteIds.map((fav) => fav.encyclopedia_entry_id));

        setFavorites(favoriteEntries.data || []);

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
  }, [userId, categories]);

  const renderCategory = (category: string) => {
    const items = data[category] || [];
    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
        <FlatList
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            item.image_url != null ? (
             
              <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => handlePress(item)}
              >
                <Image 
                  source={{ uri: item.image_url }} 
                  style={styles.image} 
                />
                <Text style={styles.itemText} numberOfLines={1}>{item.type || 'Unknown'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.itemContainer}>
                <View style={styles.image} /> 
                <Text style={styles.itemText}>Loading...</Text> 
              </View>
            )
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  const renderFavorites = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>Favorites</Text>
      <FlatList
        data={favorites}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => setSelectedIdentification(item)}
          >
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.image} 
            />
            <Text style={styles.itemText} numberOfLines={1}>{item.name || 'Unknown'}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  const renderSkeleton = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.categoryContainer}>
          <View style={[styles.skeletonText, { width: '40%', height: 24, marginBottom: 12 }]} />
          <FlatList
            data={[...Array(5)]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={() => (
              <View style={styles.itemContainer}>
                <View style={[styles.image, styles.skeletonImage]} />
                <View style={[styles.skeletonText, { width: '80%', height: 16 }]} />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {loading ? renderSkeleton() : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderFavorites()}
          {categories.map(renderCategory)}
        </ScrollView>
      )}
      {selectedIdentification && (
        <IdentificationDetails 
          identification={selectedIdentification} 
          onClose={() => setSelectedIdentification(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  skeletonText: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonImage: {
    backgroundColor: '#E1E9EE',
  },
});

export default Observations;
