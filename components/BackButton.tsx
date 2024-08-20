// BackButton.js

import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ onBackPress }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBackPress(); // Call the provided callback when back button is pressed
      return true; // Prevent default back action
    });

    return () => {
      backHandler.remove(); // Clean up the event listener when component unmounts
    };
  }, [onBackPress]);

  return (
    <TouchableOpacity onPress={onBackPress}>
      <Ionicons name="arrow-back" size={24} color="black"  style={{padding:10}}/>
    </TouchableOpacity>
  );
};

export default BackButton;
