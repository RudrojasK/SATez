import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';

interface ResourceCardProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export const ResourceCard = ({
  title,
  description,
  image,
  onPress,
}: ResourceCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    backgroundColor: COLORS.card, // Fallback color
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
}); 