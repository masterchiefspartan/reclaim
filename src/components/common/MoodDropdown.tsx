/**
 * MoodDropdown - Dropdown selector for moods with emoji + label
 */

import { useState } from 'react';
import { View, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';
import { usePressAnimation, PRESS_ANIMATION_PRESETS } from '@hooks/usePressAnimation';
import { getAllMoods } from '@utils/mood';
import type { MoodLevel } from '@/types/journal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Get mood options from utility
const MOOD_OPTIONS = getAllMoods().map(mood => ({
  value: mood.value,
  label: mood.label,
  emoji: mood.emoji,
  color: mood.color,
}));

interface MoodDropdownProps {
  /** Currently selected mood */
  value?: MoodLevel;
  /** Callback when mood is selected */
  onChange: (mood: MoodLevel) => void;
  /** Placeholder text when no mood selected */
  placeholder?: string;
}

export const MoodDropdown = ({
  value,
  onChange,
  placeholder = 'Select mood',
}: MoodDropdownProps) => {
  const { theme } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation(
    PRESS_ANIMATION_PRESETS.card
  );

  const selectedOption = MOOD_OPTIONS.find(opt => opt.value === value);

  const handleSelect = (mood: MoodLevel) => {
    onChange(mood);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <AnimatedPressable
        onPress={() => setIsOpen(true)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          animatedStyle,
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={selectedOption ? `Mood: ${selectedOption.label}` : placeholder}
      >
        {selectedOption ? (
          <View style={styles.selectedRow}>
            <AppText style={styles.emoji}>{selectedOption.emoji}</AppText>
            <AppText style={[styles.label, { color: theme.colors.primary }]}>
              {selectedOption.label}
            </AppText>
          </View>
        ) : (
          <AppText style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
            {placeholder}
          </AppText>
        )}
        <Feather name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </AnimatedPressable>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.header}>
              <AppText variant="h4" style={{ color: theme.colors.text }}>
                Mood
              </AppText>
              <Pressable onPress={() => setIsOpen(false)}>
                <AppText style={{ color: theme.colors.textSecondary }}>Close</AppText>
              </Pressable>
            </View>

            <ScrollView style={styles.optionsList}>
              {MOOD_OPTIONS.map(option => {
                const isSelected = value === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected ? theme.colors.primarySubtle : 'transparent',
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    {isSelected && (
                      <Feather
                        name="check"
                        size={18}
                        color={theme.colors.primary}
                        style={styles.checkmark}
                      />
                    )}
                    <AppText style={styles.optionEmoji}>{option.emoji}</AppText>
                    <AppText style={[styles.optionLabel, { color: theme.colors.text }]}>
                      {option.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  checkmark: {
    left: 12,
    position: 'absolute',
  },
  dropdown: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    maxHeight: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    width: '85%',
  },
  emoji: {
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingLeft: 40,
    paddingVertical: 14,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionsList: {
    maxHeight: 340,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 15,
  },
  selectedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  trigger: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
