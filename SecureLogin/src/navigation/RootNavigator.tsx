import React, { JSX, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

type AuthStackParamList = { Login: undefined };
type AppStackParamList = { Home: undefined };

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const screenOpts: NativeStackNavigationOptions = { headerTitleAlign: 'center' };

function AuthStackNavigator(): JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={screenOpts}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator(): JSX.Element {
  return (
    <AppStack.Navigator screenOptions={screenOpts}>
      <AppStack.Screen name="Home" component={HomeScreen} />
    </AppStack.Navigator>
  );
}

export default function RootNavigator(): JSX.Element {
  const { token, isBootstrapping } = useContext(AuthContext);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
