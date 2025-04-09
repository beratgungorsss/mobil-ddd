import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedInput,
        error && styles.errorInput
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            inputStyle
          ]}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !passwordVisible}
          {...rest}
        />
        
        {isPassword ? (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            {passwordVisible ? 
              <EyeOff size={20} color={colors.textSecondary} /> : 
              <Eye size={20} color={colors.textSecondary} />
            }
          </TouchableOpacity>
        ) : rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.text,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  errorInput: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 12,
  },
  rightIconContainer: {
    paddingRight: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;