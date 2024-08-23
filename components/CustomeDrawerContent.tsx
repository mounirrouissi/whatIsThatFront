import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useClerk } from '@clerk/clerk-expo';

const CustomDrawerContent = (props) => {
  const { user } = useClerk();
  

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.fullName}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.bottomContent}>
        <Text style={styles.policyText}>Privacy Policy</Text>
        <Text style={styles.policyText}>Terms of Service</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingVertical: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  bottomContent: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
});

export default CustomDrawerContent;