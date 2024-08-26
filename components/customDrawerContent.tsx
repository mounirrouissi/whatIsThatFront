import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export default function CustomDrawerContent(props) {
  const { user } = useUser();
  const [isPoliciesVisible, setIsPoliciesVisible] = useState(false);

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    []
  );

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.userSection}>
          <Image
            source={{ uri: user?.profileImageUrl || 'https://via.placeholder.com/150' }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress || 'user@example.com'}</Text>
          </View>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      <TouchableOpacity
        style={styles.policiesButton}
        onPress={() => setIsPoliciesVisible(true)}
      >
        <Ionicons name="document-text-outline" size={22} color="#000" />
        <Text style={styles.policiesButtonText}>Policies</Text>
      </TouchableOpacity>

      <BottomSheet
        index={isPoliciesVisible ? 0 : -1}
        snapPoints={['50%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(index) => setIsPoliciesVisible(index === 0)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Policies</Text>
          <Text>This is where you can display your app's policies.</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerItemsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  policiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  policiesButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});