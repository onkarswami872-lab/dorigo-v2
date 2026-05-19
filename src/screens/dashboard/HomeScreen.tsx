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
  TextInput,
  FlatList,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SAVED_LOCATIONS = [
  { id: 1, label: 'Home', lat: 12.9716, lng: 77.5946 },
  { id: 2, label: 'Office', lat: 12.9352, lng: 77.6245 },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrop, setSelectedDrop] = useState<any>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startPulseAnimation();
    requestLocationPermission();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setIsLoading(false);
      Alert.alert('Permission Denied', 'Please enable location services.');
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmbulancePress = async () => {
    Alert.alert("Emergency", "Call ambulance now?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Yes", 
        onPress: async () => {
          if (!location) return;
          const url = Platform.OS === 'android' ? `tel:108` : `telprompt:108`;
          await Linking.openURL(url);
        } 
      }
    ]);
  };

  const mockSuggestions = [
    { id: 1, name: 'Bangalore Airport', lat: 13.1986, lng: 77.7066 },
    { id: 2, name: 'Majestic Bus Stand', lat: 12.9767, lng: 77.5714 },
    { id: 3, name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
  ];

  const handleSelectLocation = (item: any) => {
    setSelectedDrop(item);
    setSearchQuery(item.name);
    setShowSuggestions(false);
    
    navigation.navigate('VehicleSelection', {
      pickup: location ? { lat: location.coords.latitude, lng: location.coords.longitude } : region,
      drop: item
    });
  };

  // Mock Route Coordinates (Curved line for realism)
  const getMockRouteCoordinates = (start: any, end: any) => {
    if (!start || !end) return [];
    const midLat = (start.lat + end.lat) / 2 + 0.02;
    const midLng = (start.lng + end.lng) / 2 - 0.02;
    return [
      { latitude: start.lat, longitude: start.lng },
      { latitude: midLat, longitude: midLng },
      { latitude: end.lat, longitude: end.lng }
    ];
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text className="text-white mt-4">Locating you...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={region}
        showsUserLocation={true}
      >
        {/* Pickup Marker */}
        {location && (
          <Marker 
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} 
            title="Pickup" 
            pinColor="#3B82F6" 
          />
        )}
        
        {/* Drop Marker */}
        {selectedDrop && (
          <Marker 
            coordinate={{ latitude: selectedDrop.lat, longitude: selectedDrop.lng }} 
            title="Drop" 
            pinColor="#FF6B00" 
          />
        )}
        
        {/* Route Line */}
        {location && selectedDrop && (
           <Polyline 
             coordinates={getMockRouteCoordinates(
               { lat: location.coords.latitude, lng: location.coords.longitude }, 
               selectedDrop
             )}
             strokeColor="#FF6B00"
             strokeWidth={4}
           />
        )}
      </MapView>

      {/* Search Bar */}
      <View className="absolute top-12 left-4 right-4 z-10">
        <View className="bg-white rounded-lg shadow-lg overflow-hidden">
          <View className="flex-row items-center p-3 border-b border-gray-100">
            <Ionicons name="search" size={20} color="#374151" />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Enter drop location"
              value={searchQuery || ''}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
          </View>
          
          {showSuggestions && searchQuery && searchQuery.length > 0 && (
            <View className="bg-white max-h-60">
              <FlatList
                data={mockSuggestions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    className="p-4 border-b border-gray-100 flex-row items-center"
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Ionicons name="location-outline" size={20} color="#FF6B00" />
                    <Text className="ml-3 text-gray-700">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        
        <View className="flex-row mt-3">
          {SAVED_LOCATIONS.map(loc => (
            <TouchableOpacity 
              key={loc.id} 
              className="bg-white/90 px-3 py-2 rounded-full mr-2 shadow-sm"
              onPress={() => handleSelectLocation(loc)}
            >
              <Text className="text-xs font-bold text-gray-700">{loc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ambulance Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }], position: 'absolute', bottom: 100, right: 20, zIndex: 20 }}>
        <TouchableOpacity onPress={handleAmbulancePress} className="bg-emergency w-16 h-16 rounded-full items-center justify-center shadow-lg border-4 border-white/20">
          <Ionicons name="medical" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[10px] font-bold mt-1 bg-emergency/80 px-2 py-1 rounded text-center">AMBULANCE</Text>
      </Animated.View>
    </View>
  );
}
