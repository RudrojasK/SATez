import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '@/constants/Colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  accentColor?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  accentColor = COLORS.primary,
}: StatCardProps) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
        <Ionicons name={icon} size={24} color={accentColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
}); 