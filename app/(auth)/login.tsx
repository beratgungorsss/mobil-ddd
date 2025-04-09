import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, error } = useAuthStore();
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      await login({ email, password });
      
      // If login is successful, the auth store will update and the user will be redirected
      // from the welcome screen useEffect
    }
  };
  
  // For demo purposes, pre-fill with demo credentials
  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your vocabulary journey</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                isPassword
                error={passwordError}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
              />
              
              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                style={styles.forgotPasswordLink}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
              
              <Button
                title="Log In"
                onPress={handleLogin}
                variant="primary"
                isLoading={isLoading}
                style={styles.button}
              />
              
              <TouchableOpacity
                onPress={fillDemoCredentials}
                style={styles.demoLink}
              >
                <Text style={styles.demoText}>Use demo account</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  button: {
    marginBottom: 16,
  },
  demoLink: {
    alignSelf: 'center',
    marginTop: 8,
  },
  demoText: {
    color: colors.primary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});