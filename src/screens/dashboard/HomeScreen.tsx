import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, 
  Linking, Platform, Animated, TextInput, FlatList, ActivityIndicator,
  Modal, ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistanceFromLatLonInKm } from '../../utils/fareCalculator';

const LOCATIONIQ_API_KEY = 'pk.b5d0d39c629b03e185b0d137936c9029';

// Improved Dark Map Style
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a0aec0" }] },
  { elementType: "labels.icon", stylers: [{ color: "#718096" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e0" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d3748" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#4a5568" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#e2e8f0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#1a365d" }] },
];

// --- Custom Wheel Picker Component ---
// This replaces the native DateTimePicker to prevent double-dialog issues
const WheelPicker = ({ items, selectedIndex, onSelectionChange, height = 150 }) => {
  const itemHeight = 40;
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  useEffect(() => {
    scrollToIndex(selectedIndex);
  }, []);

  return (
    <View style={{ height: height, overflow: 'hidden', position: 'relative' }}>
      {/* Selection Indicator Lines */}
      <View style={{ position: 'absolute', top: height / 2 - 20, left: 0, right: 0, height: 40, borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#FF6B00', zIndex: 10 }} />
      
      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item, index) => index.toString()}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: (height - itemHeight) / 2 }}
        getItemLayout={(data, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
          if (index !== selectedIndex && index >= 0 && index < items.length) {
            onSelectionChange(index);
          }
        }}
        renderItem={({ item, index }) => (
          <View style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ 
              fontSize: selectedIndex === index ? 22 : 16, 
              fontWeight: selectedIndex === index ? 'bold' : 'normal',
              color: selectedIndex === index ? '#1a202c' : '#a0aec0'
            }}>
              {item}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startQuery, setStartQuery] = useState('Current Location');
  const [endQuery, setEndQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const [startLocation, setStartLocation] = useState<any>(null);
  const [endLocation, setEndLocation] = useState<any>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  
  const [isScheduled, setIsScheduled] = useState(false);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Custom Picker State
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(0);
  const [selectedAmPmIndex, setSelectedAmPmIndex] = useState(0);

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isForWork, setIsForWork] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Data for Pickers
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = [2024, 2025, 2026, 2027];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const ampm = ['AM', 'PM'];

  useEffect(() => {
    startPulseAnimation();
    requestLocationPermission();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setIsLoading(false); return; }
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setStartLocation({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude, name: 'Current Location' });
    } finally { setIsLoading(false); }
  };

  const fetchLocations = async (query: string) => {
    if (query.length < 3) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setSuggestions(data.map((item: any, index: number) => ({
          id: `${item.place_id || index}_${Date.now()}_${Math.random()}`,
          name: item.display_name || item.name || query,
          lat: parseFloat(item.lat) || 0,
          lng: parseFloat(item.lon) || 0
        })));
      }
    } catch (error) { console.error(error); }
    finally { setIsSearching(false); }
  };

  const handleSelectLocation = (item: any) => {
    if (activeInput === 'start') {
      setStartLocation(item);
      setStartQuery(item.name.split(',')[0]);
    } else {
      setEndLocation(item);
      setEndQuery(item.name.split(',')[0]);
    }
    updateCalculations();
    setSuggestions([]);
  };

  const updateCalculations = () => {
    if (startLocation && endLocation) {
      const baseDist = getDistanceFromLatLonInKm(startLocation.lat, startLocation.lng, endLocation.lat, endLocation.lng);
      setDistanceKm(isRoundTrip ? baseDist * 1.9 : baseDist);
    }
  };

  useEffect(() => { updateCalculations(); }, [isRoundTrip, startLocation, endLocation]);

  const getRoadRoute = (start: any, end: any) => {
    if (!start || !end) return [];
    const points = [];
    for (let i = 0; i <= 10; i++) {
      points.push({ latitude: start.lat + (end.lat - start.lat) * (i / 10) + (Math.random() * 0.003), longitude: start.lng + (end.lng - start.lng) * (i / 10) + (Math.random() * 0.003) });
    }
    return points;
  };

  const handleShareLocation = async () => {
    if (!startLocation || !endLocation) return Alert.alert("Info", "Select both locations first.");
    const fare = Math.round(50 + (distanceKm * 12));
    const text = `🚗 DORIGO RIDE\n📍 From: ${startQuery}\n📍 To: ${endQuery}\n ${distanceKm.toFixed(1)} km\n ₹${fare}\n⏰ ${isScheduled ? formatDateTime(pickupDate, pickupTime) : 'ASAP'}\n${isRoundTrip ? '🔄 Round Trip' : '➡️ One Way'}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleSearchDrop = () => {
    if (!startLocation || !endLocation) return Alert.alert("Error", "Select both locations.");
    navigation.navigate('VehicleSelection', { pickup: startLocation, drop: endLocation, distance: distanceKm, isScheduled, pickupDateTime: isScheduled ? new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), pickupTime.getHours(), pickupTime.getMinutes()) : null, isRoundTrip, isForWork });
  };

  const formatDateTime = (date: Date, time: Date) => {
    return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const openScheduleModal = () => {
    // Reset picker indices based on current state
    setSelectedDayIndex(pickupDate.getDate() - 1);
    setSelectedMonthIndex(pickupDate.getMonth());
    setSelectedYearIndex(years.indexOf(pickupDate.getFullYear()));
    
    let hour = pickupTime.getHours();
    const ampmIdx = hour >= 12 ? 1 : 0;
    hour = hour % 12;
    hour = hour ? hour : 12;
    setSelectedHourIndex(hour - 1);
    setSelectedMinuteIndex(pickupTime.getMinutes());
    setSelectedAmPmIndex(ampmIdx);
    
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    const newDate = new Date(years[selectedYearIndex], selectedMonthIndex, days[selectedDayIndex]);
    const hour24 = selectedAmPmIndex === 1 ? (selectedHourIndex + 1 === 12 ? 12 : selectedHourIndex + 1 + 12) : (selectedHourIndex + 1 === 12 ? 0 : selectedHourIndex + 1);
    const newTime = new Date();
    newTime.setHours(hour24);
    newTime.setMinutes(selectedMinuteIndex);

    setPickupDate(newDate);
    setPickupTime(newTime);
    setIsScheduled(true);
    setShowScheduleModal(false);
  };

  const cancelSchedule = () => {
    setShowScheduleModal(false);
  };

  if (isLoading) return <View className="flex-1 bg-primary items-center justify-center"><ActivityIndicator size="large" color="#FF6B00" /></View>;

  return (
    <View className="flex-1 bg-primary">
      <MapView provider={PROVIDER_GOOGLE} style={StyleSheet.absoluteFillObject} region={{ latitude: startLocation?.lat || 12.97, longitude: startLocation?.lng || 77.59, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} customMapStyle={DARK_MAP_STYLE}>
        {startLocation && <Marker coordinate={{ latitude: startLocation.lat, longitude: startLocation.lng }} pinColor="#3B82F6" />}
        {endLocation && <Marker coordinate={{ latitude: endLocation.lat, longitude: endLocation.lng }} pinColor="#FF6B00" />}
        {startLocation && endLocation && <Polyline coordinates={getRoadRoute(startLocation, endLocation)} strokeColor="#FF6B00" strokeWidth={4} />}
      </MapView>

      <View className="absolute top-12 left-4 right-4 z-10">
        <View className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <View className="flex-row items-center p-3 border-b border-gray-100">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
            <TextInput className="flex-1 text-gray-800 font-bold" placeholder="Start Location" value={startQuery} onFocus={() => setActiveInput('start')} onChangeText={(t) => { setStartQuery(t); setActiveInput('start'); fetchLocations(t); }} />
          </View>
          <View className="flex-row items-center p-3">
            <View className="w-3 h-3 rounded bg-orange-500 mr-3" />
            <TextInput className="flex-1 text-gray-800" placeholder="Where to?" value={endQuery} onFocus={() => setActiveInput('end')} onChangeText={(t) => { setEndQuery(t); setActiveInput('end'); fetchLocations(t); }} />
          </View>
          {suggestions.length > 0 && (
            <View className="bg-white border-t border-gray-200 max-h-48">
              <FlatList data={suggestions} keyExtractor={(i) => i.id} renderItem={({ item }) => <TouchableOpacity className="p-3 border-b border-gray-100" onPress={() => handleSelectLocation(item)}><Text className="text-gray-700 text-sm" numberOfLines={2}>{item.name}</Text></TouchableOpacity>} />
            </View>
          )}
          {isSearching && <View className="p-3"><ActivityIndicator size="small" color="#FF6B00" /></View>}
        </View>

        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity onPress={openScheduleModal} className={`flex-1 p-3 rounded-xl flex-row items-center justify-center border ${isScheduled ? 'bg-accent border-accent' : 'bg-gray-800/90 border-gray-700'}`}>
            <Ionicons name="calendar-outline" size={18} color={isScheduled ? '#FFF' : '#9CA3AF'} />
            <Text className={`text-xs ml-1.5 font-bold ${isScheduled ? 'text-white' : 'text-gray-300'}`}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRoundTrip(!isRoundTrip)} className={`flex-1 p-3 rounded-xl flex-row items-center justify-center border ${isRoundTrip ? 'bg-accent border-accent' : 'bg-gray-800/90 border-gray-700'}`}>
            <Ionicons name="repeat-outline" size={18} color={isRoundTrip ? '#FFF' : '#9CA3AF'} />
            <Text className={`text-xs ml-1.5 font-bold ${isRoundTrip ? 'text-white' : 'text-gray-300'}`}>Round Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsForWork(!isForWork)} className={`flex-1 p-3 rounded-xl flex-row items-center justify-center border ${isForWork ? 'bg-accent border-accent' : 'bg-gray-800/90 border-gray-700'}`}>
            <Ionicons name="briefcase-outline" size={18} color={isForWork ? '#FFF' : '#9CA3AF'} />
            <Text className={`text-xs ml-1.5 font-bold ${isForWork ? 'text-white' : 'text-gray-300'}`}>For Work</Text>
          </TouchableOpacity>
        </View>

        {isScheduled && (
          <View className="bg-gray-800/90 p-3 rounded-xl mt-3 flex-row items-center justify-between border border-gray-700">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#FF6B00" />
              <View className="ml-2">
                <Text className="text-gray-400 text-xs">Pickup Time</Text>
                <Text className="text-white text-sm font-bold">{formatDateTime(pickupDate, pickupTime)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={openScheduleModal}><Ionicons name="create-outline" size={18} color="#9CA3AF" /></TouchableOpacity>
          </View>
        )}

        {distanceKm > 0 && (
          <View className="bg-gray-900/95 p-4 rounded-2xl shadow-lg mt-3">
            <View className="flex-row justify-between items-center mb-4">
              <View><Text className="text-gray-400 text-[10px] uppercase">Distance</Text><Text className="text-white font-bold text-lg">{distanceKm.toFixed(1)} km</Text></View>
              <View><Text className="text-gray-400 text-[10px] uppercase">Est. Fare</Text><Text className="text-green-400 font-bold text-lg">₹{Math.round(50 + (distanceKm * 12))}</Text></View>
              <TouchableOpacity onPress={handleShareLocation} className="bg-accent p-3 rounded-xl"><Ionicons name="share-social" size={20} color="#FFF" /></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSearchDrop} className="bg-accent py-4 rounded-xl items-center"><Text className="text-white font-bold">Search Rides</Text></TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.View style={{ transform: [{ scale: pulseAnim }], position: 'absolute', bottom: 30, left: 20, right: 20, alignItems: 'center', zIndex: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('EmergencySOS')} className="flex-row items-center px-8 py-4 rounded-full" style={{ backgroundColor: '#DC2626', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
          <Ionicons name="medical" size={28} color="#FFF" />
          <Text className="text-white font-bold text-lg ml-3">EMERGENCY SOS</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* --- COMPLETELY CUSTOM SCHEDULE MODAL (No Native Dialogs) --- */}
      <Modal visible={showScheduleModal} transparent animationType="fade" onRequestClose={cancelSchedule}>
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            {/* Header */}
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-gray-800 font-bold text-lg">Schedule Pickup</Text>
              <TouchableOpacity onPress={cancelSchedule} className="w-8 h-8 items-center justify-center">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView className="max-h-[60vh]">
              <View className="p-4">
                
                {/* Date Picker */}
                <Text className="text-gray-600 text-sm font-semibold mb-2">Date</Text>
                <View className="flex-row gap-2 bg-gray-50 rounded-xl p-2 mb-4 justify-center">
                  <View className="flex-1"><WheelPicker items={days.map(d => d.toString())} selectedIndex={selectedDayIndex} onSelectionChange={setSelectedDayIndex} height={120} /></View>
                  <View className="flex-1"><WheelPicker items={months} selectedIndex={selectedMonthIndex} onSelectionChange={setSelectedMonthIndex} height={120} /></View>
                  <View className="flex-1"><WheelPicker items={years.map(y => y.toString())} selectedIndex={selectedYearIndex} onSelectionChange={setSelectedYearIndex} height={120} /></View>
                </View>

                {/* Time Picker */}
                <Text className="text-gray-600 text-sm font-semibold mb-2">Time</Text>
                <View className="flex-row gap-2 bg-gray-50 rounded-xl p-2 justify-center">
                  <View className="flex-1"><WheelPicker items={hours.map(h => h.toString())} selectedIndex={selectedHourIndex} onSelectionChange={setSelectedHourIndex} height={120} /></View>
                  <View className="flex-1"><WheelPicker items={minutes} selectedIndex={selectedMinuteIndex} onSelectionChange={setSelectedMinuteIndex} height={120} /></View>
                  <View className="flex-1"><WheelPicker items={ampm} selectedIndex={selectedAmPmIndex} onSelectionChange={setSelectedAmPmIndex} height={120} /></View>
                </View>

              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View className="flex-row p-4 border-t border-gray-200 gap-3 bg-white">
              <TouchableOpacity onPress={cancelSchedule} className="flex-1 bg-gray-200 py-3 rounded-xl items-center">
                <Text className="text-gray-800 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSchedule} className="flex-1 bg-accent py-3 rounded-xl items-center shadow-lg shadow-orange-500/30">
                <Text className="text-white font-bold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
