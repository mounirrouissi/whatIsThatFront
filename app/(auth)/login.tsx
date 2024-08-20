import BackButton from '@/components/BackButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAuth, useSession, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { router, useGlobalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Platform,
} from 'react-native';

const Login = () => {
  const { type } = useGlobalSearchParams();
  console.log("type:", type);

  const navigation = useNavigation(); // Get the navigation object
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { isLoaded, sessionId } = useAuth();

  const openVerificationModal = useCallback(() => {
    // bottomSheetModalRef.current?.present();
  }, []);

  const onSignInPress = async () => {
    console.log("login pressed");
    if (!isSignInLoaded) return;
    setLoading(true);
  
    try {
      // Check if a session already exists
      if (isLoaded && sessionId) {
        console.log("Active session found:", sessionId);
        // Instead of creating a new session, just redirect
        router.replace('/(tabs)/camera');
        return;
      }
  
      // Proceed with sign-in if no active session exists
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
  
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        router.replace('/home');
            } else {
        console.log("Sign in result:", result);
        // Handle additional sign-in steps if needed
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      if (err.errors && err.errors[0].message.includes("session already exists")) {
        // If the error is due to an existing session, just redirect
        // router.replace('/');
      } else {
        Alert.alert("Sign In Error", err.errors?.[0]?.message || "An error occurred during sign in.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const onSignUpPress = async () => {
    if (!isSignUpLoaded) return;
    setLoading(true);
    
    try {
      // Perform basic input validation
      if (!emailAddress || !password) {
        Alert.alert("Sign Up Error", "Email and password are required.");
        setLoading(false);
        return;
      }
  
      const signUpResult = await signUp.create({
        emailAddress,
        password,
        username: emailAddress.split("@")[0], // Using email as username
      });
  
      if (signUpResult.status === 'complete') {
        await setSignUpActive({ session: signUpResult.createdSessionId });
        // You can uncomment the router.replace() if you want to redirect after successful signup
        // router.replace('/');
      } else if (signUpResult.status === 'missing_requirements') {
        const verificationResult = await signUpResult.prepareEmailAddressVerification();
        if (verificationResult.status === 'complete') {
          await setSignUpActive({ session: verificationResult.createdSessionId });
        } else {
          console.log("Email verification required");
          Alert.alert(
            "Email Verification Required",
            "Please check your email for a verification code."
          );
          // Uncomment this to open the verification modal or redirect to the verification screen
          // openVerificationModal();
          router.push({
            pathname: '/(modals)/VerificationScreen',
            params: { type: 'VerificationScreen' },
          });
        }
      } else {
        // Handle other statuses if necessary
        console.log("Sign up result:", signUpResult);
        Alert.alert("Sign Up Error", "An unexpected error occurred. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      // Handle different types of errors more specifically if needed
      Alert.alert("Sign Up Error", err.errors?.[0]?.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerificationSubmit = async () => {
    if (!isSignUpLoaded) return;
    setLoading(true);
    try {
      const signUpResult = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (signUpResult.status === 'complete') {
        await setSignUpActive({ session: signUpResult.createdSessionId });
        // bottomSheetModalRef.current?.dismiss();
        router.replace('/');
      } else {
        Alert.alert("Verification Failed", "Please try again with a valid code.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      Alert.alert("Verification Error", err.errors?.[0]?.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateInput = () => {
    if (!isValidEmail(emailAddress)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Invalid Password", "Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;
    type === 'login' ? onSignInPress() : onSignUpPress();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={70}
      style={styles.container}>
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    
      <BackButton onBackPress={()=>{navigation.goBack();}}  />
    
      <Image source={require('@/assets/images/logo-dark.png')} style={styles.logo} />

      <Text style={styles.title}>{type === 'login' ? 'Welcome back' : 'Create your account'}</Text>
      <View style={{ marginBottom: 30 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="john@apple.com"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={styles.inputField}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputField}
        />
      </View>

      <TouchableOpacity style={[defaultStyles.btn, styles.btnPrimary]} onPress={handleSubmit}>
        <Text style={styles.btnPrimaryText}>
          {type === 'login' ? 'Login' : 'Create account'}
        </Text>
      </TouchableOpacity>

      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default Login;    