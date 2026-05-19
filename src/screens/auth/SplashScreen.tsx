import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // In real app, check auth state here
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Text className="text-4xl font-bold text-accent mb-2">Dorigo</Text>
      <Text className="text-white text-lg opacity-80">Your journey, our promise.</Text>
    </View>
  );
}
