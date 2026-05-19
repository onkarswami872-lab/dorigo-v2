import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Linking, Platform, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getDistanceFromLatLonInKm } from '../../utils/fareCalculator';

const { width } = Dimensions.get('window');

const VEHICLES = [
  { id: '1', type: 'Economy', seats: 4, base: 50, perKm: 12, icon: 'car-sport' },
  { id: '2', type: 'SUV', seats: 7, base: 100, perKm: 18, icon: 'car' },
  { id: '3', type: 'Traveller', seats: 12, base: 200, perKm: 25, icon: 'bus' },
  { id: '4', type: 'Bus', seats: 25, base: 500, perKm: 40, icon: 'bus-sharp' },
];

const MOCK_LOCATIONS = [
  { id: 1, name: 'Stop 1: Mysore', lat: 12.2958, lng: 76.6394 },
  { id: 2, name: 'Stop 2: Ooty', lat: 11.4102, lng: 76.6950 },
  { id: 3, name: 'Stop 3: Coorg', lat: 12.3375, lng: 75.8069 },
];

export default function VehicleSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pickup, drop } = route.params;

  const [tripType, setTripType] = useState('One-Way');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [distance, setDistance] = useState(0);
  const [hasToll, setHasToll] = useState(true);
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    if (pickup && drop) {
      let totalDist = getDistanceFromLatLonInKm(pickup.lat, pickup.lng, drop.lat, drop.lng);
      
      if (tripType === 'Multi-Day') {
        let currentLat = pickup.lat;
        let currentLng = pickup.lng;
        stops.forEach(stop => {
          totalDist += getDistanceFromLatLonInKm(currentLat, currentLng, stop.lat, stop.lng);
          currentLat = stop.lat;
          currentLng = stop.lng;
        });
        if (stops.length > 0) {
           totalDist += getDistanceFromLatLonInKm(stops[stops.length-1].lat, stops[stops.length-1].lng, drop.lat, drop.lng);
        }
      }
      setDistance(totalDist);
    }
  }, [pickup, drop, tripType, stops]);

  const addStop = () => {
    if (stops.length >= 3) {
      Alert.alert("Limit Reached", "Maximum 3 stops allowed.");
      return;
    }
    const newStop = MOCK_LOCATIONS[stops.length % MOCK_LOCATIONS.length];
    setStops([...stops, newStop]);
  };

  const removeStop = (index: number) => {
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const getFare = (vehicle: any) => {
    let fare = vehicle.base + (distance * vehicle.perKm);
    if (tripType === 'Round-Trip') fare *= 1.8;
    if (tripType === 'Multi-Day') fare = (vehicle.base * 2) + (distance * vehicle.perKm); 
    if (hasToll) fare += 45; 
    return Math.round(fare);
  };

  const handleContinue = () => {
    if (tripType === 'Multi-Day') {
      Alert.alert(
        "Multi-Day Trip",
        "For Multi-Day trips, please call our customer care to finalize your itinerary and pricing.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Call Now", 
            onPress: () => {
              const url = Platform.OS === 'android' ? `tel:18001234567` : `telprompt:18001234567`;
              Linking.openURL(url);
            }
          }
        ]
      );
    } else {
      navigation.navigate('DriverSelection', {
        vehicle: selectedVehicle,
        fare: getFare(selectedVehicle),
        distance,
        tripType,
        hasToll,
        drop,
        stops
      });
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="p-4 border-b border-gray-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#FFF" /></TouchableOpacity>
        <Text className="text-white text-xl font-bold">Choose Ride</Text>
        <View />
      </View>

      {/* Fixed Width Tabs */}
      <View className="flex-row px-4 py-3 justify-between">
        {['One-Way', 'Round-Trip', 'Multi-Day'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => {
              setTripType(type);
              if (type !== 'Multi-Day') setStops([]);
            }}
            style={{ width: (width - 48) / 3 - 8 }} // Calculate equal width
            className={`py-3 rounded-lg items-center ${tripType === type ? 'bg-accent' : 'bg-gray-800'}`}
          >
            <Text className={`${tripType === type ? 'text-white' : 'text-gray-400'} font-bold text-xs`}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Multi-Day Stops */}
      {tripType === 'Multi-Day' && (
        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-bold text-sm">Stops ({stops.length}/3)</Text>
            <TouchableOpacity onPress={addStop} className="flex-row items-center bg-gray-800 px-3 py-1 rounded-full">
              <Ionicons name="add-circle" size={14} color="#FF6B00" />
              <Text className="text-accent ml-1 text-xs font-bold">Add Stop</Text>
            </TouchableOpacity>
          </View>
          
          {stops.map((stop, index) => (
            <View key={index} className="flex-row items-center justify-between bg-gray-800 p-3 rounded-lg mb-2">
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-accent items-center justify-center mr-2">
                  <Text className="text-white text-[10px] font-bold">{index + 1}</Text>
                </View>
                <Text className="text-white text-sm">{stop.name}</Text>
              </View>
              <TouchableOpacity onPress={() => removeStop(index)}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Vehicle List */}
      <ScrollView className="flex-1 px-4">
        {VEHICLES.map((v) => {
          const isSelected = selectedVehicle.id === v.id;
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => setSelectedVehicle(v)}
              className={`flex-row items-center justify-between p-3 mb-3 rounded-xl border ${isSelected ? 'border-accent bg-gray-900' : 'border-gray-800 bg-gray-800/50'}`}
            >
              <View className="flex-row items-center">
                <Ionicons name={v.icon as any} size={28} color={isSelected ? '#FF6B00' : '#9CA3AF'} />
                <View className="ml-3">
                  <Text className="text-white font-bold text-base">{v.type}</Text>
                  <Text className="text-gray-400 text-[10px]">{v.seats} Seats • {Math.ceil(distance)} km</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold text-base">₹{getFare(v)}</Text>
                {isSelected && <Ionicons name="checkmark-circle" size={18} color="#FF6B00" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Action */}
      <View className="bg-gray-900 p-4 border-t border-gray-800">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-400 text-sm">Includes Toll?</Text>
          <Switch value={hasToll} onValueChange={setHasToll} trackColor={{ false: "#374151", true: "#FF6B00" }} thumbColor={"#f4f3f4"} />
        </View>
        <TouchableOpacity onPress={handleContinue} className="bg-accent py-3 rounded-lg items-center">
          <Text className="text-white font-bold text-base">
            {tripType === 'Multi-Day' ? 'Call to Book Multi-Day' : 'View Drivers'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
