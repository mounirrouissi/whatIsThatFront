import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { client } from "@/utils/supabaseClient";

const Intro = ({ business }: { business: any }) => {
  const router = useRouter();
  const { addFavorite, removeFavorite } = useSupabase()
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const checkFavoriteStatus = async () => {
    if (user && business) {
      const { data } = await client
        .from('user_favorites')
        .select()
        .eq('user_id', user.id)
        .eq('encyclopedia_entry_id', "053f2f5b-8b22-4d45-9f36-67e99e3e03b5")
        .single();
      setIsFavorite(!!data);
      console.log("is favorite", data);
    }
  };

  const toggleFavorite = async () => {
    console.log("toggling favorite");
    console.log("user", user);
    console.log("business", business);
    if (!user || !business) return;

    try {
      if (isFavorite) {
        setIsFavorite(!isFavorite);
        await removeFavorite(user.id, business.id);
      } else {
        setIsFavorite(!isFavorite);
        await addFavorite(user.id, business.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
      setIsFavorite(!isFavorite);
    }
  };
  
  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const onDelete = () => {
    Alert.alert(
      "Do you want to Delete?",
      "Do you really want to Delete this business?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBusiness(),
        },
      ]
    );
  };

  const deleteBusiness = async () => {
    console.log("Deleted Business");
    // Add your delete logic here
    router.push("/(app)/EncyclopediaEntries");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: business?.imageUrl || "https://via.placeholder.com/300x200?text=No+Image" }}
        style={styles.image}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(app)/EncyclopediaEntries")} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#FF6B6B" : "white"} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{business?.name}</Text>
          <Text style={styles.businessAddress}>{business?.address}</Text>
        </View>
        {user?.primaryEmailAddress?.emailAddress === business?.userEmail && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const Fact = ({ facts }: { facts: Array<{ fact: string }> }) => {
  return (
    <View style={styles.factContainer}>
      {facts.length > 0 ? (
        facts.map((fact, index) => (
          <LinearGradient
            key={index}
            colors={['#81C784', '#4CAF50']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.factItem, { marginBottom: index === facts.length - 1 ? 0 : 15 }]} 
          >
            <Text style={styles.factText}>{fact.fact}</Text>
          </LinearGradient>
        ))
      ) : (
        <Text style={styles.noFactsText}>No facts available</Text>
      )}
    </View>
  );
};

export default function BusinessDetail() {
  const { business } = useGlobalSearchParams();
  const [businessDetail, setBusinessDetail] = useState(null);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchFactsByEncyclopediaEntryId } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      if (business) {
        const parsedBusiness = JSON.parse(business);
        setBusinessDetail(parsedBusiness);

        try {
          const fetchedFacts = await fetchFactsByEncyclopediaEntryId(parsedBusiness.id);
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
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        businessDetail && (
          <View style={styles.businessDetailContainer}>
            <Intro business={businessDetail} />
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Facts</Text>
              <Fact facts={facts} />
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  businessDetailContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Roboto',
  },
  factContainer: {
    marginTop: 10,
  },
  factItem: {
    borderRadius: 10, 
    padding: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  factText: {
    fontSize: 16, 
    color: '#FFFFFF',
    lineHeight: 24, 
    fontWeight: '500', 
    fontFamily: 'Roboto',
  },
  noFactsText: {
    fontSize: 16, 
    color: '#757575', 
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    fontFamily: 'Roboto',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, 
    height: 150, 
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    padding: 20,
    backgroundColor: '#1E1E1E', 
    marginTop: -50, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5, 
    fontFamily: 'Roboto',
  },
  businessAddress: {
    fontSize: 16,
    color: '#BBBBBB',
    fontFamily: 'Roboto',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
});
