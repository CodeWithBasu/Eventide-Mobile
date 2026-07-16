import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  const loadUserAndEvents = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        navigation.replace('Login');
        return;
      }
      
      const userData = JSON.parse(userStr);
      setUser(userData);
      await fetchEvents(userData.id);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEvents = async (userId) => {
    try {
      const res = await fetch(`https://eventide-calender.vercel.app/api/mobile/events?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
        setSavedEventIds(data.savedEventIds);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserAndEvents();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    if (user) fetchEvents(user.id);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const renderEvent = ({ item }) => {
    const isSaved = savedEventIds.includes(item.id);
    return (
      <View className="bg-zinc-800 p-4 rounded-xl mb-4 border border-zinc-700 flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
          <Text className="text-blue-400 font-medium mb-1">{item.date} • {item.time}</Text>
          <Text className="text-zinc-400 text-sm" numberOfLines={2}>{item.description}</Text>
        </View>
        <View className="items-end">
          <View className={`px-3 py-1 rounded-full ${isSaved ? 'bg-pink-500/20' : 'bg-zinc-700'}`}>
            <Text className={`${isSaved ? 'text-pink-400' : 'text-zinc-300'} font-bold`}>
              {isSaved ? '♥ Saved' : '♡ Save'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900 px-4 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">Your Events</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-zinc-800 px-4 py-2 rounded-lg">
          <Text className="text-zinc-300 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
        ListEmptyComponent={
          <Text className="text-zinc-500 text-center mt-10">No events found.</Text>
        }
      />
    </View>
  );
}
