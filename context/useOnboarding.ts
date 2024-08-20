// context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
const OnboardingContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => useContext(OnboardingContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check the authentication status when the app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check the authentication status
  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem('authStatus');
      const onboardingStatus = await AsyncStorage.getItem('onboardingStatus');
      const userData = await AsyncStorage.getItem('userData');

      setHasCompletedOnboarding(onboardingStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
    }
  };

  // Function to sign in
  

  // Function to sign out
  

  // Function to complete onboarding
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingStatus', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // The value that will be supplied to the descendants of this provider
  const authContextValue = {
    isAuthenticated,
    hasCompletedOnboarding,
    user,
    loading,
    signIn,
    signOut,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};