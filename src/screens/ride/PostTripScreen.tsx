import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PostTripScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { driver, vehicle, totalFare, advancePaid, kmTraveled } = route.params;

  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);

  const balancePaid = totalFare - advancePaid;

  const handleSubmit = () => {
    Alert.alert("Thank You!", "Your feedback has been recorded.");
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <ScrollView className="flex-1 bg-primary px-6 pt-12">
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
          <Ionicons name="checkmark" size={40} color="#FFF" />
        </View>
        <Text className="text-white text-2xl font-bold">Trip Completed!</Text>
        <Text className="text-gray-400 mt-2">Hope you had a safe journey.</Text>
      </View>

      {/* Invoice Card */}
      <View className="bg-gray-800 p-6 rounded-2xl mb-8">
        <Text className="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2">Final Invoice</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Total Fare</Text>
          <Text className="text-white">₹{totalFare.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Advance Paid</Text>
          <Text className="text-green-400">- ₹{advancePaid.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Balance Charged</Text>
          <Text className="text-accent font-bold">₹{balancePaid.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-400">Distance</Text>
          <Text className="text-white">{kmTraveled.toFixed(1)} km</Text>
        </View>
      </View>

      {/* Rating */}
      <View className="mb-8 items-center">
        <Text className="text-white font-bold text-lg mb-4">Rate {driver.name}</Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={32} 
                color="#FF6B00" 
                className="mx-1"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tips */}
      <View className="mb-8">
        <Text className="text-white font-bold text-lg mb-4">Tip Driver</Text>
        <View className="flex-row justify-between">
          {[10, 20, 50].map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => setTip(amount)}
              className={`flex-1 py-3 rounded-lg mx-1 items-center border ${
                tip === amount ? 'bg-accent border-accent' : 'bg-gray-800 border-gray-700'
              }`}
            >
              <Text className={`${tip === amount ? 'text-white' : 'text-gray-400'} font-bold`}>₹{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-accent py-4 rounded-xl items-center mb-8"
      >
        <Text className="text-white font-bold text-lg">Submit & Go Home</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
