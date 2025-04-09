import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useWordListStore } from '@/store/wordlist-store';
import ProgressBar from '@/components/ProgressBar';
import QuizOption from '@/components/QuizOption';
import Button from '@/components/Button';
import { Award, Clock, ChevronRight } from 'lucide-react-native';

type QuizQuestion = {
  word: any;
  options: string[];
  correctIndex: number;
};

export default function QuizScreen() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { getList, currentList, addQuizResult } = useWordListStore();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [quizEndTime, setQuizEndTime] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  useEffect(() => {
    if (listId) {
      getList(listId);
    }
  }, [listId]);
  
  useEffect(() => {
    if (currentList && currentList.words.length >= 4) {
      generateQuizQuestions();
      setQuizStartTime(Date.now());
    }
  }, [currentList]);
  
  const generateQuizQuestions = () => {
    if (!currentList || currentList.words.length < 4) return;
    
    // Shuffle words and take up to 10 for the quiz
    const shuffledWords = [...currentList.words].sort(() => 0.5 - Math.random());
    const quizWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length));
    
    const generatedQuestions: QuizQuestion[] = quizWords.map(word => {
      // Get 3 random incorrect options
      const incorrectOptions = currentList.words
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.definition);
      
      // Insert correct answer at random position
      const correctIndex = Math.floor(Math.random() * 4);
      const options = [...incorrectOptions];
      options.splice(correctIndex, 0, word.definition);
      
      return {
        word,
        options,
        correctIndex,
      };
    });
    
    setQuestions(generatedQuestions);
  };
  
  const handleSelectOption = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOptionIndex(index);
  };
  
  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null) return;
    
    setIsAnswerRevealed(true);
    
    const isCorrect = selectedOptionIndex === questions[currentQuestionIndex].correctIndex;
    
    if (isCorrect) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setIsAnswerRevealed(false);
    } else {
      // Quiz completed
      setQuizEndTime(Date.now());
      setQuizCompleted(true);
      
      // Calculate final score as percentage
      const finalScore = Math.round((score + (selectedOptionIndex === questions[currentQuestionIndex].correctIndex ? 1 : 0)) / questions.length * 100);
      
      // Calculate time spent in seconds
      const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
      
      // Save quiz result
      addQuizResult({
        listId: listId as string,
        score: finalScore,
        totalQuestions: questions.length,
        timeSpent,
        correctAnswers: correctAnswers + (selectedOptionIndex === questions[currentQuestionIndex].correctIndex ? 1 : 0),
        incorrectAnswers: incorrectAnswers + (selectedOptionIndex !== questions[currentQuestionIndex].correctIndex && selectedOptionIndex !== null ? 1 : 0),
      });
    }
  };
  
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!currentList) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (currentList.words.length < 4) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Award size={48} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Not Enough Words</Text>
          <Text style={styles.emptyText}>
            You need at least 4 words in your list to take a quiz. Add more words and try again.
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
  
  if (quizCompleted) {
    const finalScore = Math.round(score / questions.length * 100);
    const timeSpent = quizEndTime - quizStartTime;
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.completedContainer}>
          <View style={styles.iconContainer}>
            <Award size={48} color={colors.primary} />
          </View>
          <Text style={styles.completedTitle}>Quiz Completed!</Text>
          <Text style={styles.completedText}>
            You've completed the quiz for "{currentList.name}".
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{finalScore}%</Text>
            <ProgressBar 
              progress={finalScore} 
              height={12}
              color={
                finalScore < 50 ? colors.error :
                finalScore < 80 ? colors.secondary :
                colors.success
              }
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{incorrectAnswers}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(timeSpent)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>
          
          <Button
            title="Take Another Quiz"
            onPress={() => {
              setCurrentQuestionIndex(0);
              setSelectedOptionIndex(null);
              setIsAnswerRevealed(false);
              setScore(0);
              setCorrectAnswers(0);
              setIncorrectAnswers(0);
              setQuizCompleted(false);
              generateQuizQuestions();
              setQuizStartTime(Date.now());
            }}
            variant="primary"
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
  
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing quiz questions...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Mode</Text>
        <Text style={styles.headerSubtitle}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={8} color={colors.primary} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>What is the definition of:</Text>
          <Text style={styles.questionTerm}>{currentQuestion.word.term}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={index}
              text={option}
              isSelected={selectedOptionIndex === index}
              isCorrect={index === currentQuestion.correctIndex}
              isRevealed={isAnswerRevealed}
              onSelect={() => handleSelectOption(index)}
            />
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        {!isAnswerRevealed ? (
          <Button
            title="Check Answer"
            onPress={handleCheckAnswer}
            variant="primary"
            disabled={selectedOptionIndex === null}
            style={styles.actionButton}
          />
        ) : (
          <Button
            title={currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            onPress={handleNextQuestion}
            variant="primary"
            rightIcon={<ChevronRight size={20} color="white" />}
            style={styles.actionButton}
          />
        )}
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
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  questionTerm: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    width: '100%',
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
  scoreContainer: {
    width: '100%',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
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
    color: colors.text,
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