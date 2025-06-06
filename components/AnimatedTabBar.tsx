import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface TabItem {
  name: string;
  title: string;
  icon: string;
  activeIcon: string;
}

interface AnimatedTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function AnimatedTabBar({ tabs, activeTab, onTabPress }: AnimatedTabBarProps) {
  const animatedValues = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.name] = {
        scale: new Animated.Value(tab.name === activeTab ? 1 : 0.8),
        translateY: new Animated.Value(tab.name === activeTab ? -4 : 0),
        opacity: new Animated.Value(tab.name === activeTab ? 1 : 0.6),
        iconRotate: new Animated.Value(0),
      };
      return acc;
    }, {} as Record<string, any>)
  ).current;

  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.name === activeTab);
    const tabWidth = width / tabs.length;
    
    // Animate indicator
    Animated.spring(indicatorPosition, {
      toValue: activeIndex * tabWidth,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();

    // Animate glow effect
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate all tabs
    tabs.forEach((tab, index) => {
      const isActive = tab.name === activeTab;
      const tabAnimations = animatedValues[tab.name];

      Animated.parallel([
        Animated.spring(tabAnimations.scale, {
          toValue: isActive ? 1 : 0.8,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(tabAnimations.translateY, {
          toValue: isActive ? -4 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabAnimations.opacity, {
          toValue: isActive ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon rotation for active tab
      if (isActive) {
        Animated.sequence([
          Animated.timing(tabAnimations.iconRotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(tabAnimations.iconRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [activeTab]);

  const handleTabPress = (tabName: string) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onTabPress(tabName);
  };

  const TabButton = ({ tab, index }: { tab: TabItem; index: number }) => {
    const isActive = tab.name === activeTab;
    const tabAnimations = animatedValues[tab.name];
    const tabWidth = width / tabs.length;

    const iconRotation = tabAnimations.iconRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '10deg'],
    });

    return (
      <TouchableOpacity
        style={[styles.tabButton, { width: tabWidth }]}
        onPress={() => handleTabPress(tab.name)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabContent,
            {
              transform: [
                { scale: tabAnimations.scale },
                { translateY: tabAnimations.translateY },
              ],
              opacity: tabAnimations.opacity,
            },
          ]}
        >
          {isActive && (
            <Animated.View
              style={[
                styles.activeBackground,
                {
                  opacity: glowAnim,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(41, 98, 255, 0.1)', 'rgba(41, 98, 255, 0.05)']}
                style={styles.activeBackgroundGradient}
              />
            </Animated.View>
          )}
          
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ rotate: iconRotation }],
              },
            ]}
          >
            <Ionicons
              name={(isActive ? tab.activeIcon : tab.icon) as any}
              size={24}
              color={isActive ? '#2962ff' : '#8E8E93'}
            />
          </Animated.View>
          
          <Text
            style={[
              styles.tabLabel,
              {
                color: isActive ? '#2962ff' : '#8E8E93',
                fontWeight: isActive ? '600' : '400',
              },
            ]}
          >
            {tab.title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.backgroundGradient}
      />
      
      {/* Animated indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            left: indicatorPosition,
            width: width / tabs.length,
          },
        ]}
      >
        <LinearGradient
          colors={['#2962ff', '#1e40af']}
          style={styles.indicatorGradient}
        />
      </Animated.View>

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabButton key={tab.name} tab={tab} index={index} />
        ))}
      </View>

      {/* Decorative elements */}
      <View style={styles.topBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 229, 234, 0.5)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  indicatorGradient: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -15,
    overflow: 'hidden',
  },
  activeBackgroundGradient: {
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
}); 