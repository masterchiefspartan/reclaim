import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { StateContainer } from '@components/common/StateContainer';
import { JournalEntryCard } from '@components/journal/JournalEntryCard';
import { useJournalEntries } from '@hooks/useJournalEntries';
import { useAuth } from '@hooks/useAuth';
import type { MainTabScreenProps, RootStackParamList } from '@navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = MainTabScreenProps<'JournalTab'>;

export const JournalListScreen = (_props: Props) => {
  const { entries, loading, error, retry } = useJournalEntries();
  const { user } = useAuth();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNewEntry = () => {
    rootNavigation.navigate('VoiceJournal', { mode: 'free' });
  };

  const handleOpenEntry = (entryId: string) => {
    rootNavigation.navigate('EntryDetail', { entryId });
  };

  return (
    <ScreenContainer testID="journal-screen">
      <View style={styles.header}>
        <AppText variant="h2">Your Journal</AppText>
        <AppText>{user?.email}</AppText>
      </View>

      <StateContainer
        loading={loading}
        error={error}
        data={entries}
        onRetry={retry}
        loadingMessage="Loading your journal..."
        emptyTitle="No entries yet"
        emptyMessage="Start your first voice journal to begin tracking your recovery journey."
        emptyActionLabel="Record First Entry"
        onEmptyAction={handleNewEntry}
      >
        <FlatList
          style={styles.list}
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <JournalEntryCard entry={item} onPress={() => handleOpenEntry(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListHeaderComponent={<PrimaryButton label="Start New Entry" onPress={handleNewEntry} />}
        />
      </StateContainer>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  list: {
    flexGrow: 1,
  },
  listContent: {
    gap: 16,
    paddingBottom: 120,
  },
});
