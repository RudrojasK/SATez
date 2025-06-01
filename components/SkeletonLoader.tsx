import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  variant: 'card' | 'list' | 'profile' | 'practice-test';
  count?: number;
  animated?: boolean;
}

export default function SkeletonLoader({ 
  variant, 
  count = 1, 
  animated = true 
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!animated) return;

    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmer.start();
    pulse.start();

    return () => {
      shimmer.stop();
      pulse.stop();
    };
  }, [animated]);

  const SkeletonBox = ({ 
    width: boxWidth, 
    height, 
    borderRadius = 8,
    style = {},
    hasShimmer = true 
  }: {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: any;
    hasShimmer?: boolean;
  }) => {
    const shimmerTranslate = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <Animated.View
        style={[
          {
            width: boxWidth,
            height,
            borderRadius,
            backgroundColor: '#E5E5EA',
            overflow: 'hidden',
            opacity: animated ? pulseAnim : 0.3,
          },
          style,
        ]}
      >
        {hasShimmer && animated && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const CardSkeleton = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <SkeletonBox width={48} height={48} borderRadius={24} />
        <View style={styles.cardHeaderText}>
          <SkeletonBox width="60%" height={16} borderRadius={8} />
          <SkeletonBox width="40%" height={12} borderRadius={6} style={{ marginTop: 8 }} />
        </View>
        <SkeletonBox width={24} height={24} borderRadius={12} />
      </View>
      <SkeletonBox width="100%" height={120} borderRadius={12} style={{ marginTop: 16 }} />
      <View style={styles.cardFooter}>
        <SkeletonBox width="30%" height={14} borderRadius={7} />
        <SkeletonBox width="25%" height={14} borderRadius={7} />
      </View>
    </View>
  );

  const ListSkeleton = () => (
    <View style={styles.listItem}>
      <SkeletonBox width={40} height={40} borderRadius={20} />
      <View style={styles.listContent}>
        <SkeletonBox width="70%" height={16} borderRadius={8} />
        <SkeletonBox width="50%" height={12} borderRadius={6} style={{ marginTop: 6 }} />
      </View>
      <SkeletonBox width={16} height={16} borderRadius={8} />
    </View>
  );

  const ProfileSkeleton = () => (
    <View style={styles.profileContainer}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <SkeletonBox width={100} height={100} borderRadius={50} />
        <SkeletonBox width="60%" height={20} borderRadius={10} style={{ marginTop: 16 }} />
        <SkeletonBox width="40%" height={14} borderRadius={7} style={{ marginTop: 8 }} />
      </View>
      
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.statCard}>
            <SkeletonBox width={32} height={32} borderRadius={16} />
            <SkeletonBox width="80%" height={18} borderRadius={9} style={{ marginTop: 8 }} />
            <SkeletonBox width="60%" height={12} borderRadius={6} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
      
      {/* Menu Items */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.menuItem}>
          <SkeletonBox width={44} height={44} borderRadius={22} />
          <View style={styles.menuContent}>
            <SkeletonBox width="70%" height={16} borderRadius={8} />
            <SkeletonBox width="50%" height={12} borderRadius={6} style={{ marginTop: 4 }} />
          </View>
          <SkeletonBox width={20} height={20} borderRadius={10} />
        </View>
      ))}
    </View>
  );

  const PracticeTestSkeleton = () => (
    <View style={styles.practiceContainer}>
      {/* Category Buttons */}
      <View style={styles.categoryRow}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox 
            key={i} 
            width={80} 
            height={36} 
            borderRadius={18} 
            style={{ marginRight: 12 }} 
          />
        ))}
      </View>
      
      {/* Test Cards */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.testCard}>
          <View style={styles.testCardHeader}>
            <View style={styles.testCardInfo}>
              <SkeletonBox width="80%" height={18} borderRadius={9} />
              <SkeletonBox width="60%" height={14} borderRadius={7} style={{ marginTop: 8 }} />
            </View>
            <SkeletonBox width={60} height={24} borderRadius={12} />
          </View>
          
          <View style={styles.testCardStats}>
            <SkeletonBox width="40%" height={14} borderRadius={7} />
            <SkeletonBox width="50%" height={14} borderRadius={7} />
          </View>
          
          <SkeletonBox width="100%" height={8} borderRadius={4} style={{ marginTop: 12 }} />
          
          <View style={styles.testCardFooter}>
            <SkeletonBox width={80} height={32} borderRadius={16} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'practice-test':
        return <PracticeTestSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={index > 0 && styles.spacing}>
          {renderSkeleton()}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  spacing: {
    marginTop: 16,
  },
  
  // Card Skeleton
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  
  // List Skeleton
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  // Profile Skeleton
  profileContainer: {
    backgroundColor: '#FFF',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  
  // Practice Test Skeleton
  practiceContainer: {
    backgroundColor: '#F8F9FA',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  testCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  testCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  testCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  testCardFooter: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
}); 