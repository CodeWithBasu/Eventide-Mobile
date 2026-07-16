import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import CalendarScreen from './src/screens/CalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#18181b' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
        initialRouteName={user ? 'Calendar' : 'Login'}
      >
        <Stack.Screen 
          name="Login" 
          options={{ headerShown: false }}
        >
          {props => <LoginScreen {...props} onLoginSuccess={setUser} />}
        </Stack.Screen>
        
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ 
            title: 'Eventide',
            headerBackVisible: false,
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
