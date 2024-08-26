import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import Intro from '@/components/Intro';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const Fact = ({ facts }: { facts: Array<{ fact: string }> }) => {
  return (
    <View style={styles.container}>
      {facts.length > 0 ? (
        facts.map((fact, index) => (
          <LinearGradient
            key={index}
            colors={['#81C784', '#4CAF50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.factItem}
          >
            <Text style={styles.factText}>{fact.fact}</Text>
          </LinearGradient>
        ))
      ) : (
        <Text style={styles.noFactsText}>No facts available</Text>
      )}
    </View>
  );
};

export default function BusinessDetail() {
  const { business } = useLocalSearchParams();
  const [businessDetail, setBusinessDetail] = useState(null);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchFactsByEncyclopediaEntryId } = useSupabase();

  useEffect(() => {
    const fetchData = async () => {
      if (business) {
        const parsedBusiness = JSON.parse(business);
        setBusinessDetail(parsedBusiness);

        try {
          const fetchedFacts = await fetchFactsByEncyclopediaEntryId(parsedBusiness.id);
          setFacts(fetchedFacts);
        } catch (error) {
          console.error('Error fetching facts:', error);
        }
        
        setLoading(false);
      }
    };

    fetchData();
  }, [business]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        businessDetail && (
          <View style={styles.businessDetailContainer}>
            <Intro business={businessDetail} />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Facts</Text>
              <Fact facts={facts} />
            </View>

            {/* <Reviews business={businessDetail} /> */}
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    marginTop: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  businessDetailContainer: {
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  factItem: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#81C784',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  factText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    fontWeight: '500',
  },
  noFactsText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
