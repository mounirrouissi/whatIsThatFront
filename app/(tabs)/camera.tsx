import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-deck-swiper';
import { uploadImageToR2, identifyImage } from '../services/uploadService';
import { Identification } from '../types';

const placeholderImage = require('../../assets/images/favicon.png');

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [identifications, setIdentifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('plant');
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');

  const categories = [
    { label: 'Anything', emoji: '🌎', value: 'anything' }, // Default
    { label: 'Plants', emoji: '🌱', value: 'plant' },
    { label: 'Animals', emoji: '🐾', value: 'animal' },
    { label: 'Bugs', emoji: '🐛', value: 'bug' },
    { label: 'Birds', emoji: '🐦', value: 'bird' },
    { label: 'Rocks', emoji: '🪨', value: 'rock' },
  ];

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      await handleUploadAndIdentify(photo.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleUploadAndIdentify = async (uri) => {
    setIsLoading(true);
    try {
      const imageUrl = await uploadImageToR2(uri);
      const { identifications, imageUrls } = await identifyImage(imageUrl, selectedCategory);

      if (Array.isArray(identifications) && Array.isArray(imageUrls)) {
        const updatedIdentifications = identifications.map((item, index) => ({
          ...item,
          imageUrl: imageUrls[index] || placeholderImage,
        }));
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.errorText}>No access to camera or gallery</Text>;
  }

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.resultContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          {description ? <Text style={styles.description}>Description: {description}</Text> : null}
          {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
          {identifications.length > 0 && (
            <Swiper
              cards={identifications}
              renderCard={(card) => (
                <View style={styles.card}>
                  <Image 
                    source={{ uri: card.imageUrl }} 
                    style={styles.cardImage} 
                    defaultSource={placeholderImage}
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
              backgroundColor={'transparent'}
              stackSize={3}
              infinite
              animateCardOpacity
              swipeBackCard
            />
          )}
          <TouchableOpacity style={styles.backButton} onPress={() => setImage(null)}>
            <Text style={styles.backButtonText}>Take Another Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
           <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.gradient}
      >
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryButton,
                selectedCategory === category.value && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.circleButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse-sharp" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
   // Updated Category Styles
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 30, // More rounded for emojis
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: 'white',
  },
  categoryEmoji: {
    fontSize: 30, // Larger font size for emojis
  },

  categoryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  imagePreview: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: 'black',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    height: '80%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textContainer: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  rateContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4FD0E9',
    padding: 8,
    borderRadius: 15,
  },
  cardRate: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});