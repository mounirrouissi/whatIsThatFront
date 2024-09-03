import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { client as supabase } from '@/utils/supabaseClient';
import { useSupabase } from '@/context/SupabaseContext';
import { IdentificationDB, Observation } from '@/app/types';
import IdentificationDetails from '@/components/IdentificationDetails';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const Observations = () => {
  const categories = ['Favorites', 'Animal', 'Bird', 'Plant'];
  const [data, setData] = useState<{ [key: string]: IdentificationDB[] }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const { getFavoritesByUserId } = useSupabase();
  const [selectedIdentification, setSelectedIdentification] = useState<IdentificationDB | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      let fetchedData: { [key: string]: any[] } = {};
      for (let category of categories.slice(1)) { // Skip 'Favorites'
        const { data: identifications, error } = await supabase
          .from('identifications')
          .select('*')
          .eq('type', category.toLowerCase())
          .eq('user_id', userId)
          .order('identified_at', { ascending: false });

        if (error) throw error;
        fetchedData[category] = identifications || [];
      }

      // Fetch favorites
      const favoriteIds = await getFavoritesByUserId(userId);
      const favoriteEntries = await supabase
        .from('encyclopedia_entries')
        .select('*')
        .in('id', favoriteIds.map((fav) => fav.encyclopedia_entry_id));

      fetchedData['Favorites'] = favoriteEntries.data || [];

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handlePress = (observation: Observation) => {
    router.push({
      pathname: '(modals)/observationDetail',
      params: { 
        observation: JSON.stringify(observation),
        category: observation.type
      },
    });
  };

  const renderItem = ({ item }: { item: IdentificationDB }) => (
    <AnimatedTouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handlePress(item)}
      entering={FadeInRight}
      layout={Layout.springify()}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={styles.gradient}
      >
        <Text style={styles.itemText} numberOfLines={1}>
          {item.common_name || item.name || 'Unknown'}
        </Text>
      </LinearGradient>
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.image}
      />
    </AnimatedTouchableOpacity>
  );

  const renderCategory = ({ item: category }: { item: string }) => (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data[category] || []}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderSkeleton = () => (
    <FlatList
      data={categories}
      renderItem={() => (
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <View style={[styles.skeletonText, { width: '40%', height: 24 }]} />
            <View style={[styles.skeletonText, { width: '20%', height: 18 }]} />
          </View>
          <FlatList
            data={[...Array(5)]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={() => (
              <View style={[styles.itemContainer, styles.skeletonItem]}>
                <View style={[styles.image, styles.skeletonImage]} />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.categoryList}
          />
        </View>
      )}
      keyExtractor={(item) => item}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? renderSkeleton() : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Observations</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }} />
          }
        />
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
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 8,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: 150,
    height: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  skeletonText: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonItem: {
    backgroundColor: '#E1E9EE',
  },
  skeletonImage: {
    backgroundColor: '#E1E9EE',
  },
});

export default Observations;