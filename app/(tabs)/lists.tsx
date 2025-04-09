import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import WordListCard from '@/components/WordListCard';
import EmptyState from '@/components/EmptyState';
import { Plus, BookOpen, Search } from 'lucide-react-native';
import Input from '@/components/Input';

export default function ListsScreen() {
  const { lists, fetchLists } = useWordListStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchLists();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };
  
  // Filter lists based on search query
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.language.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Input
          placeholder="Search your lists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.textSecondary} />}
          containerStyle={styles.searchContainer}
        />
      </View>
      
      <FlatList
        data={filteredLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WordListCard
            list={item}
            onPress={(id) => router.push(`/list/${id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Lists Found"
            message={searchQuery ? "Try a different search term" : "Create your first vocabulary list to get started"}
            icon={<BookOpen size={48} color={colors.primary} />}
            actionLabel={searchQuery ? undefined : "Create List"}
            onAction={searchQuery ? undefined : () => router.push('/list/create')}
          />
        }
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/list/create')}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});