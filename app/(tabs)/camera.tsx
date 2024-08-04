import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Buffer } from 'buffer';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Store the image URL

   const sendImageToBackend = async () =>{
    // send image to backednd
  try {
    console.log(imageUrl)
    const identifyResponse = await axios.post('https://81ec-197-29-254-255.ngrok-free.app/identify', { imageUrl: imageUrl });
    setDescription(identifyResponse.data.description);
    }catch(error){
      console.log("An error occurred  while try to identify the image. " + error)
    }
  }


  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    console.log("uploading image")
    setIsLoading(true);
    try {
      // Read the image file
      const imageFile = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      // Create form data
      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: 'image.jpg',
        data: imageFile
      } as any);

      const base64Image = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      let key = Math.ceil(Math.random() * 1000);
       // 2. Create a Buffer from the base64 string
       const imageBuffer = Buffer.from(base64Image, 'base64');
      console.log(key)
      const uploadResponse = await axios.put(`https://print.mounirrouissi2.workers.dev/${key}`, imageBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-CF-Secret': '123456', // Replace with your secret
        },
      });
      
      
       setImageUrl(`https://print.mounirrouissi2.workers.dev/${key}`);
      //send image url to backend server
       console.log(imageUrl)
       const identifyResponse = await axios.post('https://81ec-197-29-254-255.ngrok-free.app/identify', { imageUrl: imageUrl });
       setDescription(identifyResponse.data.description);                                  
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setDescription('Failed to identify image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Take a Picture" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {isLoading ? (
        <Text>Processing image...</Text>
      ) : (
        description && <Text style={styles.description}>Description: {description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
  },
});


