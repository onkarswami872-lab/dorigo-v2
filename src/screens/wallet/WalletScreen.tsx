import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';

const TRANSACTIONS = [
  { id: 1, type: 'Credit', desc: 'Wallet Top-up', amount: 500, date: 'May 18, 2026' },
  { id: 2, type: 'Debit', desc: 'Ride Payment - #1234', amount: -450, date: 'May 18, 2026' },
  { id: 3, type: 'Credit', desc: 'Referral Bonus', amount: 50, date: 'May 10, 2026' },
];

export default function WalletScreen() {
  const [balance, setBalance] = useState(100);

  const handleAddMoney = (amount: number) => {
    Alert.alert("Razorpay", `Proceeding to add ₹${amount} via Razorpay...`);
    // Simulate success
    setTimeout(() => {
      setBalance(prev => prev + amount);
      Alert.alert("Success", `₹${amount} added to wallet.`);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="p-4 border-b border-gray-800">
        <Text className="text-white text-2xl font-bold">Wallet</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Balance Card */}
        <View className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl mb-6 shadow-lg">
          <Text className="text-gray-400 text-sm mb-1">Current Balance</Text>
          <Text className="text-white text-4xl font-bold mb-4">₹{balance.toFixed(2)}</Text>
          <Button title="Add Money" onPress={() => handleAddMoney(100)} variant="primary" />
        </View>

        {/* Quick Add Amounts */}
        <Text className="text-white font-bold mb-3">Quick Add</Text>
        <View className="flex-row justify-between mb-8">
          {[100, 200, 500, 1000].map((amt) => (
            <TouchableOpacity 
              key={amt} 
              onPress={() => handleAddMoney(amt)}
              className="bg-gray-800 py-3 px-4 rounded-lg items-center flex-1 mx-1"
            >
              <Text className="text-white font-bold">₹{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Referral Card */}
        <View className="bg-accent/10 border border-accent/30 p-4 rounded-xl mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-accent font-bold text-lg">Invite Friends</Text>
            <Text className="text-gray-300 text-xs">Get ₹50 for every friend who joins.</Text>
          </View>
          <TouchableOpacity className="bg-accent px-4 py-2 rounded-lg">
            <Text className="text-white font-bold text-sm">Share</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <Text className="text-white font-bold mb-3">Transactions</Text>
        {TRANSACTIONS.map((tx) => (
          <View key={tx.id} className="flex-row justify-between items-center py-3 border-b border-gray-800">
            <View className="flex-row items-center">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${tx.type === 'Credit' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                <Ionicons name={tx.type === 'Credit' ? 'arrow-down' : 'arrow-up'} size={20} color={tx.type === 'Credit' ? '#34C759' : '#EF4444'} />
              </View>
              <View>
                <Text className="text-white font-bold text-sm">{tx.desc}</Text>
                <Text className="text-gray-500 text-xs">{tx.date}</Text>
              </View>
            </View>
            <Text className={`font-bold ${tx.type === 'Credit' ? 'text-green-400' : 'text-white'}`}>
              {tx.type === 'Credit' ? '+' : ''}₹{Math.abs(tx.amount)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
