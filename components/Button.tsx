import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}: ButtonProps) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
      ...SHADOWS.small,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: COLORS.textLight,
        borderColor: COLORS.textLight,
        ...styles.disabled,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
          borderWidth: 2,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle = styles.text;

    if (disabled) {
      return {
        ...baseStyle,
        color: '#FFF',
      };
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseStyle,
          color: '#FFF',
        };
      case 'outline':
        return {
          ...baseStyle,
          color: COLORS.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: FONTS.h3.fontWeight as TextStyle['fontWeight'],
    color: '#FFF',
  },
}); 