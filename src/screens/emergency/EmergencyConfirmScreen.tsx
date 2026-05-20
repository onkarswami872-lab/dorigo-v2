import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyConfirmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type, emergencyType, incidentType, description, details } = route.params;

  const [countdown, setCountdown] = useState(3);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!dispatched) {
      setDispatched(true);
    }
  }, [countdown]);

  const handleCancel = () => {
    Alert.alert("Cancel Emergency?", "Are you sure you want to cancel?", [
      { text: "No, Continue", style: "cancel" },
      { text: "Yes, Cancel", onPress: () => navigation.navigate('EmergencySOS') }
    ]);
  };

  const handleCallDirect = () => {
    const number = type === 'ambulance' ? '108' : '100';
    Linking.openURL(Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`);
  };

  if (dispatched) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <View className="w-24 h-24 rounded-full items-center justify-center mb-6" style={{ backgroundColor: '#34C759' }}>
          <Ionicons name="checkmark" size={48} color="#FFF" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">EMERGENCY ALERT SENT</Text>
        <Text className="text-gray-400 mb-8">Help is on the way</Text>

        <View className="w-full px-8 rounded-xl p-4 mb-6" style={{ backgroundColor: '#1C1C1E' }}>
          <Text className="text-gray-400 text-xs uppercase mb-2">Emergency Type</Text>
          <Text className="text-white font-bold mb-4">{type === 'ambulance' ? emergencyType : incidentType}</Text>
          <Text className="text-gray-400 text-xs uppercase mb-2">Status</Text>
          <View className="self-start px-3 py-1 rounded-full" style={{ backgroundColor: '#34C759' }}>
            <Text className="text-white text-xs font-bold">Dispatched</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleCallDirect} className="flex-row items-center px-6 py-3 rounded-xl mb-3" style={{ borderWidth: 1, borderColor: '#FFF' }}>
          <Ionicons name="call" size={20} color="#FFF" />
          <Text className="text-white font-bold ml-2">Call Emergency Services</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EmergencyTracking')} className="w-full px-8 py-4 rounded-xl items-center" style={{ backgroundColor: '#FF6B00' }}>
          <Text className="text-white font-bold text-lg">Track Emergency Vehicle</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-6 bg-black">
      <Text className="text-white text-xl font-bold mb-8">CONFIRM EMERGENCY</Text>
      
      {/* Countdown Circle */}
      <View className="w-48 h-48 rounded-full items-center justify-center mb-8" style={{ borderWidth: 4, borderColor: '#FF3B30' }}>
        <Text className="text-white text-7xl font-bold">{countdown}</Text>
      </View>

      <Text className="text-gray-400 text-center mb-8">Emergency alert will be sent in {countdown} seconds</Text>

      <TouchableOpacity onPress={handleCancel} className="px-8 py-4 rounded-xl" style={{ borderWidth: 1, borderColor: '#6B7280' }}>
        <Text className="text-white font-bold text-lg">CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
}
