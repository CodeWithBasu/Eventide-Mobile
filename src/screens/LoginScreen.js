import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://eventide-calender.vercel.app/api/mobile/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
          navigation.replace('Home');
        }
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-slate-50 dark:bg-zinc-900 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-slate-900 dark:text-white text-3xl font-bold mb-2 text-center">Welcome Back</Text>
        <Text className="text-slate-500 dark:text-zinc-400 text-center mb-8">Sign in to your Eventide account</Text>
        
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-slate-700 dark:text-zinc-300 mb-2 font-semibold">Email</Text>
            <TextInput
              className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-200 dark:border-zinc-700"
              placeholder="Enter your email"
              placeholderTextColor="#71717a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View className="mt-4">
            <Text className="text-slate-700 dark:text-zinc-300 mb-2 font-semibold">Password</Text>
            <TextInput
              className="bg-white dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-3 rounded-lg border border-slate-200 dark:border-zinc-700"
              placeholder="Enter your password"
              placeholderTextColor="#71717a"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          className={`bg-blue-600 w-full py-4 rounded-xl items-center flex-row justify-center ${isLoading ? 'opacity-70' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
