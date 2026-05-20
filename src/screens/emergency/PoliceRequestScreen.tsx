import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const INCIDENT_TYPES = [
  { id: 'accident', label: 'Road Accident', icon: 'car-crash' },
  { id: 'assault', label: 'Assault', icon: 'hand-left' },
  { id: 'theft', label: 'Theft/Robbery', icon: 'lock-closed' },
  { id: 'other', label: 'Other', icon: 'help-circle' },
];

export default function PoliceRequestScreen() {
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState('');
  const [details, setDetails] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !details || !confirmed) {
      Alert.alert('Error', 'Please fill all required fields and confirm.');
      return;
    }
    navigation.navigate('EmergencyConfirm', { 
      type: 'police', 
      incidentType: selectedType, 
      details
    });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center p-4" style={{ backgroundColor: '#1C3D5A' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4"><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white font-bold text-lg">REPORT TO POLICE</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Live Location */}
        <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: '#1C3D5A' }}>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={18} color="#1C3D5A" />
            <Text className="text-white font-bold ml-2">Your Live Location</Text>
          </View>
          <Text className="text-gray-400 text-sm">Current Location • Sharing automatically</Text>
        </View>

        {/* Incident Type */}
        <Text className="text-white font-bold mb-3">What is happening? <Text className="text-red-500">*</Text></Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {INCIDENT_TYPES.map((type) => (
            <TouchableOpacity 
              key={type.id} 
              onPress={() => setSelectedType(type.id)}
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: selectedType === type.id ? '#1C3D5A' : '#1C1C1E', width: '48%' }}
            >
              <Ionicons name={type.icon as any} size={18} color="#FFF" />
              <Text className="text-white text-xs font-bold ml-2">{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Incident Details */}
        <Text className="text-white font-bold mb-3">Describe what happened <Text className="text-red-500">*</Text></Text>
        <TextInput 
          className="rounded-xl p-4 text-white mb-4" 
          style={{ backgroundColor: '#1C1C1E', minHeight: 120, textAlignVertical: 'top' }}
          placeholder="Describe the incident in detail..."
          placeholderTextColor="#6B7280"
          value={details}
          onChangeText={setDetails}
          multiline
          maxLength={300}
        />

        {/* Confirmation */}
        <TouchableOpacity onPress={() => setConfirmed(!confirmed)} className="flex-row items-center py-4">
          <View className={`w-6 h-6 rounded mr-3 items-center justify-center ${confirmed ? 'bg-green-500' : 'border-2 border-gray-600'}`}>
            {confirmed && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text className="text-gray-300 text-sm">I confirm this is a genuine safety emergency</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={!selectedType || !details || !confirmed}
          className="py-4 rounded-xl items-center mt-4"
          style={{ backgroundColor: selectedType && details && confirmed ? '#1C3D5A' : '#374151' }}
        >
          <Text className="text-white font-bold text-lg">REPORT TO POLICE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
