import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { useClerk } from '@clerk/clerk-expo';
import { ScrollView } from 'react-native-gesture-handler';
import ResentFileCard from '@/components/ResentFileCard';
import { IconObjectArray } from '@/app/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
  const { getIdentifications, userId, getUserById } = useSupabase();
  const { signOut } = useClerk();
  const router = useRouter();
  const [sharedElementAnimation] = useState(new Animated.Value(0));
  const [selectedIdentification, setSelectedIdentification] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [userId, getUserById]);

  const iconObject: IconObjectArray = {
    animals: [
      { name: "Mushrooms", icon: "mushroom" },
      { name: "Animals", icon: "cat" },
      { name: "Birds", icon: "bird" },
    ],
    rocks: [
      { name: "Rocks", icon: "wallpaper" },
    ],
    plants: [
      { name: "Plants", icon: "flower" },
    ],
  };

  useEffect(() => {
    fetchIdentifications();
  }, []);

  const fetchIdentifications = async () => {
    setIsLoading(true);
    const data = await getIdentifications(userId);
    if (data) {
      setIdentifications(data);
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
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
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
            styles.modalContainer,
            {
              opacity: sharedElementAnimation,
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
              styles.modalImage,
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
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.full_name}</Text>
            <Text style={styles.userIdentifiedDate}>Identified at: {new Date(selectedIdentification.identified_at).toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
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
            <Ionicons name="close" size={24} color="white" style={styles.closeText} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </LinearGradient>
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
  title: {
    fontSize: 28,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    paddingHorizontal: 16,
  },
  list: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemDate: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  skeletonLine: {
    height: 20,
    marginBottom: 6,
    borderRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
  },
  userInfo: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 15,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 15,
    borderRadius: 30,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userIdentifiedDate: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
});