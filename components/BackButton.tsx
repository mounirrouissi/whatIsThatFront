import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  color?: string;
  size?: number;
  backTo: string; // New prop for the route to go back to

}

export const BackButton: React.FC<BackButtonProps> = ({ color = 'white', size = 28 ,backTo}, to:string) => {
  const router = useRouter();
  console.log(" back to "+backTo)

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push("(app)/home/Observations")}>
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});