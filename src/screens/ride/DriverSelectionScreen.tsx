import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DRIVERS = [
  {
    id: '1', name: 'Rajesh Kumar', rating: 4.8, trips: 1240,
    vehicle: 'Swift Dzire • KA 01 AB 1234', distance: '1.2 km away',
    photo: 'https://i.pravatar.cc/150?img=11',
    carImages: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80',
    ],
    kyc: ['DL', 'RC', 'Insurance'],
  },
  {
    id: '2', name: 'Amit Singh', rating: 4.9, trips: 850,
    vehicle: 'Toyota Innova • KA 02 CD 5678', distance: '2.5 km away',
    photo: 'https://i.pravatar.cc/150?img=12',
    carImages: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
    ],
    kyc: ['DL', 'RC', 'Police Clearance'],
  },
];

export default function DriverSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { vehicle, fare, distance, tripType, hasToll, drop } = route.params;

  const handleBookDriver = (driver: any) => {
    navigation.navigate('FareBreakdown', {
      driver, vehicle, fare, distance, tripType, hasToll, drop
    });
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="p-4 border-b border-gray-800 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4"><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white text-xl font-bold">Available Drivers</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {DRIVERS.map((driver) => (
          <View key={driver.id} className="bg-gray-800 p-4 rounded-xl mb-6">
            {/* Driver Info */}
            <View className="flex-row items-start mb-4">
              <Image source={{ uri: driver.photo }} className="w-16 h-16 rounded-full mr-4 bg-gray-700" />
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">{driver.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#FF6B00" />
                  <Text className="text-white ml-1 text-sm">{driver.rating}</Text>
                  <Text className="text-gray-400 ml-2 text-sm">• {driver.trips} trips</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">{driver.vehicle}</Text>
                <Text className="text-accent text-xs mt-1">{driver.distance}</Text>
              </View>
            </View>

            {/* Car Images Horizontal Scroll */}
            <Text className="text-gray-300 text-sm mb-2 font-bold">Vehicle Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {driver.carImages.map((img, index) => (
                <Image key={index} source={{ uri: img }} className="w-32 h-20 rounded-lg mr-2 bg-gray-700" resizeMode="cover" />
              ))}
            </ScrollView>

            {/* KYC Badges */}
            <View className="flex-row mb-4 flex-wrap">
              {driver.kyc.map((badge, index) => (
                <View key={index} className="bg-green-900/30 px-2 py-1 rounded mr-2 mb-2 flex-row items-center">
                  <Ionicons name="checkmark-circle" size={12} color="#34C759" />
                  <Text className="text-green-400 text-xs ml-1">{badge}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={() => handleBookDriver(driver)} className="bg-accent py-3 rounded-lg items-center">
              <Text className="text-white font-bold">Book This Driver</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
