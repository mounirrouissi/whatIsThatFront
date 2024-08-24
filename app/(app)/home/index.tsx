import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated,Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { useClerk } from '@clerk/clerk-expo';
import { ScrollView } from 'react-native-gesture-handler';
import ResentFileCard from '@/components/ResentFileCard';
import { IconObjectArray } from '@/app/types';


const SkeletonItem = () => {
  const animatedValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F5F5F5'],
  });

  return (
    <View style={styles.item}>
      <Animated.View style={[styles.itemImage, { backgroundColor }]} />
      <View style={styles.itemContent}>
        <Animated.View style={[styles.skeletonLine, { width: '70%', backgroundColor }]} />
        <Animated.View style={[styles.skeletonLine, { width: '40%', backgroundColor }]} />
      </View>
    </View>
  );
};

export default function TabOneScreen() {
  const [identifications, setIdentifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getIdentifications, userId } = useSupabase();
  const { signOut } = useClerk();
  const router = useRouter();
  const [sharedElementAnimation, setSharedElementAnimation] = useState(new Animated.Value(0));
  const [selectedIdentification, setSelectedIdentification] = useState(null);


  /* const handleLogout = async () => {
    try {
      await signOut();
      router.push('/(auth)/auth');
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }; */
  const iconObject: IconObjectArray = {
    animals: [
      { name: "Mushrooms", icon: "mushroom" }, // MaterialCommunityIcons
      { name: "Animals", icon: "cat" }, // MaterialIcons
      { name: "Birds", icon: "bird" }, // MaterialIcons
    ],
    rocks: [
      { name: "Rocks", icon: "wallpaper" }, // MaterialCommunityIcons
    ],
    plants: [
      { name: "Plants", icon: "flower" }, // MaterialIcons
    ],
  };

  useEffect(() => {
    fetchIdentifications();
  }, []);

  const fetchIdentifications = async () => {
    setIsLoading(true);
    console.log('Fetching identifications...');
    console.log("user id "+userId);

    const data = await getIdentifications(userId);
    
    if (data) {
      setIdentifications(data);
      console.log("data: "+ JSON.stringify(data)); 
    }
    setIsLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const handlePress = () => {
      setSelectedIdentification(item);
      Animated.timing(sharedElementAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    };
    return (
      <TouchableOpacity style={styles.item} onPress={handlePress}>
        <Animated.Image
          source={{ uri: item.image_url || 'https://via.placeholder.com/10' }}
          style={[
            styles.itemImage,
            {
              transform: [
                {
                  scale: sharedElementAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.type}</Text>
          <Text style={styles.itemDate}>{new Date(item.identified_at).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeletonList = () => (
    <FlatList
      data={[...Array(5)]}
      renderItem={() => <SkeletonItem />}
      keyExtractor={(_, index) => index.toString()}
      style={styles.list}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <ScrollView
           contentContainerStyle={{
            gap: 16,
            padding: 16,
            paddingRight: 24,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={120}
          snapToAlignment="center"
      >
        {Object.values(iconObject).map((values) => (
          values.map((val) => (
            <ResentFileCard key={val.name} iconObject={val} />
          ))
        ))}
        
      </ScrollView>
      </View>
      <Text style={styles.title}>Latest Identifications</Text>
      {isLoading ? (
        renderSkeletonList()
      ) : (
        <FlatList
          data={identifications}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      )}

{selectedIdentification && (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {
                scale: sharedElementAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.Image
          source={{ uri: selectedIdentification.image_url }}
          style={[
            { width: '80%', height: '80%', borderRadius: 10 },
            {
              transform: [
                {
                  scale: sharedElementAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            padding: 10,
            borderRadius: 20,
          }}
          onPress={() => {
            Animated.timing(sharedElementAnimation, {
              toValue: 0,
              duration: 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start(() => {
              setSelectedIdentification(null);
            });
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
      </Animated.View>)}
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
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
  },
  skeletonLine: {
    height: 20,
    marginBottom: 6,
    borderRadius: 4,
  },
});