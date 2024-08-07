import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ImageSourcePropType, Image } from 'react-native';
import { 
  launchCameraAsync, 
  launchImageLibraryAsync, 
  useCameraPermissions, 
  useMediaLibraryPermissions,
  CameraPermissionResponse,
  MediaLibraryPermissionResponse,
} from 'expo-image-picker';
import Swiper from 'react-native-deck-swiper';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import { uploadImageToR2, identifyImage } from '../services/uploadService';
import { Identification, BackendResponse } from '../types';

const placeholderImage: ImageSourcePropType = require('../../assets/images/favicon.png'); // Replace with your actual placeholder image

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [identifications, setIdentifications] = useState<Identification[]>([]); // Store identifications
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraStatus: CameraPermissionResponse  = await requestCameraPermission();
        const mediaLibraryStatus: MediaLibraryPermissionPermissionResponse = await requestMediaLibraryPermission();

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
      const { identifications, imageUrls } = await identifyImage(imageUrl);
      console.log("identification response received", identifications);

      if (Array.isArray(identifications) && Array.isArray(imageUrls)) {
        const updatedIdentifications = identifications.map((item, index) => ({
          ...item,
          imageUrl: imageUrls[index] || placeholderImage,
        }));
        updatedIdentifications.forEach((item) => {
          console.log("Identification image URL:", item.imageUrl);
        });
        setIdentifications(updatedIdentifications);
        setDescription(updatedIdentifications[0].identif);
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
      />
      {description ? <Text style={styles.description}>Description: {description}</Text> : null}
      {isLoading && <Text>Loading...</Text>}
      {identifications.length > 0 && (
        <Swiper
          cards={identifications}
          renderCard={(card: Identification) => (
            <View style={styles.card}>
              <Image 
                source={{ uri: card.imageUrl }} 
                style={styles.cardImage} 
                defaultSource={placeholderImage} // Add a placeholder image
              />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{card.identif}</Text>
                <View style={styles.rateContainer}>
                  <Text style={styles.cardRate}>{card["identif success"]}</Text>
                </View>
                {card.facts.map((fact, index) => (
                  <Text key={index} style={styles.cardDescription}>{fact}</Text>
                ))}
              </View>
            </View>
          )}
          onSwiped={(cardIndex) => {
            console.log(cardIndex + ' swiped');
          }}
          onSwipedAll={() => { console.log('All cards swiped'); }}
          cardIndex={0}
          backgroundColor={'#4FD0E9'}
          stackSize={3}
          infinite
          animateCardOpacity
          swipeBackCard
        />
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
    backgroundColor: '#f0f0f0',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#262628',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  cardImage: {
    marginTop: 10,
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    resizeMode: 'cover', // Ensure the image covers the area
  },
  textContainer: {
    marginTop: 5,
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  rateContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4FD0E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRate: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});