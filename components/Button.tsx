import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = styles.primaryButton;
        break;
      case 'secondary':
        buttonStyle = styles.secondaryButton;
        break;
      case 'outline':
        buttonStyle = styles.outlineButton;
        break;
      case 'text':
        buttonStyle = styles.textButton;
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'medium':
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }
    
    // Disabled state
    if (disabled || isLoading) {
      buttonStyle = { 
        ...buttonStyle, 
        opacity: 0.6,
      };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = (): TextStyle => {
    let textStyleVar: TextStyle = {};
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyleVar = styles.primaryText;
        break;
      case 'secondary':
        textStyleVar = styles.secondaryText;
        break;
      case 'outline':
        textStyleVar = styles.outlineText;
        break;
      case 'text':
        textStyleVar = styles.textButtonText;
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case 'medium':
        textStyleVar = { ...textStyleVar, ...styles.mediumText };
        break;
      case 'large':
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
    }
    
    return textStyleVar;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? colors.primary : 'white'} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Text styles
  primaryText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  textButtonText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Text size styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button;