import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, WordList, WordListSummary, QuizResult, LearningProgress } from '@/types/wordlist';

interface WordListState {
  lists: WordList[];
  currentList: WordList | null;
  isLoading: boolean;
  error: string | null;
  quizResults: QuizResult[];
  learningProgress: Record<string, LearningProgress>;
}

// Mock data generator
const generateMockWordLists = (): WordList[] => {
  return [
    {
      id: "list-1",
      name: "Essential English Vocabulary",
      description: "Common English words for everyday use",
      language: "English",
      wordCount: 3,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user-1",
      words: [
        {
          id: "word-1",
          term: "ubiquitous",
          definition: "Present, appearing, or found everywhere",
          examples: ["Mobile phones are now ubiquitous in modern society"],
          mastery: 70,
          createdAt: new Date().toISOString(),
        },
        {
          id: "word-2",
          term: "ephemeral",
          definition: "Lasting for a very short time",
          examples: ["The ephemeral nature of fashion trends"],
          mastery: 40,
          createdAt: new Date().toISOString(),
        },
        {
          id: "word-3",
          term: "serendipity",
          definition: "The occurrence of events by chance in a happy or beneficial way",
          examples: ["The serendipity of meeting an old friend in a foreign country"],
          mastery: 20,
          createdAt: new Date().toISOString(),
        }
      ]
    },
    {
      id: "list-2",
      name: "Business Spanish",
      description: "Essential vocabulary for business conversations in Spanish",
      language: "Spanish",
      wordCount: 2,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "user-1",
      words: [
        {
          id: "word-4",
          term: "negocio",
          definition: "Business",
          examples: ["Tenemos un negocio exitoso"],
          mastery: 80,
          createdAt: new Date().toISOString(),
        },
        {
          id: "word-5",
          term: "reunión",
          definition: "Meeting",
          examples: ["Tenemos una reunión importante mañana"],
          mastery: 60,
          createdAt: new Date().toISOString(),
        }
      ]
    }
  ];
};

const generateMockQuizResults = (): QuizResult[] => {
  return [
    {
      listId: "list-1",
      score: 80,
      totalQuestions: 10,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      timeSpent: 120,
      correctAnswers: 8,
      incorrectAnswers: 2
    },
    {
      listId: "list-1",
      score: 90,
      totalQuestions: 10,
      date: new Date().toISOString(),
      timeSpent: 110,
      correctAnswers: 9,
      incorrectAnswers: 1
    }
  ];
};

const generateMockLearningProgress = (): Record<string, LearningProgress> => {
  return {
    "list-1": {
      listId: "list-1",
      wordsLearned: 3,
      totalWords: 3,
      masteryAverage: 43,
      lastPracticed: new Date().toISOString()
    },
    "list-2": {
      listId: "list-2",
      wordsLearned: 2,
      totalWords: 2,
      masteryAverage: 70,
      lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
};

export const useWordListStore = create<
  WordListState & {
    fetchLists: () => Promise<void>;
    getList: (id: string) => Promise<void>;
    createList: (list: Omit<WordList, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'wordCount'>) => Promise<void>;
    updateList: (id: string, updates: Partial<WordList>) => Promise<void>;
    deleteList: (id: string) => Promise<void>;
    addWord: (listId: string, word: Omit<Word, 'id' | 'createdAt' | 'mastery'>) => Promise<void>;
    updateWord: (listId: string, wordId: string, updates: Partial<Word>) => Promise<void>;
    deleteWord: (listId: string, wordId: string) => Promise<void>;
    addQuizResult: (result: Omit<QuizResult, 'date'>) => void;
    updateLearningProgress: (listId: string, progress: Partial<LearningProgress>) => void;
  }
>(
  persist(
    (set, get) => ({
      lists: [],
      currentList: null,
      isLoading: false,
      error: null,
      quizResults: [],
      learningProgress: {},
      
      fetchLists: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Use mock data for now
          const mockLists = generateMockWordLists();
          set({ lists: mockLists, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to fetch lists" 
          });
        }
      },
      
      getList: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const list = get().lists.find(list => list.id === id) || null;
          set({ currentList: list, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to fetch list" 
          });
        }
      },
      
      createList: async (listData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newList: WordList = {
            ...listData,
            id: `list-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: "user-1", // This would come from auth context in a real app
            wordCount: listData.words?.length || 0,
            words: listData.words || []
          };
          
          set(state => ({ 
            lists: [...state.lists, newList],
            currentList: newList,
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to create list" 
          });
        }
      },
      
      updateList: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set(state => {
            const updatedLists = state.lists.map(list => 
              list.id === id 
                ? { 
                    ...list, 
                    ...updates, 
                    updatedAt: new Date().toISOString(),
                    wordCount: updates.words?.length || list.wordCount
                  }
                : list
            );
            
            const updatedCurrentList = state.currentList?.id === id
              ? { ...state.currentList, ...updates, updatedAt: new Date().toISOString() }
              : state.currentList;
              
            return { 
              lists: updatedLists, 
              currentList: updatedCurrentList,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to update list" 
          });
        }
      },
      
      deleteList: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 700));
          
          set(state => ({ 
            lists: state.lists.filter(list => list.id !== id),
            currentList: state.currentList?.id === id ? null : state.currentList,
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to delete list" 
          });
        }
      },
      
      addWord: async (listId, wordData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 600));
          
          const newWord: Word = {
            ...wordData,
            id: `word-${Date.now()}`,
            createdAt: new Date().toISOString(),
            mastery: 0
          };
          
          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = [...list.words, newWord];
                return {
                  ...list,
                  words: updatedWords,
                  wordCount: updatedWords.length,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });
            
            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: [...state.currentList.words, newWord],
                  wordCount: state.currentList.words.length + 1,
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;
              
            return { 
              lists: updatedLists, 
              currentList: updatedCurrentList,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to add word" 
          });
        }
      },
      
      updateWord: async (listId, wordId, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = list.words.map(word => 
                  word.id === wordId ? { ...word, ...updates } : word
                );
                return {
                  ...list,
                  words: updatedWords,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });
            
            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: state.currentList.words.map(word => 
                    word.id === wordId ? { ...word, ...updates } : word
                  ),
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;
              
            return { 
              lists: updatedLists, 
              currentList: updatedCurrentList,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to update word" 
          });
        }
      },
      
      deleteWord: async (listId, wordId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const updatedLists = state.lists.map(list => {
              if (list.id === listId) {
                const updatedWords = list.words.filter(word => word.id !== wordId);
                return {
                  ...list,
                  words: updatedWords,
                  wordCount: updatedWords.length,
                  updatedAt: new Date().toISOString()
                };
              }
              return list;
            });
            
            const updatedCurrentList = state.currentList?.id === listId
              ? {
                  ...state.currentList,
                  words: state.currentList.words.filter(word => word.id !== wordId),
                  wordCount: state.currentList.words.filter(word => word.id !== wordId).length,
                  updatedAt: new Date().toISOString()
                }
              : state.currentList;
              
            return { 
              lists: updatedLists, 
              currentList: updatedCurrentList,
              isLoading: false 
            };
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to delete word" 
          });
        }
      },
      
      addQuizResult: (result) => {
        const newResult: QuizResult = {
          ...result,
          date: new Date().toISOString()
        };
        
        set(state => ({
          quizResults: [...state.quizResults, newResult]
        }));
      },
      
      updateLearningProgress: (listId, progress) => {
        set(state => {
          const currentProgress = state.learningProgress[listId] || {
            listId,
            wordsLearned: 0,
            totalWords: 0,
            masteryAverage: 0,
            lastPracticed: new Date().toISOString()
          };
          
          return {
            learningProgress: {
              ...state.learningProgress,
              [listId]: {
                ...currentProgress,
                ...progress,
                lastPracticed: new Date().toISOString()
              }
            }
          };
        });
      }
    }),
    {
      name: 'wordlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lists: state.lists,
        quizResults: state.quizResults,
        learningProgress: state.learningProgress
      }),
    }
  )
);

// Initialize with mock data if needed
export const initializeWordListStore = async () => {
  const state = useWordListStore.getState();
  
  if (state.lists.length === 0) {
    useWordListStore.setState({
      lists: generateMockWordLists(),
      quizResults: generateMockQuizResults(),
      learningProgress: generateMockLearningProgress()
    });
  }
};