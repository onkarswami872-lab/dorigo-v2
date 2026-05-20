import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencySOSScreen() {
  const navigation = useNavigation<any>();

  const handleDirectCall = (number: string) => {
    const url = Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMERGENCY SOS</Text>
        <TouchableOpacity onPress={() => handleDirectCall('112')} style={styles.iconButton}>
          <Ionicons name="call" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Ionicons name="warning" size={18} color="#CC0000" />
        <Text style={styles.warningText}>ONLY use in real emergencies. False alerts may be penalized.</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Ambulance Card */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('AmbulanceRequest')}
          style={styles.ambulanceCard}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="medical" size={32} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>AMBULANCE</Text>
          <Text style={styles.cardSubtitle}>Medical Emergency</Text>
          <Text style={styles.cardDescription}>Get emergency medical help immediately</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>REQUEST AMBULANCE</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Police Card */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('PoliceRequest')}
          style={styles.policeCard}
        >
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="shield" size={32} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>POLICE & HELPLINE</Text>
          <Text style={styles.cardSubtitle}>Law & Safety Emergency</Text>
          <Text style={styles.cardDescription}>Report crime, accident, or get immediate police assistance</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>REPORT EMERGENCY</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Direct Dial */}
        <View style={styles.directDialContainer}>
          <Text style={styles.directDialLabel}>OR DIRECTLY CALL</Text>
          <View style={styles.directDialButtons}>
            <TouchableOpacity onPress={() => handleDirectCall('108')} style={[styles.dialButton, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.dialButtonText}>108</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDirectCall('112')} style={[styles.dialButton, { backgroundColor: '#1C3D5A' }]}>
              <Text style={styles.dialButtonText}>112</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.directDialSubtext}>24x7 Emergency Services</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFCC00',
    opacity: 0.9,
  },
  warningText: {
    color: '#CC0000',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  ambulanceCard: {
    backgroundColor: '#CC0000',
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
    marginBottom: 16,
  },
  policeCard: {
    backgroundColor: '#1C3D5A',
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cardFooterText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  directDialContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  directDialLabel: {
    color: '#6B7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  directDialButtons: {
    flexDirection: 'row',
    gap: 24,
  },
  dialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  directDialSubtext: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 12,
  },
});
