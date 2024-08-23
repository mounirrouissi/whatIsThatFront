import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { uploadImageToR2, identifyImage } from '../../services/uploadService';
import { Identification, IdentificationResponse } from '../../types';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { client as supabase } from '@/utils/supabaseClient';
import { useSupabase } from '@/context/SupabaseContext';
import BackButton from '@/components/BackButton';
import { useNavigation } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import Swiper from 'react-native-deck-swiper';

const placeholderImage = require('@/assets/images/favicon.png');

function camera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [identifications, setIdentifications] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('plant');
  const [facing, setFacing] = useState('back');
  const [swipedCount, setSwipedCount] = useState(0);

  const cameraRef = useRef(null);
  const { userId } = useAuth();
  const { getUserById, insertUser, createIdentification } = useSupabase();
  const navigation = useNavigation();

  const categories = [
    { label: 'Anything', emoji: '🌎', value: 'anything' },
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
      setError(null)
    })();
  }, []);

  const handleUploadAndIdentify = useCallback(async (uri) => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await uploadImageToR2(uri);
      console.log("Uploading image to R2 is done");
      const identifications = await identifyImage(imageUrl, selectedCategory);
      console.log("identifications = ", identifications);

      let user = await getUserById(userId);
      if (!user) {
        await insertUser(userId, 'test@gmail.com');
      }

      if (Array.isArray(identifications)) {
        const updatedIdentifications = identifications.map((item, index) => ({
          ...item,
          imageUrl: index === 0 ? item.imageUrl : null,
        }));

        for (let i = 0; i < updatedIdentifications.length; i++) {
          const identification = updatedIdentifications[i];
          const identificationData = await createIdentification(
            userId,
            identification.imageUrl || imageUrl,
            null,
            selectedCategory,
            i + 1,
            imageUrl
          );
          const identificationId = identificationData[0].id;

          for (let j = 0; j < identification.facts.length; j++) {
            const fact = identification.facts[j];
            const { error: factError } = await supabase.from('facts').insert({
              identification_id: identificationId,
              fact: fact,
              fact_number: j + 1,
            });

            if (factError) throw factError;
          }
        }

        setIdentifications(updatedIdentifications);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error('Error handling upload and identification:', error);
      setError('An error occurred while processing the image');
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedCategory, getUserById, insertUser, createIdentification]);

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        await handleUploadAndIdentify(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        setError('An error occurred while taking the picture');
      }
    }
  }, [handleUploadAndIdentify]);

  const pickImage = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error('Error picking image:', error);
      setError('An error occurred while picking the image');
    }
  }, [handleUploadAndIdentify]);

  const handleSwiped = useCallback(() => {
    setSwipedCount(prevCount => prevCount + 1);
  }, []);

  const handleSwipedAll = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setImage(null);
    navigation.navigate('/(app)/home');
  }, [navigation]);

  const toggleCameraFacing = useCallback(() => {
    setFacing(prevFacing => prevFacing === 'back' ? 'front' : 'back');
  }, []);

  const renderCard = useCallback((card, index) => (
    <View style={styles.card}>
      {index === 0 && card.imageUrl && (
        <Image 
          source={{ uri: card.imageUrl }} 
          style={styles.cardImage} 
          resizeMode="cover"
          defaultSource={placeholderImage} 
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{card.identif}</Text>
        <View style={styles.rateContainer}>
          <Text style={styles.cardRate}>{card['identif success']}</Text>
        </View>
        <ScrollView style={styles.factsScrollView}>
          {card.facts.map((fact, factIndex) => (
            <View key={factIndex} style={styles.factContainer}>
              <Ionicons name="checkmark-circle" size={18} color="#4FD0E9" />
              <Text style={styles.cardDescription}>{fact}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  ), []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text style={styles.errorText}>No access to camera or gallery</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Identifying image...</Text>
        </View>
      )}
      <BackButton onBackPress={() => navigation.goBack()} />

      {image ? (
        <View style={styles.resultContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          {identifications && identifications.length > 0 && (
            <Swiper
              cards={identifications}
              renderCard={renderCard}
              onSwiped={handleSwiped}
              onSwipedAll={handleSwipedAll}
              cardIndex={0}
              backgroundColor={'transparent'}
              stackSize={3}
              infinite={false}
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
          <View style={styles.categoryContainer}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item.value && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(item.value)}
                >
                  <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
              horizontal
              contentContainerStyle={styles.categoryContainer}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.circleButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-sharp" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {!image && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            To identify an object, either take a picture or select an image from your gallery.
          </Text>
          <Text style={styles.instructionsText}>
            For best results, make sure the object is in focus and well-lit.
          </Text>
        </View>
      )}

      {isSaving && (
        <View style={styles.savingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.savingText}>The identification is being saved...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,

    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: 'white',
  },
  categoryEmoji: {

    fontSize: 30,
  },

  categoryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
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


    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#000',
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
  },
  instructionsContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },

  card: {
    height: '100%',



    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,  // Adjust as needed
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 15,
  },
  factsScrollView: {
    flexGrow: 1,
  },
  savingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  
  
  cardTitle: {

    fontSize: 28,
    fontWeight: 'bold',

    marginBottom: 15,
    color: '#333',
  },
  cardDescription: {

    fontSize: 18,
    color: '#666',

    marginBottom: 8,
    marginLeft: 10,
  },
  rateContainer: {
    position: 'absolute',


    top: 20,
    right: 20,
    backgroundColor: '#4FD0E9',


    padding: 10,
    borderRadius: 20,
  },
  cardRate: {
    color: 'white',
    fontWeight: 'bold',

    fontSize: 18,
  },
  factContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 6,
  },

});

export default camera;



