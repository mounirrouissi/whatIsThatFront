import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

export default function TabOneScreen() {
  // Dummy data for the list
  const identifications = [
    { id: '1', title: 'Identification 1' },
    { id: '2', title: 'Identification 2' },
    { id: '3', title: 'Identification 3' },
    { id: '4', title: 'Identification 3' },
    { id: '5', title: 'Identification 3' },
    { id: '6', title: 'Identification 3' },
    { id: '7', title: 'Identification 3' },
    { id: '8', title: 'Identification 3' },
    { id: '9', title: 'Identification 3' },
    // Add more items as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
   
   

   
      <Text style={styles.title}>Latest Identifications</Text>
      <FlatList
        data={identifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  header: {
    alignItems: 'baseline',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});