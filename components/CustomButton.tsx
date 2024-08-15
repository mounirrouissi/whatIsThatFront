import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, TextStyle, ViewStyle, StyleSheet } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  containerStyles?: ViewStyle;
  textStyles?: TextStyle;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        containerStyles,
        isLoading && styles.loadingContainer
      ]}
      disabled={isLoading}
      {...props}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.activityIndicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#secondary',
    borderRadius: 12,
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    opacity: 0.5,
  },
  text: {
    color: '#primary',
    fontWeight: '600',
    fontSize: 18,
  },
  activityIndicator: {
    marginLeft: 8,
  },
});

export default CustomButton;