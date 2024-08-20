import AnimatedIntro from '@/components/AnimatedIntro';
import BottomLoginSheet from '@/components/BottomLoginSheet';
import Checkout from '@/components/checkout/Checkout';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from './(auth)/login';
import Onboarding from '@/app/(auth)/onboarding';
const Page = () => {
  return (
    <SafeAreaView style={styles.container}>
    <Onboarding/> 
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Page;