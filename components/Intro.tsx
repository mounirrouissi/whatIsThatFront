import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ToastAndroid,
  } from "react-native";
  import React from "react";
  import { Ionicons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import { useUser } from "@clerk/clerk-expo";
  
  export default function Intro({ business }: { business: any }) {
    const router = useRouter();
  
    const { user } = useUser();
  
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
      router.back();
      // ToastAndroid.show("Business Deleted!", ToastAndroid.LONG);
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            padding: 20,
            marginTop: 20,
            backgroundColor: 'transparent',
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ zIndex: 10 }}>
            <Ionicons name="arrow-back-circle" size={40} color="white" />
          </TouchableOpacity>
          <Ionicons name="heart-outline" size={40} color="white" />
        </View>
  
        <Image
          source={{ uri:  "https://via.placeholder.com/300x200?text=Hi" ||business?.imageUrl }}
          style={{
            width: "100%",
            height: 340,
            marginTop: 20,
          }}
        />
  
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            marginTop: -20,
            backgroundColor: "#fff",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              padding: 20,
              marginTop: -20,
              backgroundColor: "#fff",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontFamily: "outfit-bold",
                color: '#333',
              }}
            >
              {business?.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "outfit",
                color: '#666',
              }}
            >
              {business?.address}
            </Text>
          </View>
          {user?.primaryEmailAddress?.emailAddress === business?.userEmail && (
            <TouchableOpacity onPress={() => onDelete()} style={{ zIndex: 10 }}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }