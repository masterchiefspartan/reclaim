/**
 * CalendarStrip — Apple-style horizontal date picker
 * Clean pill shapes with minimal borders, system blue highlight.
 */
import { useCallback, useMemo } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  daysToShow?: number;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarStrip = ({
  selectedDate,
  onDateSelect,
  daysToShow = 7,
}: CalendarStripProps) => {
  const { theme } = useAppTheme();

  const dates = useMemo(() => {
    const today = new Date();
    const offset = Math.floor(daysToShow / 2);
    const result: Date[] = [];
    for (let i = -offset; i <= offset; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push(date);
    }
    return result;
  }, [daysToShow]);

  const isSameDay = useCallback((d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }, []);

  const today = useMemo(() => new Date(), []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={styles.container}
    >
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <Pressable
            key={index}
            onPress={() => onDateSelect(date)}
            accessibilityRole="button"
            accessibilityLabel={`${DAY_NAMES[date.getDay()]} ${date.getDate()}`}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.dayItem,
              {
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : pressed
                    ? theme.colors.fillQuaternary
                    : 'transparent',
              },
            ]}
          >
            <AppText
              variant="caption2"
              color={isSelected ? 'rgba(255,255,255,0.8)' : theme.colors.textTertiary}
              style={styles.dayName}
            >
              {DAY_NAMES[date.getDay()]}
            </AppText>
            <AppText variant="title3" color={isSelected ? '#FFFFFF' : theme.colors.text}>
              {date.getDate()}
            </AppText>
            {isToday && !isSelected && (
              <View style={[styles.todayDot, { backgroundColor: theme.colors.primary }]} />
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  dayItem: {
    alignItems: 'center',
    borderRadius: 14,
    gap: 4,
    minWidth: 48,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dayName: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  scroll: {
    gap: 4,
    paddingHorizontal: 2,
  },
  todayDot: {
    borderRadius: 2,
    height: 4,
    marginTop: 2,
    width: 4,
  },
});
