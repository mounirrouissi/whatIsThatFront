import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSupabase } from '@/context/SupabaseContext';

const VerificationScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const { insertUser } = useSupabase();

  const handleVerificationSubmit = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
 // Insert user into Supabase
 try {
  await insertUser(completeSignUp.createdUserId!, completeSignUp.emailAddress!);
  console.log("User inserted into Supabase successfully");
} catch (insertError) {
  console.error("Error inserting user into Supabase:", insertError);
  // You might want to handle this error, perhaps by showing an alert to the user
  // or by implementing a retry mechanism
}
        // router.push({
        //   pathname: '/(modals)/login',
        //   params: { type: 'login' },
        // });
        router.replace('/'); // Redirect to home screen
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
      <TextInput
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="Verification Code"
        style={styles.input}
        keyboardType="number-pad"
      />
      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnPrimary]}
        onPress={handleVerificationSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnPrimaryText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
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
    textAlign: 'center',
  },
});

export default VerificationScreen;