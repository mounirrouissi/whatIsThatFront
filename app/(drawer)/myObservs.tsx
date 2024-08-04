import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';

const MyObservs = () => {
  const categories = ['Animals', 'Birds', 'Plants'];
  
  const renderCategory = (category) => {
    // Dummy data for each category
    const items = Array.from({length: 10}, (_, i) => `${category} ${i + 1}`);

    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <FlatList
          horizontal
          data={items}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {categories.map(category => renderCategory(category))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

export default MyObservs;