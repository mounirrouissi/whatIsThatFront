import React from 'react';
import { View, Text } from 'react-native';

const Fact = ({ facts }) => {
  return (
    <View>
      {facts.length > 0 ? (
        facts.map((fact, index) => (
          <View key={index} style={{ padding: 10 }}>
            <Text>{fact.fact}</Text>
          </View>
        ))
      ) : (
        <Text>No facts available</Text>
      )}
    </View>
  );
};

export default Fact;
