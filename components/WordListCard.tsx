import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Book, ChevronRight, Languages } from 'lucide-react-native';
import { WordListSummary } from '@/types/wordlist';

interface WordListCardProps {
  list: WordListSummary;
  onPress: (id: string) => void;
}

export const WordListCard: React.FC<WordListCardProps> = ({ list, onPress }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(list.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Book size={24} color={colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{list.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{list.description}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Languages size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{list.language}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>{list.wordCount} words</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaText}>Updated {formatDate(list.updatedAt)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevronContainer}>
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chevronContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default WordListCard;