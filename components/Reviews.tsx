import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    Image,
  } from "react-native";
  import React, { useState } from "react";
//   import { Rating } from "react-native-ratings";
import primary from "@/constants/Colors";
  import { useUser } from "@clerk/clerk-expo";
  
  export default function Reviews({ business }: { business: any }) {
    const [rating, setRating] = useState(4);
    const [userInput, setUserInput] = useState<string | undefined>();
    const { user } = useUser();
  
    const onSubmmit = () => {
      // Firebase functionality removed as per instructions
      // ToastAndroid.show("Comment Added Successfully !", ToastAndroid.BOTTOM);
    };
  
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          Reviews
        </Text>
        <View>
          
          <TextInput
            placeholder="Write your review"
            numberOfLines={4}
            onChangeText={(value) => setUserInput(value)}
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              borderColor: primary.primary,
              textAlignVertical: "top",
            }}
          />
          <TouchableOpacity
            disabled={!userInput}
            onPress={onSubmmit}
            style={{
              padding: 10,
              backgroundColor: primary.primary,
              borderRadius: 6,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
  
        {/* Display Previous reviews  */}
        <View>
          {business?.reviews?.map((item: any, index: number) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                padding: 10,
                borderWidth: 1,
                borderColor: primary.primary,
                borderRadius: 15,
                marginTop: 10,
              }}
            >
              <Image
                source={{ uri: item.userImage }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 99,
                }}
              />
              <View
                style={{
                  display: "flex",
                  gap: 5,
                }}
              >
                <Text style={{ fontFamily: "outfit-medium" }}>
                  {item.userName}
                </Text>
                
                <Text>{item.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }