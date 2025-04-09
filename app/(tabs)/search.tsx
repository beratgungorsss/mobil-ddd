import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import Input from '@/components/Input';
import { Search as SearchIcon, BookOpen, X } from 'lucide-react-native';
import { Word, WordList } from '@/types/wordlist';

type SearchResult = {
  type: 'list' | 'word';
  id: string;
  listId?: string;
  title: string;
  subtitle: string;
};

export default function SearchScreen() {
  const { lists } = useWordListStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    
    // Search in lists
    lists.forEach(list => {
      if (
        list.name.toLowerCase().includes(query) ||
        list.description.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'list',
          id: list.id,
          title: list.name,
          subtitle: `${list.wordCount} words • ${list.language}`,
        });
      }
      
      // Search in words within the list
      list.words.forEach(word => {
        if (
          word.term.toLowerCase().includes(query) ||
          word.definition.toLowerCase().includes(query) ||
          word.examples.some(example => example.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'word',
            id: word.id,
            listId: list.id,
            title: word.term,
            subtitle: `In list: ${list.name}`,
          });
        }
      });
    });
    
    setSearchResults(results);
  }, [searchQuery, lists]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Add to recent searches if not empty and not already in the list
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'list') {
      router.push(`/list/${result.id}`);
    } else {
      // Navigate to the list and scroll to the word
      router.push(`/list/${result.listId}`);
      // In a real app, you might want to pass a parameter to scroll to the specific word
    }
  };
  
  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultIconContainer}>
        <BookOpen size={20} color={colors.primary} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Input
          placeholder="Search words and lists..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<SearchIcon size={20} color={colors.textSecondary} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : undefined
          }
          containerStyle={styles.searchContainer}
        />
      </View>
      
      {searchQuery.trim().length === 0 ? (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleSearch(search)}
              >
                <SearchIcon size={16} color={colors.textSecondary} />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent searches</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={renderSearchResult}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try different keywords or check your spelling
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    marginBottom: 0,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  recentText: {
    fontSize: 16,
    color: colors.text,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});