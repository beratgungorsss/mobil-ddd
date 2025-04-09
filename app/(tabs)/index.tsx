import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useWordListStore } from '@/store/wordlist-store';
import WordListCard from '@/components/WordListCard';
import Button from '@/components/Button';
import { Plus, BookOpen, Brain, Award } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { lists, fetchLists, quizResults, learningProgress } = useWordListStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchLists();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    setRefreshing(false);
  };
  
  // Get recent lists (up to 3)
  const recentLists = [...lists]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  
  // Get recent quiz results (up to 3)
  const recentQuizzes = [...quizResults]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Calculate total words across all lists
  const totalWords = lists.reduce((sum, list) => sum + list.wordCount, 0);
  
  // Calculate average mastery across all lists
  const masteryValues = Object.values(learningProgress).map(progress => progress.masteryAverage);
  const averageMastery = masteryValues.length > 0 
    ? Math.round(masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length) 
    : 0;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user ? user.name : 'Learner'}!
          </Text>
          <Text style={styles.subtitle}>
            Continue your vocabulary journey
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{lists.length}</Text>
            <Text style={styles.statLabel}>Lists</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Brain size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{totalWords}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Award size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{averageMastery}%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Lists</Text>
            <TouchableOpacity onPress={() => router.push('/lists')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentLists.length > 0 ? (
            recentLists.map(list => (
              <WordListCard
                key={list.id}
                list={list}
                onPress={(id) => router.push(`/list/${id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                You haven't created any lists yet
              </Text>
              <Button
                title="Create Your First List"
                onPress={() => router.push('/list/create')}
                variant="primary"
                leftIcon={<Plus size={18} color="white" />}
                style={styles.createButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/progress')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentQuizzes.length > 0 ? (
            recentQuizzes.map((quiz, index) => {
              const list = lists.find(l => l.id === quiz.listId);
              return (
                <View key={index} style={styles.activityCard}>
                  <View style={styles.activityIconContainer}>
                    <Award size={20} color={colors.primary} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      Quiz: {list?.name || 'Unknown List'}
                    </Text>
                    <Text style={styles.activityMeta}>
                      Score: {quiz.score}% • {quiz.correctAnswers}/{quiz.totalQuestions} correct
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No recent activity
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Take a quiz to track your progress
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
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
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllLink: {
    fontSize: 14,
    color: colors.primary,
  },
  emptyStateContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 14,
    color: colors.textSecondary,
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