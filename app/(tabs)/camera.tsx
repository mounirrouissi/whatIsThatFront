import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ImageSourcePropType } from 'react-native';
import { 
  launchCameraAsync, 
  launchImageLibraryAsync, 
  useCameraPermissions, 
  useMediaLibraryPermissions,
  CameraPermissionsResponse,
  MediaLibraryPermissionsResponse,
} from 'expo-image-picker';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import { uploadImageToR2, identifyImage } from '../services/uploadService';
import { Identification, BackendResponse } from '../types';

const placeholderImage: ImageSourcePropType = require('../../assets/images/favicon.png'); // Replace with your actual placeholder image

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const [searchImageUrl, setSearchImageUrl] = useState<string | null>(null); // Store the search image URL
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraStatus: CameraPermissionsResponse  = await requestCameraPermission();
        const mediaLibraryStatus: MediaLibraryPermissionsResponse = await requestMediaLibraryPermission();

        if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
          alert('Sorry, we need camera and library permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleTakePicture = async () => {
    const result = await launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleUploadAndIdentify(uri);
    }
  };

  const handleChooseFromGallery = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleUploadAndIdentify(uri);
    }
  };

  const handleUploadAndIdentify = async (uri: string) => {
    setIsLoading(true);
    try {
      const imageUrl = await uploadImageToR2(uri);
      console.log("imageUrl: " + imageUrl);
      const { identifications, imageUrl: returnedImageUrl } = await identifyImage(imageUrl);
      console.log("identification response received", identifications);
      console.log("imageUrl: " + imageUrl);

      if (Array.isArray(identifications)) {
        identifications.forEach((item: Identification) => {
          console.log(`Identified: ${item.identif}`);
          console.log(`Success Rate: ${item["identif success"]}`);
          console.log('Facts:');
          item.facts.forEach(fact => console.log(`- ${fact}`));
        });
        setDescription(identifications[0].identif);
        setSearchImageUrl(returnedImageUrl); // Set the search image URL

      } else {
        console.error('Unexpected response format:', identifications);
        setDescription('Failed to identify image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setDescription('Failed to identify image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImagePickerComponent
        onCameraPress={handleTakePicture}
        onGalleryPress={handleChooseFromGallery}
        image={image ? { uri: image } : null}
        placeholderImage={placeholderImage}
        searchImageUrl={searchImageUrl} // Pass the search image URL

      />
      {description ? <Text style={styles.description}>Description: {description}</Text> : null}
      {isLoading && <Text>Loading...</Text>}
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
  description: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});