import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function FareBreakdownScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { driver, vehicle, fare, distance, tripType, hasToll, drop } = route.params;
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const platformFee = 15;
  const gst = (fare + platformFee) * 0.05;
  const total = fare + platformFee + gst - discount;
  const advancePayment = total * 0.10;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'DORIGO50') {
      setDiscount(50);
      Alert.alert('Success', 'Coupon applied! ₹50 off.');
    } else {
      Alert.alert('Error', 'Invalid coupon code.');
    }
  };

  const handleConfirmRide = () => {
    Alert.alert('Payment', `Proceeding to pay ₹${advancePayment.toFixed(2)} via Razorpay...`);
    setTimeout(() => {
      navigation.replace('ActiveRide', { driver, vehicle, totalFare: total, advancePaid: advancePayment, drop });
    }, 1000);
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="p-4 border-b border-gray-800 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4"><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white text-xl font-bold">Fare Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <View className="bg-gray-800 p-4 rounded-xl mb-6">
          <Text className="text-white font-bold text-lg">{driver.name}</Text>
          <Text className="text-gray-400 text-sm">{driver.vehicle}</Text>
          <Text className="text-accent text-xs mt-1">{tripType} • {distance.toFixed(1)} km</Text>
        </View>

        <View className="bg-gray-800 p-4 rounded-xl mb-6">
          <Text className="text-white font-bold text-lg mb-4">Fare Breakdown</Text>
          <View className="flex-row justify-between mb-2"><Text className="text-gray-400">Base Fare ({tripType})</Text><Text className="text-white">₹{fare.toFixed(2)}</Text></View>
          {hasToll && <View className="flex-row justify-between mb-2"><Text className="text-gray-400">Toll Charges</Text><Text className="text-white">Included</Text></View>}
          <View className="flex-row justify-between mb-2"><Text className="text-gray-400">Platform Fee</Text><Text className="text-white">₹{platformFee.toFixed(2)}</Text></View>
          <View className="flex-row justify-between mb-2"><Text className="text-gray-400">GST (5%)</Text><Text className="text-white">₹{gst.toFixed(2)}</Text></View>
          {discount > 0 && <View className="flex-row justify-between mb-2"><Text className="text-green-400">Discount</Text><Text className="text-green-400">-₹{discount.toFixed(2)}</Text></View>}
          <View className="h-px bg-gray-700 my-4" />
          <View className="flex-row justify-between mb-2"><Text className="text-white font-bold text-lg">Total</Text><Text className="text-accent font-bold text-lg">₹{total.toFixed(2)}</Text></View>
          <Text className="text-gray-400 text-xs mt-2">Note: 10% advance (₹{advancePayment.toFixed(2)}) payable now.</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-bold mb-2">Promo Code</Text>
          <View className="flex-row">
            <TextInput className="flex-1 bg-gray-800 text-white p-3 rounded-l-lg border border-gray-700" placeholder="Enter code (Try DORIGO50)" placeholderTextColor="#6B7280" value={promoCode} onChangeText={setPromoCode} autoCapitalize="characters" />
            <TouchableOpacity onPress={applyPromo} className="bg-accent px-4 rounded-r-lg items-center justify-center"><Text className="text-white font-bold">Apply</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="bg-gray-900 p-4 border-t border-gray-800">
        <TouchableOpacity onPress={handleConfirmRide} className="bg-accent py-4 rounded-lg items-center">
          <Text className="text-white font-bold text-lg">Confirm & Pay ₹{advancePayment.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
