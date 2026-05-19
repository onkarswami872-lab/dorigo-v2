import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Personal Information', screen: null },
  { icon: 'location-outline', label: 'Saved Locations', screen: null },
  { icon: 'card-outline', label: 'Payment Methods', screen: null },
  { icon: 'gift-outline', label: 'Promo Codes', screen: null },
  { icon: 'language-outline', label: 'Language', screen: null },
  { icon: 'notifications-outline', label: 'Notifications', screen: null },
  { icon: 'shield-checkmark-outline', label: 'Legal & Privacy', screen: null },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
    ]);
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="p-4 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1">
        {/* User Header */}
        <View className="p-6 items-center border-b border-gray-800">
          <View className="w-24 h-24 rounded-full bg-gray-700 items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#FFF" />
          </View>
          <Text className="text-white text-xl font-bold">Onkar</Text>
          <Text className="text-gray-400 text-sm">+91 98765 43210</Text>
          <View className="flex-row items-center mt-2 bg-accent/10 px-3 py-1 rounded-full">
            <Ionicons name="star" size={14} color="#FF6B00" />
            <Text className="text-accent text-xs ml-1 font-bold">4.8 Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="py-4">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              className="flex-row items-center px-6 py-4 border-b border-gray-800 active:bg-gray-800"
              onPress={() => Alert.alert("Feature", `${item.label} screen coming soon!`)}
            >
              <Ionicons name={item.icon as any} size={22} color="#9CA3AF" />
              <Text className="text-white ml-4 flex-1">{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#4B5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="p-6">
          <TouchableOpacity 
            onPress={handleLogout}
            className="border border-red-500 py-4 rounded-xl items-center"
          >
            <Text className="text-red-500 font-bold">Log Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-gray-500 text-xs">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
