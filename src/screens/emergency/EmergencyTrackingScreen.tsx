import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyTrackingScreen() {
  const navigation = useNavigation<any>();
  const [eta, setEta] = useState(12);

  return (
    <View className="flex-1 bg-black">
      {/* Map Placeholder */}
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#1C1C1E' }}>
        <Ionicons name="map" size={48} color="#374151" />
        <Text className="text-gray-500 mt-2">Live Map View</Text>
        <Text className="text-gray-600 text-xs">Emergency vehicle approaching</Text>
      </View>

      {/* Status Card */}
      <View className="rounded-t-3xl p-6" style={{ backgroundColor: '#1C1C1E' }}>
        {/* Status Timeline */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-green-500 mr-3" />
            <Text className="text-green-400 font-bold">Request received</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-green-500 mr-3" />
            <Text className="text-green-400 font-bold">Unit dispatched</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-red-500 mr-3" />
            <Text className="text-white font-bold">Unit en route</Text>
          </View>
        </View>

        {/* ETA */}
        <Text className="text-gray-400 text-xs uppercase mb-1">Estimated Arrival</Text>
        <Text className="text-red-500 text-4xl font-bold mb-6">{eta} min</Text>

        {/* Unit Details */}
        <View className="flex-row items-center justify-between p-4 rounded-xl mb-6" style={{ backgroundColor: '#0A0A0A' }}>
          <View>
            <Text className="text-white font-bold">Ambulance #108-42</Text>
            <Text className="text-gray-400 text-sm">Driver: Rajesh K.</Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(Platform.OS === 'android' ? 'tel:108' : 'telprompt:108')} className="w-12 h-12 rounded-full bg-green-600 items-center justify-center">
            <Ionicons name="call" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <TouchableOpacity onPress={() => Alert.alert("Update", "Send condition update to dispatch center")} className="py-3 rounded-xl mb-3" style={{ borderWidth: 1, borderColor: '#6B7280' }}>
          <Text className="text-white font-bold text-center">Update Condition</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EmergencySOS')} className="py-3 rounded-xl" style={{ borderWidth: 1, borderColor: '#FF3B30' }}>
          <Text className="text-red-500 font-bold text-center">Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
