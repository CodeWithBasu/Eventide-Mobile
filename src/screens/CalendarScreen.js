import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { MotiView } from 'moti';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  
  // Calendar State
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert('Failed to fetch events');
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

  const handleAddEvent = async () => {
    if (!newEventName || !newEventTime) {
      alert('Please enter an event name and time.');
      return;
    }

    setIsSubmitting(true);
    try {
      const d = new Date(selectedDate);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthName = monthNames[d.getMonth()];
      const day = d.getDate();

      const res = await fetch('https://eventide-calender.vercel.app/api/mobile/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventName,
          month: monthName,
          startDay: day,
          endDay: day,
          category: 'Mobile',
          color: 'blue',
          startTime: newEventTime,
          endTime: newEventTime,
          tags: ['mobile'],
          description: newEventDesc,
          userId: user.id
        })
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Event added successfully!');
        setIsModalVisible(false);
        setNewEventName('');
        setNewEventTime('');
        setNewEventDesc('');
        if (user) fetchEvents(user.id);
      } else {
        alert(data.error || 'Failed to add event');
      }
    } catch (error) {
      alert('Network error. Could not connect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to convert Next.js date format to ISO format
  const getIsoDate = (monthStr, dayNum) => {
    const monthMap = {
      "January": "01", "February": "02", "March": "03", "April": "04",
      "May": "05", "June": "06", "July": "07", "August": "08",
      "September": "09", "October": "10", "November": "11", "December": "12"
    };
    const mm = monthMap[monthStr] || "01";
    const dd = String(dayNum).padStart(2, '0');
    // Using current year for this project
    return `${new Date().getFullYear()}-${mm}-${dd}`;
  };

  // Generate dots for the calendar
  const markedDates = {
    [selectedDate]: { selected: true, selectedColor: '#3b82f6' }
  };
  events.forEach(event => {
    if (event.month && event.startDay) {
      const isoDate = getIsoDate(event.month, event.startDay);
      if (!markedDates[isoDate]) {
        markedDates[isoDate] = { marked: true, dotColor: '#ec4899' };
      } else if (isoDate !== selectedDate) {
        markedDates[isoDate].marked = true;
        markedDates[isoDate].dotColor = '#ec4899';
      }
    }
  });

  // Filter events for the selected day
  const filteredEvents = events.filter(e => getIsoDate(e.month, e.startDay) === selectedDate);

  const renderEvent = ({ item, index }) => {
    const isSaved = savedEventIds.includes(item.id);
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, delay: index * 100 }}
      >
        <View className="bg-zinc-800 p-4 rounded-xl mb-4 border border-zinc-700 flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
          <Text className="text-blue-400 font-medium mb-1">{item.time}</Text>
          <Text className="text-zinc-400 text-sm" numberOfLines={2}>{item.description}</Text>
        </View>
        <View className="items-end">
          <View className={`px-3 py-1 rounded-full ${isSaved ? 'bg-pink-500/20' : 'bg-zinc-700'}`}>
            <Text className={`${isSaved ? 'text-pink-400' : 'text-zinc-300'} font-bold`}>
              {isSaved ? '♥ Saved' : '♡ Save'}
            </Text>
          </View>
        </View>
      </MotiView>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-950">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-6 pb-4 bg-zinc-900 border-b border-zinc-800">
        <Text className="text-white text-2xl font-extrabold tracking-tight">Eventide</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
          <Text className="text-zinc-300 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        {/* Calendar Widget */}
        <View className="px-4 py-4">
          <View className="rounded-2xl overflow-hidden border border-zinc-800">
            <Calendar
              current={selectedDate}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={markedDates}
              theme={{
                backgroundColor: '#18181b', // zinc-900
                calendarBackground: '#18181b',
                textSectionTitleColor: '#a1a1aa',
                selectedDayBackgroundColor: '#3b82f6',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3b82f6',
                dayTextColor: '#e4e4e7',
                textDisabledColor: '#3f3f46',
                dotColor: '#ec4899',
                selectedDotColor: '#ffffff',
                arrowColor: '#3b82f6',
                monthTextColor: '#ffffff',
                indicatorColor: '#3b82f6',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
        </View>

        {/* Selected Day Events */}
        <View className="px-4 pb-24">
          <View className="flex-row justify-between items-end mb-4 mt-2">
            <View>
              <Text className="text-white text-xl font-bold">
                {selectedDate === today ? 'Today\'s Events' : 'Events on ' + selectedDate}
              </Text>
              <Text className="text-zinc-400 mt-1">{filteredEvents.length} events found</Text>
            </View>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <TouchableOpacity 
                onPress={() => setIsModalVisible(true)}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-bold">+ Add Event</Text>
              </TouchableOpacity>
            </MotiView>
          </View>

          {filteredEvents.length > 0 ? (
            filteredEvents.map((item, index) => (
              <View key={item.id}>
                {renderEvent({ item, index })}
              </View>
            ))
          ) : (
            <MotiView 
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring' }}
              className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 items-center justify-center mt-4"
            >
              <Text className="text-zinc-400 text-lg mb-4 text-center">No events scheduled for this day.</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)} className="bg-zinc-800 px-6 py-3 rounded-xl border border-zinc-700">
                <Text className="text-blue-400 font-bold">Create First Event</Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          {/* Backdrop overlay */}
          <MotiView 
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60" 
          />
          
          <MotiView 
            from={{ opacity: 0, translateY: 400 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="bg-zinc-900 rounded-t-3xl p-6 border-t border-zinc-800"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-2xl font-bold">Add New Event</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-zinc-800 p-2 rounded-full">
                <Text className="text-zinc-400 font-bold px-2">X</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-zinc-400 mb-2 font-semibold">Event Name</Text>
            <TextInput
              className="bg-zinc-950 text-white p-4 rounded-xl mb-4 border border-zinc-800"
              placeholder="e.g. Project Meeting"
              placeholderTextColor="#52525b"
              value={newEventName}
              onChangeText={setNewEventName}
            />

            <Text className="text-zinc-400 mb-2 font-semibold">Time</Text>
            <TextInput
              className="bg-zinc-950 text-white p-4 rounded-xl mb-4 border border-zinc-800"
              placeholder="e.g. 10:00 AM"
              placeholderTextColor="#52525b"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />

            <Text className="text-zinc-400 mb-2 font-semibold">Description (Optional)</Text>
            <TextInput
              className="bg-zinc-950 text-white p-4 rounded-xl mb-6 border border-zinc-800"
              placeholder="Add details here..."
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              value={newEventDesc}
              onChangeText={setNewEventDesc}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              onPress={handleAddEvent}
              disabled={isSubmitting}
              className={`bg-blue-600 w-full py-4 rounded-xl items-center ${isSubmitting ? 'opacity-70' : ''}`}
            >
              <Text className="text-white font-bold text-lg">
                {isSubmitting ? 'Saving...' : 'Save Event'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
