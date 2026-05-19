import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement Firebase/Auth Logic
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // Mock successful login
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
        <Text className="text-gray-400 mb-8">Sign in to continue your journey</Text>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Email or Phone</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 focus:border-accent"
            placeholder="Enter email or phone"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-300 mb-2">Password</Text>
          <View className="relative">
            <TextInput
              className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 focus:border-accent pr-12"
              placeholder="Enter password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} className="self-end mb-8">
          <Text className="text-accent">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-accent p-4 rounded-lg items-center mb-4"
        >
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mb-8">
          <View className="h-px bg-gray-700 flex-1" />
          <Text className="text-gray-500 mx-4">OR</Text>
          <View className="h-px bg-gray-700 flex-1" />
        </View>

        <TouchableOpacity className="bg-white p-4 rounded-lg items-center flex-row justify-center mb-4">
          <Ionicons name="logo-google" size={20} color="#000" />
          <Text className="text-black font-bold ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-accent font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
