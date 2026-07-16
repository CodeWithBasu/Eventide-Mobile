import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      <Text className="text-white text-2xl font-bold mb-4">Eventide Native</Text>
      <TouchableOpacity 
        className="bg-blue-500 px-6 py-3 rounded-full"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white font-semibold text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      <Text className="text-white text-xl">Login Screen Coming Soon</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#18181b' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Eventide' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
