import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // TODO: Implement Firebase/Auth Logic
    Alert.alert('Success', 'Account created successfully!');
    navigation.replace('Login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-primary"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
        <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
        <Text className="text-gray-400 mb-8">Join Dorigo today</Text>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Full Name</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            placeholder="John Doe"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Email</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            placeholder="john@example.com"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Phone Number</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            placeholder="+91 98765 43210"
            placeholderTextColor="#6B7280"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-300 mb-2">Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-300 mb-2">Confirm Password</Text>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700"
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          className="bg-accent p-4 rounded-lg items-center mb-4"
        >
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-accent font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
