import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  label,
  showPercentage = false,
  color = colors.primary,
  backgroundColor = colors.border,
  style,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={[styles.progressContainer, { height, backgroundColor }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${clampedProgress}%`,
              backgroundColor: color,
            }
          ]} 
        />
      </View>
      
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default ProgressBar;