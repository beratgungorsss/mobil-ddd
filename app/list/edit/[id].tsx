import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { BookOpen, Languages, Info } from 'lucide-react-native';

export default function EditListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getList, currentList, updateList, isLoading } = useWordListStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  
  useEffect(() => {
    if (id) {
      getList(id);
    }
  }, [id]);
  
  useEffect(() => {
    if (currentList) {
      setName(currentList.name);
      setDescription(currentList.description);
      setLanguage(currentList.language);
    }
  }, [currentList]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('List name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate description
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  };
  
  const handleUpdateList = async () => {
    if (validateForm() && id) {
      await updateList(id, {
        name,
        description,
        language,
      });
      
      router.back();
    }
  };
  
  // Language options (simplified for demo)
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Chinese',
    'Korean',
  ];
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading list...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
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
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BookOpen size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Edit List</Text>
            <Text style={styles.subtitle}>
              Update your vocabulary list details
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="List Name"
              placeholder="Enter a name for your list"
              value={name}
              onChangeText={setName}
              error={nameError}
              leftIcon={<BookOpen size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label="Description"
              placeholder="Describe what this list is about"
              value={description}
              onChangeText={setDescription}
              error={descriptionError}
              leftIcon={<Info size={20} color={colors.textSecondary} />}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              inputStyle={styles.textArea}
            />
            
            <Text style={styles.label}>Language</Text>
            <View style={styles.languageContainer}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    language === lang && styles.languageOptionSelected,
                  ]}
                  onPress={() => setLanguage(lang)}
                >
                  <Languages 
                    size={16} 
                    color={language === lang ? 'white' : colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.languageText,
                      language === lang && styles.languageTextSelected,
                    ]}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              onPress={handleUpdateList}
              variant="primary"
              isLoading={isLoading}
              style={styles.button}
            />
            
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.button}
            />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.text,
    fontWeight: '500',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  languageOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
    color: colors.text,
  },
  languageTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});