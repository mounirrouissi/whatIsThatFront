import { View, Text,StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import AnimatedIntro from '@/components/AnimatedIntro'
import BottomLoginSheet from '@/components/BottomLoginSheet'

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
        <AnimatedIntro/>
        <BottomLoginSheet/>
        </SafeAreaView>
    
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Login