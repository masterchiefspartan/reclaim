import { PropsWithChildren } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@hooks/useAppTheme';

interface ScreenContainerProps {
  scrollable?: boolean;
  testID?: string;
}

export const ScreenContainer = ({ children, scrollable = false, testID }: PropsWithChildren<ScreenContainerProps>) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.content, { paddingBottom: insets.bottom + theme.spacing.lg }]}>{children}</View>
  );

  if (scrollable) {
    return (
      <ScrollView
        testID={testID}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.colors.background, paddingTop: insets.top + theme.spacing.lg },
        ]}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flexGrow: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});

