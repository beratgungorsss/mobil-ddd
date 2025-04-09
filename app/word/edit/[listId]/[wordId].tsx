import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { BookText, AlignLeft, Languages, Plus, Minus } from 'lucide-react-native';

export default function EditWordScreen() {
  const { listId, wordId } = useLocalSearchParams<{ listId: string, wordId: string }>();
  const { getList, currentList, updateWord, isLoading } = useWordListStore();
  
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [examples, setExamples] = useState<string[]>(['']);
  
  const [termError, setTermError] = useState('');
  const [definitionError, setDefinitionError] = useState('');
  
  useEffect(() => {
    if (listId) {
      getList(listId);
    }
  }, [listId]);
  
  useEffect(() => {
    if (currentList && wordId) {
      const word = currentList.words.find(w => w.id === wordId);
      if (word) {
        setTerm(word.term);
        setDefinition(word.definition);
        setExamples(word.examples.length > 0 ? word.examples : ['']);
      }
    }
  }, [currentList, wordId]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate term
    if (!term.trim()) {
      setTermError('Word or phrase is required');
      isValid = false;
    } else {
      setTermError('');
    }
    
    // Validate definition
    if (!definition.trim()) {
      setDefinitionError('Definition is required');
      isValid = false;
    } else {
      setDefinitionError('');
    }
    
    return isValid;
  };
  
  const handleUpdateWord = async () => {
    if (validateForm() && listId && wordId) {
      // Filter out empty examples
      const filteredExamples = examples.filter(example => example.trim() !== '');
      
      await updateWord(listId, wordId, {
        term,
        definition,
        examples: filteredExamples,
      });
      
      router.back();
    }
  };
  
  const handleExampleChange = (text: string, index: number) => {
    const newExamples = [...examples];
    newExamples[index] = text;
    setExamples(newExamples);
  };
  
  const addExampleField = () => {
    setExamples([...examples, '']);
  };
  
  const removeExampleField = (index: number) => {
    if (examples.length > 1) {
      const newExamples = [...examples];
      newExamples.splice(index, 1);
      setExamples(newExamples);
    }
  };
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading word...</Text>
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
              <BookText size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Edit Word</Text>
            <Text style={styles.subtitle}>
              Update word in "{currentList.name}"
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Word or Phrase"
              placeholder="Enter the word or phrase"
              value={term}
              onChangeText={setTerm}
              error={termError}
              leftIcon={<BookText size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label="Definition"
              placeholder="Enter the definition"
              value={definition}
              onChangeText={setDefinition}
              error={definitionError}
              leftIcon={<AlignLeft size={20} color={colors.textSecondary} />}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              inputStyle={styles.textArea}
            />
            
            <Text style={styles.label}>Examples (Optional)</Text>
            {examples.map((example, index) => (
              <View key={index} style={styles.exampleContainer}>
                <Input
                  placeholder={`Example ${index + 1}`}
                  value={example}
                  onChangeText={(text) => handleExampleChange(text, index)}
                  leftIcon={<Languages size={20} color={colors.textSecondary} />}
                  containerStyle={styles.exampleInput}
                />
                
                <TouchableOpacity
                  style={[
                    styles.exampleButton,
                    examples.length === 1 && index === 0 ? styles.exampleButtonDisabled : null,
                  ]}
                  onPress={() => removeExampleField(index)}
                  disabled={examples.length === 1 && index === 0}
                >
                  <Minus 
                    size={20} 
                    color={examples.length === 1 && index === 0 ? colors.placeholder : colors.error} 
                  />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity
              style={styles.addExampleButton}
              onPress={addExampleField}
            >
              <Plus size={16} color={colors.primary} />
              <Text style={styles.addExampleText}>Add Another Example</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              onPress={handleUpdateWord}
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
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleInput: {
    flex: 1,
    marginBottom: 0,
  },
  exampleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exampleButtonDisabled: {
    opacity: 0.5,
  },
  addExampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  addExampleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
});