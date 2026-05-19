import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Book Any Ride',
    description: 'From 4-seaters to 25-seater buses. We have it all.',
    icon: 'car-sport',
  },
  {
    id: '2',
    title: 'One-Tap Ambulance',
    description: 'Emergency services at your fingertips. Fast & Reliable.',
    icon: 'medical',
  },
  {
    id: '3',
    title: 'Verified Drivers',
    description: 'Transparent pricing and fully verified professionals.',
    icon: 'shield-checkmark',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }: any) => (
    <View style={{ width }} className="items-center justify-center px-8">
      <Ionicons name={item.icon as any} size={100} color="#FF6B00" />
      <Text className="text-2xl font-bold text-white mt-8 mb-4 text-center">{item.title}</Text>
      <Text className="text-gray-400 text-center text-lg">{item.description}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />
      
      <View className="absolute bottom-10 w-full items-center">
        <View className="flex-row mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={}
            />
          ))}
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          className="bg-accent px-8 py-4 rounded-full w-11/12 items-center"
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
