import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { AuthContext } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('john@mail.com');
  const [password, setPassword] = useState('changeme');

  const { loginUser, token, isLoading, error } = useLogin();
  const { setAuthToken } = useContext(AuthContext);

  async function handleLogin() {
    await loginUser({ email, password });
  }

  // when token changes, update AuthContext & secure storage
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token, setAuthToken]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login failed', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={isLoading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
});
