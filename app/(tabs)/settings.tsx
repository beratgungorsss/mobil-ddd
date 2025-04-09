import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { 
  Moon, 
  Bell, 
  Volume2, 
  Vibrate, 
  Save, 
  Globe, 
  BrainCircuit,
  Clock,
  LogOut,
  User,
  HelpCircle,
  Mail,
  Shield,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            router.replace('/');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: resetSettings,
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customize your WordPecker experience
          </Text>
        </View>
        
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileIconContainer}>
              <User size={32} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch between light and dark theme
              </Text>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={(value) => 
                updateSettings({ theme: value ? 'dark' : 'light' })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates and reminders
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => 
                updateSettings({ notifications: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Clock size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Session Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminded to practice daily
              </Text>
            </View>
            <Switch
              value={settings.sessionReminders}
              onValueChange={(value) => 
                updateSettings({ sessionReminders: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Volume2 size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds for interactions
              </Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={(value) => 
                updateSettings({ soundEffects: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          {Platform.OS !== 'web' && (
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Vibrate size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>
                  Vibration feedback for interactions
                </Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => 
                  updateSettings({ hapticFeedback: value })
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Save size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto-Save</Text>
              <Text style={styles.settingDescription}>
                Automatically save changes
              </Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => 
                updateSettings({ autoSave: value })
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              // This would open a language selection modal in a real app
              Alert.alert("Select Language", "This feature is not implemented in the demo");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Default Language</Text>
              <Text style={styles.settingDescription}>
                {settings.defaultLanguage}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              // This would open a difficulty selection modal in a real app
              Alert.alert("Select Difficulty", "This feature is not implemented in the demo");
            }}
          >
            <View style={styles.settingIconContainer}>
              <BrainCircuit size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Quiz Difficulty</Text>
              <Text style={styles.settingDescription}>
                {settings.quizDifficulty.charAt(0).toUpperCase() + settings.quizDifficulty.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Help & Support", "This feature is not implemented in the demo");
            }}
          >
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help with using the app
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Contact Us", "This feature is not implemented in the demo");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Mail size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Contact Us</Text>
              <Text style={styles.settingDescription}>
                Send feedback or report issues
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("Privacy Policy", "This feature is not implemented in the demo");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                How we handle your data
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert("About WordPecker", "Version 1.0.0\n\nWordPecker is a vocabulary learning app designed to help you master words in any language through interactive exercises and quizzes.");
            }}
          >
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>About</Text>
              <Text style={styles.settingDescription}>
                App version and information
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleResetSettings}
          >
            <Text style={styles.resetButtonText}>Reset Settings</Text>
          </TouchableOpacity>
          
          {user && (
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <LogOut size={18} color="white" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  resetButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});