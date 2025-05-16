import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import type { ViewStyle, TextStyle } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  style?: any;
  titleStyle?: any;
  contentStyle?: any;
};

export default function Collapsible({
  title,
  children,
  initiallyExpanded = false,
  style,
  titleStyle,
  contentStyle,
}: CollapsibleProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.titleContainer} onPress={toggleExpand}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.textLight}
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create<{
  container: ViewStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  content: ViewStyle;
}>({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.smallRadius,
    marginBottom: 16,
    overflow: 'hidden',
  },
  titleContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...(FONTS.h3
      ? {
          ...FONTS.h3,
          fontWeight:
            FONTS.h3.fontWeight === undefined
              ? undefined
              : (FONTS.h3.fontWeight as TextStyle['fontWeight']),
        }
      : {}),
    color: COLORS.text,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
