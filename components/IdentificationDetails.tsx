import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';
import { IdentificationDB } from '../types';

interface IdentificationDetailsProps {
  identification: IdentificationDB;
}

const IdentificationDetails: React.FC<IdentificationDetailsProps> = ({ identification }) => {
  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: identification.imageUrl  }} 
        style={styles.image} 
      />
      <Text style={styles.title}>{identification.speciesId || 'Unknown Species'}</Text>
      <Text style={styles.detail}>Type: {identification.type}</Text>
      <Text style={styles.detail}>Identified At: {new Date(identification.identified_at).toLocaleString()}</Text>
      <Text style={styles.detail}>Resemblance Rank: {identification.resemblance_rank}</Text>
      {/* Add more details as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default IdentificationDetails;