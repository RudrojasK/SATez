import * as Haptics from 'expo-haptics';

/**
 * Trigger light haptic feedback for UI interactions
 */
export const lightHapticFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Trigger medium haptic feedback for more significant UI interactions
 */
export const mediumHapticFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Trigger heavy haptic feedback for major UI interactions
 */
export const heavyHapticFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Trigger success haptic feedback pattern
 */
export const successHapticFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Trigger error haptic feedback pattern
 */
export const errorHapticFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Trigger warning haptic feedback pattern
 */
export const warningHapticFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Trigger selection haptic feedback (simple tap)
 */
export const selectionHapticFeedback = () => {
  Haptics.selectionAsync();
}; 