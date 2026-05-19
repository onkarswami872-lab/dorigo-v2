import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendOTP = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    // TODO: Send OTP via Backend
    Alert.alert('Success', 'OTP sent to your email');
    setStep(2);
  };

  const verifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit OTP');
      return;
    }
    // TODO: Verify OTP via Backend
    setStep(3);
  };

  const resetPassword = () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter new password');
      return;
    }
    // TODO: Reset Password via Backend
    Alert.alert('Success', 'Password reset successfully');
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 bg-primary px-6 justify-center">
      <Text className="text-3xl font-bold text-white mb-2">Reset Password</Text>
      <Text className="text-gray-400 mb-8">
        {step === 1 && "Enter your email to receive an OTP"}
        {step === 2 && "Enter the 6-digit OTP sent to your email"}
        {step === 3 && "Create a new strong password"}
      </Text>

      {step === 1 && (
        <>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 mb-6"
            placeholder="Email Address"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={sendOTP} className="bg-accent p-4 rounded-lg items-center">
            <Text className="text-white font-bold">Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 mb-6 text-center text-2xl tracking-widest"
            placeholder="000000"
            placeholderTextColor="#6B7280"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity onPress={verifyOTP} className="bg-accent p-4 rounded-lg items-center">
            <Text className="text-white font-bold">Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 mb-6"
            placeholder="New Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={resetPassword} className="bg-accent p-4 rounded-lg items-center">
            <Text className="text-white font-bold">Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-8 items-center">
        <Text className="text-gray-400">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
