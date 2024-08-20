import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { client as supabase } from '@/utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { IdentificationDB } from '../../types';
import IdentificationDetails from '@/components/IdentificationDetails';

export const MyObservs = () => {
  // ... (keep existing state and useEffect)
  const categories = ['animal', 'bird', 'plant'];
  const [data, setData] = useState<{ [key: string]: IdentificationDB[] }>({});
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth()


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
  
    
    
      
      
      
      
      
    
    
      
      
    
    
  
  
  

  

  
  

  const [selectedIdentification, setSelectedIdentification] = useState<IdentificationDB | null>(null);

  const renderCategory = (category: string) => {
    const items = data[category] || [];
    return (
      <View key={category}>
        <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
        <FlatList
          data={items}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedIdentification(item)}>
              <View style={styles.itemContainer}>
                <Image 
                  source={{ uri: item.imageUrl.startsWith('data:') ? item.imageUrl : `data:image/jpeg;base64,${item.imageUrl}` }} 
                  style={styles.image} 
                />
                <Text style={styles.itemText}>{item.speciesId || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {categories.map(renderCategory)}
      </ScrollView>
      <Modal
        visible={!!selectedIdentification}
        onRequestClose={() => setSelectedIdentification(null)}
        animationType="slide"
      >
        {selectedIdentification && (
          <IdentificationDetails identification={selectedIdentification} />
        )}
      </Modal>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
export default MyObservs;