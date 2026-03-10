import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Stethoscope, User } from 'lucide-react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import AIHealthChatScreen from '../screens/AIHealthChatScreen';

const Tab = createBottomTabNavigator();

// Placeholder for Profile
function ProfileScreen() {
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFD' }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Profile</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF7B54',
          tabBarInactiveTintColor: '#A0AEC0',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          }
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tab.Screen 
          name="Appointments" 
          component={AppointmentsScreen} 
          options={{
            tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
          }}
        />
        <Tab.Screen 
          name="AI Assistant" 
          component={AIHealthChatScreen} 
          options={{
            tabBarIcon: ({ color }) => <Stethoscope color={color} size={24} />,
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color }) => <User color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
