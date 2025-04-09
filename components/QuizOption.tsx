import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle,
  Animated,
} from 'react-native';
import { colors } from '@/constants/colors';

interface QuizOptionProps {
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onSelect: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  text,
  isSelected,
  isCorrect,
  isRevealed = false,
  onSelect,
  disabled = false,
  style,
}) => {
  // Determine the background color based on state
  const getBackgroundColor = () => {
    if (isRevealed) {
      if (isSelected) {
        return isCorrect ? colors.success : colors.error;
      } else if (isCorrect) {
        return colors.success;
      }
    }
    
    return isSelected ? colors.highlight : colors.card;
  };
  
  // Determine the border color based on state
  const getBorderColor = () => {
    if (isRevealed) {
      if (isSelected) {
        return isCorrect ? colors.success : colors.error;
      } else if (isCorrect) {
        return colors.success;
      }
    }
    
    return isSelected ? colors.primary : colors.border;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style
      ]}
      onPress={onSelect}
      disabled={disabled || isRevealed}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text,
          isSelected && styles.selectedText,
          isRevealed && isCorrect && styles.correctText,
          isRevealed && isSelected && !isCorrect && styles.incorrectText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  selectedText: {
    fontWeight: '600',
    color: colors.primary,
  },
  correctText: {
    fontWeight: '600',
    color: 'white',
  },
  incorrectText: {
    fontWeight: '600',
    color: 'white',
  },
});

export default QuizOption;