import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { BookOpen } from 'lucide-react-native';

export default function WelcomeScreen() {
  const { user } = useAuthStore();
  
  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <BookOpen size={64} color={colors.primary} />
          <Text style={styles.logoText}>WordPecker</Text>
        </View>
        
        <Text style={styles.tagline}>
          Master vocabulary in any language
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Create Word Lists</Text>
              <Text style={styles.featureDescription}>
                Organize vocabulary by topic, language, or difficulty
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🧠</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Interactive Learning</Text>
              <Text style={styles.featureDescription}>
                Practice with quizzes and spaced repetition
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📊</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Track Progress</Text>
              <Text style={styles.featureDescription}>
                Monitor your learning journey with detailed statistics
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Log In"
          onPress={() => router.push('/login')}
          variant="primary"
          style={styles.button}
        />
        
        <Button
          title="Create Account"
          onPress={() => router.push('/register')}
          variant="outline"
          style={styles.button}
        />
        
        <Button
          title="Continue as Guest"
          onPress={() => router.replace('/(tabs)')}
          variant="text"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  tagline: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  featureContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    padding: 24,
    width: '100%',
  },
  button: {
    marginBottom: 12,
    width: '100%',
  },
});