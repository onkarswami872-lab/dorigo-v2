import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  icon?: any;
}

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, icon }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-300 mb-2 text-sm font-medium">{label}</Text>}
      <View className="relative">
        <TextInput
          className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 focus:border-accent pr-12"
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
        {icon && (
          <View className="absolute right-4 top-4">
            {icon}
          </View>
        )}
      </View>
    </View>
  );
}
