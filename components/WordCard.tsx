import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Edit2, Trash2 } from 'lucide-react-native';
import { Word } from '@/types/wordlist';

interface WordCardProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (wordId: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.term}>{word.term}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onEdit(word)}
          >
            <Edit2 size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onDelete(word.id)}
          >
            <Trash2 size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.definition}>{word.definition}</Text>
      
      {word.examples && word.examples.length > 0 && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          {word.examples.map((example, index) => (
            <Text key={index} style={styles.example}>• {example}</Text>
          ))}
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.masteryContainer}>
          <Text style={styles.masteryLabel}>Mastery:</Text>
          <View style={styles.masteryBarContainer}>
            <View 
              style={[
                styles.masteryBar, 
                { width: `${word.mastery}%` },
                word.mastery < 30 ? styles.masteryLow : 
                word.mastery < 70 ? styles.masteryMedium : 
                styles.masteryHigh
              ]} 
            />
          </View>
          <Text style={styles.masteryPercentage}>{word.mastery}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  term: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  definition: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  examplesContainer: {
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
    paddingLeft: 4,
  },
  footer: {
    marginTop: 8,
  },
  masteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  masteryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  masteryBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  masteryBar: {
    height: '100%',
    borderRadius: 4,
  },
  masteryLow: {
    backgroundColor: colors.error,
  },
  masteryMedium: {
    backgroundColor: colors.secondary,
  },
  masteryHigh: {
    backgroundColor: colors.success,
  },
  masteryPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
});

export default WordCard;