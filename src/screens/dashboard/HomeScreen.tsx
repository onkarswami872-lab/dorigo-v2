import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ✅ Fixed: API Key now defined here
const LOCATIONIQ_API_KEY = 'pk.b5d0d39c629b03e185b0d137936c9029';

// ✅ Premium Dark Map Style
const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { elementType: "labels.icon", stylers: [{ color: "#64748b" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#064e3b" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e2e8f0" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f8fafc" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0c4a6e" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }]
  }
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const [startLocation, setStartLocation] = useState<any>(null);
  const [endLocation, setEndLocation] = useState<any>(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [tempPosition, setTempPosition] = useState<any>(null);

  useEffect(() => { initLocation(); }, []);
  
  useEffect(() => { 
    if (startLocation?.lat && endLocation?.lat) {
      calculateRoute();
    }
  }, [startLocation, endLocation]);

  const initLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      const address = await getAddress(lat, lng);
      const locData = { lat, lng, name: address };
      setLocation(locData);
      setStartLocation(locData);
      setStartQuery(address);
    } finally { setIsLoading(false); }
  };

  const getAddress = async (lat: number, lng: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (result.length > 0) {
        const r = result[0];
        return [r.city, r.region].filter(Boolean).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (e) {}
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const calculateRoute = () => {
    if (!startLocation?.lat || !endLocation?.lat) return;
    setIsLoadingRoute(true);
    const dist = getDistanceFromLatLonInKm(startLocation.lat, startLocation.lng, endLocation.lat, endLocation.lng);
    const dur = Math.round(dist * 1.2);
    setDistance(Math.round(dist * 10) / 10);
    setDuration(dur);
    setIsLoadingRoute(false);
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const useCurrentLocation = () => {
    if (!location) return Alert.alert("Info", "Getting location...");
    if (activeInput === 'start' || !activeInput) {
      setStartLocation(location);
      setStartQuery('Current Location');
    } else {
      setEndLocation(location);
      setEndQuery('Current Location');
    }
  };

  const openMapPicker = (type: 'start' | 'end') => {
    setActiveInput(type);
    setTempPosition(type === 'start' ? startLocation : endLocation);
    setShowMapPicker(true);
  };

  const confirmMapSelection = async () => {
    if (!tempPosition?.lat) return;
    const address = await getAddress(tempPosition.lat, tempPosition.lng);
    const loc = { ...tempPosition, name: address };
    if (activeInput === 'start') { setStartLocation(loc); setStartQuery(address); }
    else { setEndLocation(loc); setEndQuery(address); }
    setShowMapPicker(false);
  };

  const searchLocations = async (query: string) => {
    if (query.length < 3) { setSuggestions([]); return; }
    try {
      const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data.map((item: any, i: number) => ({
          id: `${i}_${Date.now()}`,
          name: item.display_name,
          lat: parseFloat(item.lat) || 0,
          lng: parseFloat(item.lon) || 0
        })));
      }
    } catch (e) { console.error(e); }
  };

  const selectLocation = (item: any) => {
    if (activeInput === 'start') { setStartLocation(item); setStartQuery(item.name.split(',')[0]); }
    else { setEndLocation(item); setEndQuery(item.name.split(',')[0]); }
    setSuggestions([]);
  };

  const getRoutePoints = () => {
    if (!startLocation?.lat || !endLocation?.lat) return [];
    const points = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const baseLat = startLocation.lat + (endLocation.lat - startLocation.lat) * progress;
      const baseLng = startLocation.lng + (endLocation.lng - startLocation.lng) * progress;
      const offset = Math.sin(progress * Math.PI) * 0.015;
      const lat = typeof baseLat === 'number' && !isNaN(baseLat) ? baseLat + offset : startLocation.lat;
      const lng = typeof baseLng === 'number' && !isNaN(baseLng) ? baseLng + offset : startLocation.lng;
      points.push({ latitude: lat, longitude: lng });
    }
    return points;
  };

  if (isLoading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FF6B00" /><Text style={styles.loadingText}>Getting your location...</Text></View>;

  const routePoints = getRoutePoints();

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} 
        provider={PROVIDER_GOOGLE} 
        style={StyleSheet.absoluteFillObject} 
        region={{ latitude: startLocation?.lat || 12.97, longitude: startLocation?.lng || 77.59, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
        customMapStyle={DARK_MAP_STYLE}
      >
        {startLocation?.lat && <Marker coordinate={{ latitude: startLocation.lat, longitude: startLocation.lng }} pinColor="#3B82F6" title="Pickup" />}
        {endLocation?.lat && <Marker coordinate={{ latitude: endLocation.lat, longitude: endLocation.lng }} pinColor="#FF6B00" title="Drop" />}
        {routePoints.length >= 2 && <Polyline coordinates={routePoints} strokeColor="#FF6B00" strokeWidth={5} />}
      </MapView>

      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <View style={styles.blueDot} />
          <TextInput style={styles.input} placeholder="Pickup location" placeholderTextColor="#9CA3AF" value={startQuery} onFocus={() => setActiveInput('start')} onChangeText={(t) => { setStartQuery(t); setActiveInput('start'); searchLocations(t); }} />
          <TouchableOpacity onPress={() => openMapPicker('start')} style={styles.mapIcon}><Ionicons name="map-outline" size={20} color="#6B7280" /></TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.orangeDot} />
          <TextInput style={styles.input} placeholder="Destination" placeholderTextColor="#9CA3AF" value={endQuery} onFocus={() => setActiveInput('end')} onChangeText={(t) => { setEndQuery(t); setActiveInput('end'); searchLocations(t); }} />
          <TouchableOpacity onPress={() => openMapPicker('end')} style={styles.mapIcon}><Ionicons name="map-outline" size={20} color="#6B7280" /></TouchableOpacity>
        </View>

        {/* ✅ Changed to Orange to match UI */}
        <TouchableOpacity onPress={useCurrentLocation} style={styles.currentLocationButton}>
          <Ionicons name="location" size={18} color="#FFF" />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList data={suggestions} keyExtractor={(item) => item.id} renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => selectLocation(item)}>
                <Text style={styles.suggestionText} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )} />
          </View>
        )}
      </View>

      {distance > 0 && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoRow}>
            <View><Text style={styles.infoLabel}>Distance</Text><Text style={styles.infoValue}>{distance.toFixed(1)} km</Text></View>
            <View><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{duration} min</Text></View>
            <TouchableOpacity onPress={() => navigation.navigate('VehicleSelection', { 
              pickup: startLocation, 
              drop: endLocation, 
              distance,
              tollInfo: { hasTolls: false, tollAmount: 0, tollCount: 0 }
            })} style={styles.searchButton}><Text style={styles.searchButtonText}>Search</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {isLoadingRoute && <View style={styles.loadingRouteCard}><ActivityIndicator color="#FF6B00" /><Text style={styles.loadingRouteText}>Calculating route...</Text></View>}

      <TouchableOpacity onPress={() => navigation.navigate('EmergencySOS')} style={styles.emergencyButton}>
        <Ionicons name="medical" size={28} color="#FFF" />
        <Text style={styles.emergencyButtonText}>EMERGENCY SOS</Text>
      </TouchableOpacity>

      <Modal visible={showMapPicker} transparent>
        <View style={styles.modalContainer}>
          <MapView style={StyleSheet.absoluteFillObject} region={{ latitude: tempPosition?.lat || 12.97, longitude: tempPosition?.lng || 77.59, latitudeDelta: 0.05, longitudeDelta: 0.05 }} onPress={(e) => setTempPosition({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })}>
            {tempPosition?.lat && <Marker coordinate={tempPosition} pinColor="#FF6B00" draggable onDragEnd={(e) => setTempPosition({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })} />}
          </MapView>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select on Map</Text>
            <Text style={styles.modalSubtitle}>Drag pin or tap anywhere</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowMapPicker(false)} style={styles.modalCancelButton}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={confirmMapSelection} style={styles.modalConfirmButton}><Text style={styles.modalConfirmText}>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#FFF', marginTop: 16 },
  inputCard: { position: 'absolute', top: 48, left: 16, right: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 12 },
  orangeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B00', marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1F2937' },
  mapIcon: { padding: 8 },
  currentLocationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B00', paddingVertical: 12, borderRadius: 12, marginBottom: 12 },
  currentLocationText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  suggestionsContainer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', maxHeight: 192 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  suggestionText: { color: '#374151', fontSize: 14 },
  routeInfoCard: { position: 'absolute', bottom: 128, left: 16, right: 16, backgroundColor: '#1F2937', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  routeInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoLabel: { color: '#9CA3AF', fontSize: 12 },
  infoValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  searchButton: { backgroundColor: '#FF6B00', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  searchButtonText: { color: '#FFF', fontWeight: 'bold' },
  loadingRouteCard: { position: 'absolute', bottom: 128, left: 16, right: 16, backgroundColor: '#1F2937', borderRadius: 16, padding: 16, alignItems: 'center' },
  loadingRouteText: { color: '#9CA3AF', fontSize: 12, marginTop: 8 },
  emergencyButton: { position: 'absolute', bottom: 96, left: 32, right: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#DC2626', paddingVertical: 16, borderRadius: 9999, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 10 },
  emergencyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 12 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' },
  modalContent: { position: 'absolute', top: 64, left: 16, right: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 16 },
  modalTitle: { color: '#1F2937', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { color: '#6B7280', fontSize: 14, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelButton: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { color: '#374151', fontWeight: 'bold' },
  modalConfirmButton: { flex: 1, backgroundColor: '#FF6B00', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalConfirmText: { color: '#FFF', fontWeight: 'bold' },
});
