import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const baseStyle = "py-4 rounded-lg items-center justify-center";
  
  const variants = {
    primary: "bg-accent",
    secondary: "bg-gray-800",
    outline: "border border-accent bg-transparent",
  };

  const textVariants = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-accent",
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#FF6B00' : '#FFFFFF'} />
      ) : (
        <Text className={`font-bold text-base ${textVariants[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
