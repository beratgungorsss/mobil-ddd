import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import ProgressBar from '@/components/ProgressBar';
import { Award, TrendingUp, Clock, Brain } from 'lucide-react-native';

export default function ProgressScreen() {
  const { lists, quizResults, learningProgress, fetchLists } = useWordListStore();
  
  useEffect(() => {
    fetchLists();
  }, []);
  
  // Calculate overall statistics
  const totalLists = lists.length;
  const totalWords = lists.reduce((sum, list) => sum + list.wordCount, 0);
  const totalQuizzes = quizResults.length;
  
  // Calculate average quiz score
  const averageScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / quizResults.length)
    : 0;
  
  // Calculate average mastery across all lists
  const masteryValues = Object.values(learningProgress).map(progress => progress.masteryAverage);
  const averageMastery = masteryValues.length > 0 
    ? Math.round(masteryValues.reduce((sum, value) => sum + value, 0) / masteryValues.length) 
    : 0;
  
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Learning Progress</Text>
          <Text style={styles.subtitle}>
            Track your vocabulary mastery and quiz performance
          </Text>
        </View>
        
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Overall Progress</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Brain size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{totalWords}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Award size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{totalQuizzes}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{averageMastery}%</Text>
              <Text style={styles.statLabel}>Mastery</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Overall Mastery</Text>
            <ProgressBar 
              progress={averageMastery} 
              height={12}
              showPercentage
              color={colors.primary}
            />
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Quiz Performance</Text>
            <ProgressBar 
              progress={averageScore} 
              height={12}
              showPercentage
              color={colors.secondary}
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>List Progress</Text>
        
        {lists.length > 0 ? (
          lists.map(list => {
            const progress = learningProgress[list.id] || {
              wordsLearned: 0,
              totalWords: list.wordCount,
              masteryAverage: 0,
              lastPracticed: ''
            };
            
            const progressPercentage = list.wordCount > 0
              ? Math.round((progress.wordsLearned / list.wordCount) * 100)
              : 0;
              
            return (
              <TouchableOpacity
                key={list.id}
                style={styles.listProgressCard}
                onPress={() => router.push(`/list/${list.id}`)}
              >
                <View style={styles.listProgressHeader}>
                  <Text style={styles.listName}>{list.name}</Text>
                  <Text style={styles.listStats}>
                    {progress.wordsLearned}/{list.wordCount} words
                  </Text>
                </View>
                
                <ProgressBar 
                  progress={progressPercentage} 
                  height={8}
                  color={colors.primary}
                />
                
                <View style={styles.listProgressFooter}>
                  <Text style={styles.masteryText}>
                    Mastery: {progress.masteryAverage}%
                  </Text>
                  
                  {progress.lastPracticed && (
                    <View style={styles.lastPracticedContainer}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={styles.lastPracticedText}>
                        Last practiced: {formatDate(progress.lastPracticed)}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Lists Yet</Text>
            <Text style={styles.emptyText}>
              Create vocabulary lists to track your learning progress
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/list/create')}
            >
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Recent Quizzes</Text>
        
        {quizResults.length > 0 ? (
          quizResults
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((quiz, index) => {
              const list = lists.find(l => l.id === quiz.listId);
              return (
                <View key={index} style={styles.quizResultCard}>
                  <View style={styles.quizResultHeader}>
                    <Text style={styles.quizListName}>{list?.name || 'Unknown List'}</Text>
                    <Text style={styles.quizDate}>{formatDate(quiz.date)}</Text>
                  </View>
                  
                  <View style={styles.quizResultContent}>
                    <View style={styles.quizScoreContainer}>
                      <Text style={styles.quizScoreLabel}>Score</Text>
                      <Text style={styles.quizScoreValue}>{quiz.score}%</Text>
                    </View>
                    
                    <View style={styles.quizStatsContainer}>
                      <View style={styles.quizStatItem}>
                        <Text style={styles.quizStatValue}>{quiz.correctAnswers}</Text>
                        <Text style={styles.quizStatLabel}>Correct</Text>
                      </View>
                      
                      <View style={styles.quizStatItem}>
                        <Text style={styles.quizStatValue}>{quiz.incorrectAnswers}</Text>
                        <Text style={styles.quizStatLabel}>Incorrect</Text>
                      </View>
                      
                      <View style={styles.quizStatItem}>
                        <Text style={styles.quizStatValue}>
                          {Math.floor(quiz.timeSpent / 60)}:{(quiz.timeSpent % 60).toString().padStart(2, '0')}
                        </Text>
                        <Text style={styles.quizStatLabel}>Time</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Quizzes Taken</Text>
            <Text style={styles.emptyText}>
              Take quizzes to test your knowledge and track your progress
            </Text>
          </View>
        )}
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
  overviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  progressSection: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  listProgressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  listStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listProgressFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lastPracticedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastPracticedText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quizResultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quizResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizListName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quizDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quizResultContent: {
    flexDirection: 'row',
  },
  quizScoreContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizScoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quizScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  quizStatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStatItem: {
    alignItems: 'center',
  },
  quizStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quizStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});