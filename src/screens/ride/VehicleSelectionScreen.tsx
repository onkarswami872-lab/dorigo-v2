import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// ✅ Realistic fare structure (Auto removed as requested)
const VEHICLES = [
  { id: '2', type: 'Mini', seats: 4, base: 50, perKm: 12, icon: 'car-sport' },
  { id: '3', type: 'Sedan', seats: 4, base: 70, perKm: 15, icon: 'car' },
  { id: '4', type: 'SUV', seats: 6, base: 100, perKm: 20, icon: 'car' },
  { id: '5', type: 'Traveller', seats: 12, base: 150, perKm: 25, icon: 'bus' },
];

export default function VehicleSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pickup, drop, distance, tollInfo } = route.params;

  const [tripType, setTripType] = useState('One-Way');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);

  // Auto-detect tolls from route
  const hasTolls = tollInfo?.hasTolls || false;
  const tollAmount = hasTolls ? tollInfo.tollAmount : 0;
  const tollCount = hasTolls ? tollInfo.tollCount : 0;

  const getFare = (vehicle: any) => {
    let fare = vehicle.base + (distance * vehicle.perKm);
    if (tripType === 'Round-Trip') fare *= 1.85;
    if (tripType === 'Multi-Day') fare = (vehicle.base * 3) + (distance * vehicle.perKm);
    if (hasTolls) fare += tollAmount;
    return Math.round(fare);
  };

  const handleContinue = () => {
    if (tripType === 'Multi-Day') {
      Alert.alert("Multi-Day Trip", "For Multi-Day trips, please call customer care to finalize pricing.", [
        { text: "Cancel", style: "cancel" },
        { text: "Call Now", onPress: () => Linking.openURL('tel:18001234567') }
      ]);
    } else {
      navigation.navigate('DriverSelection', {
        vehicle: selectedVehicle,
        fare: getFare(selectedVehicle),
        distance,
        tripType,
        hasTolls,
        drop,
        tollInfo
      });
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <View className="p-4 border-b border-gray-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white text-xl font-bold">Choose Ride</Text>
        <View />
      </View>

      {/* ✅ Compact Icon Toggles */}
      <View className="px-4 py-3 flex-row gap-2">
        {[
          { label: 'One-Way', icon: 'arrow-forward' },
          { label: 'Round-Trip', icon: 'repeat' },
          { label: 'Multi-Day', icon: 'calendar' }
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => setTripType(item.label)}
            className={`flex-1 h-10 rounded-xl flex-row items-center justify-center gap-1.5 ${
              tripType === item.label ? 'bg-accent' : 'bg-gray-800'
            }`}
          >
            <Ionicons 
              name={item.icon as any} 
              size={16} 
              color={tripType === item.label ? '#FFF' : '#9CA3AF'} 
            />
            <Text className={`${tripType === item.label ? 'text-white' : 'text-gray-400'} font-bold text-[11px]`}>
              {item.label === 'One-Way' ? 'One' : item.label === 'Round-Trip' ? 'Round' : 'Multi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Toll Info - Only shows if route has tolls */}
      {hasTolls && (
        <View className="mx-4 mb-3 bg-yellow-900/20 border border-yellow-600/40 rounded-xl p-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="cash-outline" size={18} color="#FCD34D" />
            <View className="ml-2">
              <Text className="text-yellow-400 font-bold text-sm">Toll Charges</Text>
              <Text className="text-yellow-200/60 text-xs">{tollCount} tolls included</Text>
            </View>
          </View>
          <Text className="text-yellow-400 font-bold text-lg">₹{tollAmount}</Text>
        </View>
      )}

      {/* Vehicle List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {VEHICLES.map((v) => {
          const isSelected = selectedVehicle.id === v.id;
          const fare = getFare(v);
          
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setSelectedVehicle(v)}
              className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border-2 ${
                isSelected ? 'border-accent bg-gray-900' : 'border-gray-800 bg-gray-800/40'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-12 h-12 rounded-lg items-center justify-center ${isSelected ? 'bg-accent/20' : 'bg-gray-700'}`}>
                  <Ionicons name={v.icon as any} size={24} color={isSelected ? '#FF6B00' : '#9CA3AF'} />
                </View>
                <View className="ml-4">
                  <Text className="text-white font-bold text-base">{v.type}</Text>
                  <Text className="text-gray-400 text-xs">{v.seats} Seats • {Math.ceil(distance)} km</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold text-lg">₹{fare}</Text>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="#FF6B00" className="mt-1" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Action */}
      <View className="bg-gray-900 p-4 border-t border-gray-800 pb-8">
        <TouchableOpacity onPress={handleContinue} className="bg-accent py-4 rounded-xl items-center shadow-lg shadow-orange-500/20">
          <Text className="text-white font-bold text-lg">
            {tripType === 'Multi-Day' ? 'Call to Book' : `Confirm • ₹${getFare(selectedVehicle)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
