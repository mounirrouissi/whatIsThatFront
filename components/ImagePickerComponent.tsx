import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Image, ImageSourcePropType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ImagePickerComponentProps {
  onCameraPress: () => void;
  onGalleryPress: () => void;
  image: ImageSourcePropType | null;
  placeholderImage: ImageSourcePropType;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({ onCameraPress, onGalleryPress, image, placeholderImage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image || placeholderImage} style={styles.selectedImage} />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onCameraPress} style={[styles.button, styles.cameraButton]}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGalleryPress} style={[styles.button, styles.galleryButton]}>
          <MaterialIcons name="photo-library" size={24} color="white" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedImage: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cameraButton: {
    backgroundColor: '#007bff',
  },
  galleryButton: {
    backgroundColor: '#28a745',
  },
});

export default ImagePickerComponent;