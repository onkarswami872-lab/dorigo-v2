import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const EMERGENCY_TYPES = [
  { id: 'cardiac', label: 'Cardiac Arrest', icon: 'heart', color: '#FF3B30' },
  { id: 'accident', label: 'Accident', icon: 'car-crash', color: '#FF6600' },
  { id: 'breathing', label: 'Breathing Issue', icon: 'water', color: '#FF3B30' },
  { id: 'other', label: 'Other', icon: 'help-circle', color: '#8E8E93' },
];

export default function AmbulanceRequestScreen() {
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);
  const [description, setDescription] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !confirmed) {
      Alert.alert('Error', 'Please select emergency type and confirm.');
      return;
    }
    navigation.navigate('EmergencyConfirm', { 
      type: 'ambulance', 
      emergencyType: selectedType, 
      peopleCount, 
      description 
    });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center p-4" style={{ backgroundColor: '#CC0000' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4"><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white font-bold text-lg">REQUEST AMBULANCE</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Live Location Card */}
        <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#1C1C1E' }}>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={18} color="#FF3B30" />
            <Text className="text-white font-bold ml-2">Your Live Location</Text>
          </View>
          <Text className="text-gray-400 text-sm">Current Location • Sharing automatically</Text>
        </View>

        {/* Emergency Type */}
        <Text className="text-white font-bold mb-3">What is the emergency? <Text className="text-red-500">*</Text></Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {EMERGENCY_TYPES.map((type) => (
            <TouchableOpacity 
              key={type.id} 
              onPress={() => setSelectedType(type.id)}
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: selectedType === type.id ? type.color : '#1C1C1E', width: '48%' }}
            >
              <Ionicons name={type.icon as any} size={18} color="#FFF" />
              <Text className="text-white text-xs font-bold ml-2">{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* People Count */}
        <Text className="text-white font-bold mb-3">Number of people? <Text className="text-red-500">*</Text></Text>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#374151' }}>
            <Ionicons name="remove" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold mx-6">{peopleCount}</Text>
          <TouchableOpacity onPress={() => setPeopleCount(Math.min(20, peopleCount + 1))} className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#FF6B00' }}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text className="text-white font-bold mb-3">Describe the condition</Text>
        <TextInput 
          className="rounded-xl p-4 text-white mb-4" 
          style={{ backgroundColor: '#1C1C1E', minHeight: 80, textAlignVertical: 'top' }}
          placeholder="e.g., Person is conscious but bleeding..."
          placeholderTextColor="#6B7280"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={200}
        />

        {/* Confirmation */}
        <TouchableOpacity onPress={() => setConfirmed(!confirmed)} className="flex-row items-center py-4">
          <View className={`w-6 h-6 rounded mr-3 items-center justify-center ${confirmed ? 'bg-green-500' : 'border-2 border-gray-600'}`}>
            {confirmed && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text className="text-gray-300 text-sm">I confirm this is a genuine medical emergency</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={!selectedType || !confirmed}
          className="py-4 rounded-xl items-center mt-4"
          style={{ backgroundColor: selectedType && confirmed ? '#FF3B30' : '#374151' }}
        >
          <Text className="text-white font-bold text-lg">SUBMIT EMERGENCY REQUEST</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
