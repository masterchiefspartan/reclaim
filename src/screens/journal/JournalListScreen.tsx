/**
 * JournalListScreen — Apple Glass Aesthetic
 * ==========================================
 * Clean list view with grouped entries,
 * Apple-style header, and subtle glass surfaces.
 */
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { StateContainer } from '@components/common/StateContainer';
import { EntryListItem } from '@components/journal/EntryListItem';
import { useJournalEntries } from '@hooks/useJournalEntries';
import { useAppTheme } from '@hooks/useAppTheme';
import type { MainTabScreenProps, RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = MainTabScreenProps<'JourneyTab'>;

export const JournalListScreen = (_props: Props) => {
  const { theme } = useAppTheme();
  const { entries, loading, error, retry } = useJournalEntries();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNewEntry = () => {
    rootNavigation.navigate('VoiceJournal', { mode: 'free' });
  };

  const handleOpenEntry = (entryId: string) => {
    rootNavigation.navigate('EntryDetail', { entryId });
  };

  return (
    <ScreenContainer testID="journal-screen">
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="largeTitle" color={theme.colors.text}>
          Journey
        </AppText>
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleNewEntry}
          accessibilityRole="button"
          accessibilityLabel="Add new entry"
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <StateContainer
        loading={loading}
        error={error}
        data={entries}
        onRetry={retry}
        loadingMessage="Loading your journey..."
        emptyTitle="Your story starts here"
        emptyMessage="Record your first voice journal to begin documenting your recovery journey."
        emptyActionLabel="Start Your Journey"
        onEmptyAction={handleNewEntry}
      >
        <FlatList
          style={styles.list}
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <EntryListItem
              id={item.id}
              title={item.frameworkData?.frameworkName || 'Voice Entry'}
              date={item.createdAt?.toDate() || new Date()}
              mood={item.mood}
              preview={item.transcript?.slice(0, 80)}
              onPress={() => handleOpenEntry(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: theme.colors.divider }]} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </StateContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 8,
  },
  list: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
  separator: {
    height: 0.5,
    marginHorizontal: 14,
  },
});
