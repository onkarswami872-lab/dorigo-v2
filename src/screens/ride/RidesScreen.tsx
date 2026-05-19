import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock Data
const PAST_RIDES = [
  { id: 1, date: 'May 18, 2026', time: '10:30 AM', from: 'Home', to: 'Airport', driver: 'Rajesh K.', fare: 450, status: 'Completed' },
  { id: 2, date: 'May 15, 2026', time: '06:15 PM', from: 'Office', to: 'Gym', driver: 'Amit S.', fare: 120, status: 'Completed' },
];

const UPCOMING_RIDES = [
  { id: 101, date: 'May 20, 2026', time: '08:00 AM', from: 'Home', to: 'Railway Station', driver: 'Pending Assignment', fare: 300, status: 'Scheduled' },
];

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('Past');

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <View className="p-4 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold mb-4">My Rides</Text>
        
        {/* Tabs */}
        <View className="flex-row bg-gray-800 p-1 rounded-lg">
          <TouchableOpacity 
            onPress={() => setActiveTab('Past')}
            className={`flex-1 py-2 items-center rounded-md ${activeTab === 'Past' ? 'bg-accent' : ''}`}
          >
            <Text className={`${activeTab === 'Past' ? 'text-white' : 'text-gray-400'} font-bold`}>Past</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('Upcoming')}
            className={`flex-1 py-2 items-center rounded-md ${activeTab === 'Upcoming' ? 'bg-accent' : ''}`}
          >
            <Text className={`${activeTab === 'Upcoming' ? 'text-white' : 'text-gray-400'} font-bold`}>Upcoming</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView className="flex-1 px-4 py-4">
        {activeTab === 'Past' ? (
          PAST_RIDES.map((ride) => (
            <View key={ride.id} className="bg-gray-800 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-white font-bold">{ride.date} • {ride.time}</Text>
                <Text className="text-green-400 text-xs font-bold">{ride.status}</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={16} color="#FF6B00" />
                <Text className="text-gray-300 ml-2 text-sm">{ride.from} → {ride.to}</Text>
              </View>
              <View className="flex-row justify-between items-end mt-2">
                <View>
                  <Text className="text-gray-400 text-xs">Driver</Text>
                  <Text className="text-white text-sm">{ride.driver}</Text>
                </View>
                <Text className="text-accent font-bold text-lg">₹{ride.fare}</Text>
              </View>
              <TouchableOpacity className="mt-3 border border-gray-600 py-2 rounded-lg items-center">
                <Text className="text-gray-300 text-xs">Download Invoice</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          UPCOMING_RIDES.map((ride) => (
            <View key={ride.id} className="bg-gray-800 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-white font-bold">{ride.date} • {ride.time}</Text>
                <Text className="text-accent text-xs font-bold">{ride.status}</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={16} color="#FF6B00" />
                <Text className="text-gray-300 ml-2 text-sm">{ride.from} → {ride.to}</Text>
              </View>
              <View className="flex-row justify-between items-end mt-2">
                <View>
                  <Text className="text-gray-400 text-xs">Driver</Text>
                  <Text className="text-white text-sm">{ride.driver}</Text>
                </View>
                <Text className="text-accent font-bold text-lg">₹{ride.fare}</Text>
              </View>
              <TouchableOpacity className="mt-3 bg-red-900/30 py-2 rounded-lg items-center">
                <Text className="text-red-400 text-xs">Cancel Ride</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
