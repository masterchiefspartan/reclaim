/**
 * HighlightsList - Displays journal highlights as bullet points
 */

import { View, StyleSheet } from 'react-native';

import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface HighlightsListProps {
  /** Array of highlight strings */
  highlights: string[];
  /** Title for the section (optional) */
  title?: string;
}

export const HighlightsList = ({ highlights, title }: HighlightsListProps) => {
  const { theme } = useAppTheme();

  if (highlights.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <AppText variant="h4" style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </AppText>
      )}
      {highlights.map((highlight, index) => (
        <View key={index} style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: theme.colors.primary }]} />
          <AppText style={[styles.text, { color: theme.colors.text }]}>{highlight}</AppText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bullet: {
    borderRadius: 3,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});
