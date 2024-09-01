import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,

    StyleSheet,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import { useUser } from "@clerk/clerk-expo";


  import { useSupabase } from "@/context/SupabaseContext"
  import { client } from "@/utils/supabaseClient";
  import { LinearGradient } from 'expo-linear-gradient';
  
  export default function Intro({ business }: { business: any }) {
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
          source={{ uri: business?.imageUrl || "https://via.placeholder.com/300x200?text=Hi" }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/(app)/EncyclopediaEntries")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>







          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF6B6B" : "white"} 
            />
          </TouchableOpacity>
        </View>
  
























































        <View style={styles.infoContainer}>
          <View>
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    image: {
      width: '100%',
      height: 300,
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 300,
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
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    favoriteButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      marginTop: -25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    businessName: {
      fontSize: 24,
      fontFamily: "oPoppins-bold",
      color: '#333',
    },
    businessAddress: {
      fontSize: 16,
      fontFamily: "oPoppins",
      color: '#666',
      marginTop: 5,
    },
    deleteButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255,107,107,0.1)',
    },
  });