import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import RidesScreen from '../screens/ride/RidesScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import SupportScreen from '../screens/support/SupportScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Booking Screens
import VehicleSelectionScreen from '../screens/ride/VehicleSelectionScreen';
import FareBreakdownScreen from '../screens/ride/FareBreakdownScreen';
import DriverSelectionScreen from '../screens/ride/DriverSelectionScreen';
import ActiveRideScreen from '../screens/ride/ActiveRideScreen';
import PostTripScreen from '../screens/ride/PostTripScreen';

// Emergency Screens
import EmergencySOSScreen from '../screens/emergency/EmergencySOSScreen';
import AmbulanceRequestScreen from '../screens/emergency/AmbulanceRequestScreen';
import PoliceRequestScreen from '../screens/emergency/PoliceRequestScreen';
import EmergencyConfirmScreen from '../screens/emergency/EmergencyConfirmScreen';
import EmergencyTrackingScreen from '../screens/emergency/EmergencyTrackingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#FF6B00', 
      tabBarInactiveTintColor: 'gray', 
      tabBarStyle: { 
        backgroundColor: '#0A0A0A', 
        borderTopColor: '#1F2937', 
        height: 60, 
        paddingBottom: 10, 
        paddingTop: 10 
      } 
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={focused ? '#FF6B00' : 'gray'} /> }} />
      <Tab.Screen name="Rides" component={RidesScreen} options={{ tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'car' : 'car-outline'} size={24} color={focused ? '#FF6B00' : 'gray'} /> }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={focused ? '#FF6B00' : 'gray'} /> }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{ tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={24} color={focused ? '#FF6B00' : 'gray'} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? '#FF6B00' : 'gray'} /> }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="VehicleSelection" component={VehicleSelectionScreen} />
        <Stack.Screen name="FareBreakdown" component={FareBreakdownScreen} />
        <Stack.Screen name="DriverSelection" component={DriverSelectionScreen} />
        <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
        <Stack.Screen name="PostTrip" component={PostTripScreen} />
        <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
        <Stack.Screen name="AmbulanceRequest" component={AmbulanceRequestScreen} />
        <Stack.Screen name="PoliceRequest" component={PoliceRequestScreen} />
        <Stack.Screen name="EmergencyConfirm" component={EmergencyConfirmScreen} />
        <Stack.Screen name="EmergencyTracking" component={EmergencyTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
