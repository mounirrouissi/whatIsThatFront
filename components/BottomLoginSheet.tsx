import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { AuthStrategy } from '@/types/enums';
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });
  const router = useRouter();

  const onSelectAuth = async (strategy: 'oauth_google' | 'oauth_facebook') => {
    router.replace("/home")
    // ... (rest of the onSelectAuth function remains unchanged)
  };

  const handleSignUp = () => {
    router.push({
      pathname: '/login',
      params: { type: 'register' },
    });
  };

  const handleLogin = () => {
    router.push({
      pathname: '/login',
      params: { type: 'login' },
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Choose a login method to continue</Text>
      
      <TouchableOpacity 
        style={[defaultStyles.btn, styles.btnOAuth, styles.googleBtn]}
        onPress={() => onSelectAuth('oauth_google')}
      >
        <Ionicons name="logo-google" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Continue with Google</Text>
      </TouchableOpacity>
       
      <TouchableOpacity 
        style={[defaultStyles.btn, styles.btnOAuth, styles.facebookBtn]}
        onPress={() => onSelectAuth('oauth_facebook')}
      >
        <Ionicons name="logo-facebook" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUp} style={[defaultStyles.btn, styles.btnDark]}>
        <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Sign up with email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={[defaultStyles.btn, styles.btnOutline]}>
        <Text style={styles.btnOutlineText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 26,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnOAuth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleBtn: {
    backgroundColor: '#DB4437',
  },
  facebookBtn: {
    backgroundColor: '#4267B2',
  },
  btnDark: {
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.grey,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  btnOutlineText: {
    color: Colors.grey,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  btnIcon: {
    marginRight: 10,
  },
});

export default BottomLoginSheet;