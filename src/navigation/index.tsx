import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Import Main Tab Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import RidesScreen from '../screens/ride/RidesScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import SupportScreen from '../screens/support/SupportScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Import Ride Booking Screens
import VehicleSelectionScreen from '../screens/ride/VehicleSelectionScreen';
import DriverSelectionScreen from '../screens/ride/DriverSelectionScreen';
import FareBreakdownScreen from '../screens/ride/FareBreakdownScreen';
import ActiveRideScreen from '../screens/ride/ActiveRideScreen';
import PostTripScreen from '../screens/ride/PostTripScreen'; // Added PostTrip

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Rides') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'Wallet') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Support') iconName = focused ? 'help-circle' : 'help-circle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopColor: '#1F2937',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rides" component={RidesScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        
        {/* Main App Tabs */}
        <Stack.Screen name="Main" component={MainTabs} />
        
        {/* Ride Booking Flow */}
        <Stack.Screen name="VehicleSelection" component={VehicleSelectionScreen} />
        <Stack.Screen name="DriverSelection" component={DriverSelectionScreen} />
        <Stack.Screen name="FareBreakdown" component={FareBreakdownScreen} />
        <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
        <Stack.Screen name="PostTrip" component={PostTripScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
