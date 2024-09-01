import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function EncyclopediaCard({ business }) {
  const router = useRouter();

  const handlePress2 = () => {
    console.log("pressed");
    
    router.push({
      pathname: '(app)/EncyclopediaEntryDetail',
      params: { business: JSON.stringify(business) },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: '#fff' }]} 
      onPress={handlePress2}
    >
      <Image
        source={{ uri: business.imageUrl }}
        style={[styles.image, { borderColor: '#ccc' }]} 
      />
      <View style={[styles.textContainer, { backgroundColor: '#f8f8f8' }]}>
        <Text style={styles.title}>
          {business.name}
        </Text>
        <Text style={styles.address}>
          {business.address}
        </Text>
        <View style={styles.rating}>
          <Image
            source={{ uri: "https://via.placeholder.com/300x200?text=Hi" }}
            style={{
              width: 15,
              height: 15,
            }}
          />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    gap: 7,
 
    backgroundColor: '#f8f8f8', 
  },
  title: {
    fontFamily: "Poppins-bold",
    fontSize: 20,
    marginBottom: 5,
  },
  address: {
    fontFamily: "Poppins",
    color: "#007aff",
    fontSize: 15,
  },
  rating: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  ratingText: {
    fontFamily: "Poppins",
  },
});