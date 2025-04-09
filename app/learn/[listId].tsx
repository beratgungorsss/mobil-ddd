import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, ArrowRight, Check, X, Repeat, Brain } from 'lucide-react-native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { getList, currentList, updateWord, updateLearningProgress } = useWordListStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [learningStats, setLearningStats] = useState({
    mastered: 0,
    learning: 0,
    total: 0,
  });
  
  // Animation values
  const cardOpacity = React.useRef(new Animated.Value(1)).current;
  const cardScale = React.useRef(new Animated.Value(1)).current;
  const cardTranslateX = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (listId) {
      getList(listId);
    }
  }, [listId]);
  
  useEffect(() => {
    if (currentList) {
      // Calculate initial learning stats
      const total = currentList.words.length;
      const mastered = currentList.words.filter(word => word.mastery >= 80).length;
      const learning = total - mastered;
      
      setLearningStats({
        mastered,
        learning,
        total,
      });
    }
  }, [currentList]);
  
  const animateCardOut = (direction: 'left' | 'right', callback: () => void) => {
    // Don't run animations on web to avoid potential issues
    if (Platform.OS === 'web') {
      callback();
      return;
    }
    
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateX, {
        toValue: direction === 'left' ? -width : width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      cardOpacity.setValue(0);
      cardScale.setValue(0.8);
      cardTranslateX.setValue(direction === 'left' ? width : -width);
      
      callback();
      
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  const handleKnow = () => {
    if (!currentList || currentIndex >= currentList.words.length) return;
    
    const currentWord = currentList.words[currentIndex];
    const newMastery = Math.min(currentWord.mastery + 20, 100);
    
    updateWord(listId as string, currentWord.id, {
      mastery: newMastery,
      lastPracticed: new Date().toISOString(),
    });
    
    animateCardOut('right', () => {
      if (currentIndex < currentList.words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowDefinition(false);
      } else {
        finishLearning();
      }
    });
  };
  
  const handleDontKnow = () => {
    if (!currentList || currentIndex >= currentList.words.length) return;
    
    const currentWord = currentList.words[currentIndex];
    const newMastery = Math.max(currentWord.mastery - 10, 0);
    
    updateWord(listId as string, currentWord.id, {
      mastery: newMastery,
      lastPracticed: new Date().toISOString(),
    });
    
    animateCardOut('left', () => {
      if (currentIndex < currentList.words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowDefinition(false);
      } else {
        finishLearning();
      }
    });
  };
  
  const finishLearning = () => {
    if (!currentList) return;
    
    // Calculate final learning stats
    const total = currentList.words.length;
    const mastered = currentList.words.filter(word => word.mastery >= 80).length;
    const learning = total - mastered;
    
    setLearningStats({
      mastered,
      learning,
      total,
    });
    
    // Calculate average mastery
    const masterySum = currentList.words.reduce((sum, word) => sum + word.mastery, 0);
    const masteryAverage = Math.round(masterySum / total);
    
    // Update learning progress
    updateLearningProgress(listId as string, {
      wordsLearned: total,
      totalWords: total,
      masteryAverage,
    });
    
    setCompleted(true);
  };
  
  const restartLearning = () => {
    setCurrentIndex(0);
    setShowDefinition(false);
    setCompleted(false);
  };
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading words...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (currentList.words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Brain size={48} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Words to Learn</Text>
          <Text style={styles.emptyText}>
            This list doesn't have any words yet. Add some words to start learning.
          </Text>
          <Button
            title="Add Words"
            onPress={() => router.push(`/word/add/${listId}`)}
            variant="primary"
            style={styles.emptyButton}
          />
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            style={styles.emptyButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.completedContainer}>
          <View style={styles.iconContainer}>
            <Brain size={48} color={colors.primary} />
          </View>
          <Text style={styles.completedTitle}>Learning Session Completed!</Text>
          <Text style={styles.completedText}>
            You've reviewed all {currentList.words.length} words in this list.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learningStats.mastered}</Text>
              <Text style={styles.statLabel}>Mastered</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learningStats.learning}</Text>
              <Text style={styles.statLabel}>Learning</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learningStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
          
          <Button
            title="Restart Learning"
            onPress={restartLearning}
            variant="primary"
            leftIcon={<Repeat size={18} color="white" />}
            style={styles.completedButton}
          />
          
          <Button
            title="Take a Quiz"
            onPress={() => router.push(`/quiz/${listId}`)}
            variant="secondary"
            style={styles.completedButton}
          />
          
          <Button
            title="Return to List"
            onPress={() => router.back()}
            variant="outline"
            style={styles.completedButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const currentWord = currentList.words[currentIndex];
  const progress = ((currentIndex + 1) / currentList.words.length) * 100;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Mode</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} of {currentList.words.length}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={8} color={colors.primary} />
      </View>
      
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [
                { scale: cardScale },
                { translateX: cardTranslateX }
              ]
            }
          ]}
        >
          <Text style={styles.term}>{currentWord.term}</Text>
          
          {showDefinition ? (
            <View style={styles.definitionContainer}>
              <Text style={styles.definition}>{currentWord.definition}</Text>
              
              {currentWord.examples && currentWord.examples.length > 0 && (
                <View style={styles.examplesContainer}>
                  <Text style={styles.examplesTitle}>Examples:</Text>
                  {currentWord.examples.map((example, index) => (
                    <Text key={index} style={styles.example}>• {example}</Text>
                  ))}
                </View>
              )}
              
              <View style={styles.masteryContainer}>
                <Text style={styles.masteryLabel}>Mastery:</Text>
                <View style={styles.masteryBarContainer}>
                  <View 
                    style={[
                      styles.masteryBar, 
                      { width: `${currentWord.mastery}%` },
                      currentWord.mastery < 30 ? styles.masteryLow : 
                      currentWord.mastery < 70 ? styles.masteryMedium : 
                      styles.masteryHigh
                    ]} 
                  />
                </View>
                <Text style={styles.masteryPercentage}>{currentWord.mastery}%</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => setShowDefinition(true)}
            >
              <Text style={styles.revealButtonText}>Tap to reveal definition</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      
      <View style={styles.actionsContainer}>
        {showDefinition && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.dontKnowButton]}
              onPress={handleDontKnow}
            >
              <X size={24} color="white" />
              <Text style={styles.actionButtonText}>Don't Know</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.knowButton]}
              onPress={handleKnow}
            >
              <Check size={24} color="white" />
              <Text style={styles.actionButtonText}>Know</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setShowDefinition(false);
            }
          }}
          disabled={currentIndex === 0}
        >
          <ArrowLeft 
            size={20} 
            color={currentIndex === 0 ? colors.placeholder : colors.text} 
          />
          <Text 
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentIndex === currentList.words.length - 1 && styles.navButtonDisabled]}
          onPress={() => {
            if (currentIndex < currentList.words.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setShowDefinition(false);
            }
          }}
          disabled={currentIndex === currentList.words.length - 1}
        >
          <Text 
            style={[
              styles.navButtonText,
              currentIndex === currentList.words.length - 1 && styles.navButtonTextDisabled
            ]}
          >
            Next
          </Text>
          <ArrowRight 
            size={20} 
            color={currentIndex === currentList.words.length - 1 ? colors.placeholder : colors.text} 
          />
        </TouchableOpacity>
      </View>
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
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  term: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  revealButton: {
    backgroundColor: colors.highlight,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  definitionContainer: {
    marginTop: 8,
  },
  definition: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  example: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingLeft: 4,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  knowButton: {
    backgroundColor: colors.success,
  },
  dontKnowButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  navButtonTextDisabled: {
    color: colors.placeholder,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    width: '80%',
    marginBottom: 12,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completedButton: {
    width: '80%',
    marginBottom: 12,
  },
});