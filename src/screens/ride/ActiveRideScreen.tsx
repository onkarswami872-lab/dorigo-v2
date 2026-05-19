import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Linking, 
  Platform,
  Animated,
  Modal
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ActiveRideScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { driver, vehicle, totalFare, advancePaid, drop } = route.params;

  // Trip State
  const [tripStatus, setTripStatus] = useState('arriving'); // 'arriving', 'started', 'completed'
  const [otp, setOtp] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [driverLocation, setDriverLocation] = useState({ lat: drop.lat - 0.01, lng: drop.lng - 0.01 });
  const [distanceToPickup, setDistanceToPickup] = useState(2.5);
  const [eta, setEta] = useState(8);
  const [kmTraveled, setKmTraveled] = useState(0);
  
  // SOS State
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);

  // Mock Live Tracking Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (tripStatus === 'arriving') {
        setDistanceToPickup(prev => Math.max(0, prev - 0.1));
        setEta(prev => Math.max(1, prev - 1));
        setDriverLocation(prev => ({ lat: prev.lat + 0.0001, lng: prev.lng + 0.0001 }));
      } else if (tripStatus === 'started') {
        setKmTraveled(prev => prev + 0.1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [tripStatus, distanceToPickup]);

  const handleStartTrip = () => {
    setTripStatus('started');
    Alert.alert("Trip Started", "Your ride has begun. Stay safe!");
  };

  const handleSOSPress = () => {
    setShowSOSConfirm(true);
  };

  const confirmSOS = async () => {
    setShowSOSConfirm(false);
    const url = Platform.OS === 'android' ? `tel:100` : `telprompt:100`;
    await Linking.openURL(url);
    Alert.alert("SOS Activated", "Police contacted. Emergency contacts notified.");
  };

  const handleEndTrip = () => {
    setTripStatus('completed');
    navigation.replace('PostTrip', {
      driver, vehicle, totalFare, advancePaid, kmTraveled
    });
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: driverLocation.lat,
          longitude: driverLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: drop.lat, longitude: drop.lng }} title="You" pinColor="#3B82F6" />
        
        {/* Driver Marker - Removed custom image to fix error */}
        <Marker 
          coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }} 
          title={driver.name}
          pinColor="#FF6B00"
        />

        <Polyline 
          coordinates={[
            { latitude: driverLocation.lat, longitude: driverLocation.lng },
            { latitude: drop.lat, longitude: drop.lng }
          ]}
          strokeColor="#FF6B00"
          strokeWidth={4}
        />
      </MapView>

      {/* Top Pill: ETA */}
      <View className="absolute top-12 left-0 right-0 items-center z-10">
        <View className="bg-black/80 px-6 py-2 rounded-full flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#FF6B00" />
          <Text className="text-white ml-2 font-bold">
            {tripStatus === 'arriving' ? `Arriving in ${eta} min` : `Trip in Progress`}
          </Text>
        </View>
      </View>

      {/* SOS Button */}
      <TouchableOpacity 
        onPress={handleSOSPress}
        className="absolute bottom-32 left-4 w-14 h-14 bg-emergency rounded-full items-center justify-center shadow-lg z-20"
      >
        <Ionicons name="warning" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-6 shadow-2xl z-10">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mr-4">
            <Ionicons name="person" size={24} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">{driver.name}</Text>
            <Text className="text-gray-400 text-sm">{vehicle.type} • {vehicle.seats} Seater</Text>
            <Text className="text-accent text-xs mt-1">{driver.vehicle}</Text>
          </View>
          <TouchableOpacity className="bg-green-600 p-3 rounded-full">
            <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {tripStatus === 'arriving' && (
          <View className="bg-gray-800 p-4 rounded-xl mb-4 items-center">
            <Text className="text-gray-400 text-sm mb-2">Show this OTP to driver</Text>
            <Text className="text-3xl font-bold text-accent tracking-widest">{otp}</Text>
            <TouchableOpacity onPress={handleStartTrip} className="mt-4 bg-accent py-3 px-8 rounded-lg">
              <Text className="text-white font-bold">Simulate Start Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {tripStatus === 'started' && (
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Distance Traveled</Text>
              <Text className="text-white font-bold">{kmTraveled.toFixed(1)} km</Text>
            </View>
            <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <View style={{ width: `${Math.min(100, (kmTraveled / 10) * 100)}%` }} className="h-full bg-accent" />
            </View>
            <TouchableOpacity onPress={handleEndTrip} className="mt-4 bg-red-600 py-3 rounded-lg items-center">
              <Text className="text-white font-bold">End Trip (Demo)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SOS Modal */}
      <Modal visible={showSOSConfirm} transparent animationType="fade">
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="bg-gray-900 w-full p-6 rounded-2xl border border-emergency">
            <Ionicons name="warning" size={48} color="#FF3B30" className="self-center mb-4" />
            <Text className="text-white text-xl font-bold text-center mb-2">Emergency SOS</Text>
            <Text className="text-gray-400 text-center mb-6">Call police (100) and notify contacts?</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setShowSOSConfirm(false)} className="flex-1 bg-gray-700 py-3 rounded-lg mr-2 items-center">
                <Text className="text-white font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSOS} className="flex-1 bg-emergency py-3 rounded-lg ml-2 items-center">
                <Text className="text-white font-bold">Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
