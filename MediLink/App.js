import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AgendarScreen from './screens/AgendarScreen';
import ConsultasScreen from './screens/ConsultasScreen';
import CadastroConsultaScreen from './screens/CadastroConsultaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Agendar" component={AgendarScreen} />
      <Tab.Screen name="Consultas" component={ConsultasScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false}} />
        <Stack.Screen name="CadastroConsulta" component={CadastroConsultaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
