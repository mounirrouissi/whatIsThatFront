import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSupabase } from '@/context/SupabaseContext'; // Adjust the import path as needed
import { Identification } from '@/types/enums'; // Adjust the import path as needed
import { client } from '@/utils/supabaseClient';
import { useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';

interface IdentificationData {
  id: number;
  user_id: string;
  image_url: string;
  species_id: string;
  identified_at: string;
  type: string;
}

export default function TabOneScreen() {
  const [identifications, setIdentifications] = useState<IdentificationData[]>([]);
  const { getIdentifications, userId } = useSupabase();
 const {signOut} = useClerk()

  const handleLogout = async () => {
    try {
      await signOut();
                    router.push('/(auth)/auth');

      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  useEffect(() => {
    fetchIdentifications();
  }, []);

  const fetchIdentifications = async () => {
    console.log('Fetching identifications...');
    console.log("user id "+userId);

    // should use the context 
    const data= await getIdentifications(userId as string)
    
    
    console.log("data: "+ JSON.stringify(data)); 

   if (data) {
    setIdentifications(data);
    console.log("data: "+ JSON.stringify(data)); 
  }


    
    /* if (userId && getIdentifications) {
      try {
        const data = await getIdentifications(userId);
        setIdentifications(data);
      } catch (error) {
        console.error('Error fetching identifications:', error);
      }
    } */
  };
//TODO use transition and a gallery of images 
  const renderItem = ({ item }: { item: Identification }) => (
    <View style={styles.item}>
      <Image 
        source={{ uri: item.image_url || 'https://via.placeholder.com/10' }} 
        style={styles.itemImage}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.type}</Text>
        <Text style={styles.itemDate}>{new Date(item.identified_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={handleLogout}>

        <Image
          source={{ uri: 'https://images.dog.ceo//breeds//poodle-miniature//n02113712_8473.jpg' }} // Replace with actual user image URL
          style={styles.userImage}
        />
</TouchableOpacity>        
      </View>
      <Text style={styles.title}>Latest Identifications</Text>
      <FlatList
        data={identifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  header: {
    alignItems: 'baseline',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
});