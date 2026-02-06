/**
 * ScreenContainer — Apple-style screen wrapper
 * ==============================================
 * Provides consistent padding, safe area handling,
 * and the system grouped background color.
 */
import { PropsWithChildren } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@hooks/useAppTheme';

interface ScreenContainerProps {
  scrollable?: boolean;
  testID?: string;
  /** Pull-to-refresh handler */
  onRefresh?: () => void;
  /** Whether refresh is in progress */
  refreshing?: boolean;
  /** Use secondary (white) background instead of grouped gray */
  plain?: boolean;
  /** Extra bottom padding (e.g. for FABs) */
  bottomOffset?: number;
}

export const ScreenContainer = ({
  children,
  scrollable = false,
  testID,
  onRefresh,
  refreshing = false,
  plain = false,
  bottomOffset = 0,
}: PropsWithChildren<ScreenContainerProps>) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const horizontalPadding = theme.layout.screenPaddingHorizontal;
  const backgroundColor = plain ? theme.colors.backgroundSecondary : theme.colors.background;

  const content = (
    <View style={[styles.content, { paddingBottom: insets.bottom + 20 + bottomOffset }]}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        testID={testID}
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
            paddingHorizontal: horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
});
