import { COLORS } from '@/constants/Colors';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/Colors';

interface CarouselProps {
  data: React.ReactNode[];
  height: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicator?: boolean;
}

export function Carousel({ 
  data, 
  height, 
  autoPlay = false, 
  autoPlayInterval = 3000,
  showIndicator = false 
}: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        if (activeIndex === data.length - 1) {
          scrollViewRef.current?.scrollTo({ x: 0, animated: true });
          setActiveIndex(0);
        } else {
          scrollViewRef.current?.scrollTo({
            x: (activeIndex + 1) * Dimensions.get('window').width,
            animated: true,
          });
          setActiveIndex(activeIndex + 1);
        }
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [activeIndex, autoPlay, autoPlayInterval, data.length]);

  React.useEffect(() => {
    if (autoPlay && data.length > 1) {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      
      autoPlayTimeoutRef.current = setTimeout(() => {
        const newIndex = (activeIndex + 1) % data.length;
        setActiveIndex(newIndex);
        scrollToIndex(newIndex);
      }, autoPlayInterval) as unknown as NodeJS.Timeout;
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.floor(contentOffset / viewSize);
    setActiveIndex(newIndex);
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            {item}
          </View>
        ))}
      </ScrollView>

      {showIndicator && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slide: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
  },
}); 