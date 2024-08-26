import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Fact = ({ facts }: { facts: Array<{ fact: string }> }) => {
  return (
    <View style={styles.container}>
      {facts.length > 0 ? (
        facts.map((fact, index) => (
          <View key={index} style={styles.factItem}>
            <Text style={styles.factText}>{fact.fact}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noFactsText}>No facts available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  factText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  noFactsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Fact;