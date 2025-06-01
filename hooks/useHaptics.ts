import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
  const lightFeedback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const mediumFeedback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const heavyFeedback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const successFeedback = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const errorFeedback = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const warningFeedback = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const selectionFeedback = async () => {
    await Haptics.selectionAsync();
  };

  return {
    lightFeedback,
    mediumFeedback,
    heavyFeedback,
    successFeedback,
    errorFeedback,
    warningFeedback,
    selectionFeedback,
  };
}; 