import { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@hooks/useAppTheme';
import { AppText } from '@components/common/AppText';

interface LiveTranscriptProps {
  /** The current transcript text */
  transcript: string;
  /** Whether actively listening for speech */
  isListening: boolean;
  /** Error message if transcription fails */
  error?: string | null;
  /** Additional container styles */
  style?: ViewStyle;
  /** Placeholder text when no transcript */
  placeholder?: string;
}

/**
 * LiveTranscript Component
 * Displays real-time speech-to-text transcription with auto-scroll
 */
export const LiveTranscript = ({
  transcript,
  isListening,
  error,
  style,
  placeholder = 'Start speaking and your words will appear here...',
}: LiveTranscriptProps) => {
  const { theme } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when transcript changes (unless user is scrolling)
  useEffect(() => {
    if (!isUserScrolling.current && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [transcript]);

  const handleScrollBegin = () => {
    isUserScrolling.current = true;
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  };

  const handleScrollEnd = () => {
    // Reset after a delay to allow auto-scroll when user stops scrolling
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000);
  };

  const hasTranscript = transcript.trim().length > 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather
            name="mic"
            size={16}
            color={isListening ? theme.colors.primary : theme.colors.textSecondary}
          />
          <AppText
            variant="caption"
            color={isListening ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.headerText}
          >
            {isListening ? 'Listening...' : 'Live Transcript'}
          </AppText>
        </View>
        {isListening && (
          <View style={[styles.listeningIndicator, { backgroundColor: theme.colors.primary }]} />
        )}
      </View>

      {/* Transcript Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        showsVerticalScrollIndicator={true}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color={theme.colors.error} />
            <AppText variant="body" color={theme.colors.error} style={styles.errorText}>
              {error}
            </AppText>
          </View>
        ) : hasTranscript ? (
          <AppText variant="body" style={styles.transcript}>
            {transcript}
            {isListening && <AppText style={styles.cursor}>|</AppText>}
          </AppText>
        ) : (
          <AppText variant="body" color={theme.colors.textSecondary} style={styles.placeholder}>
            {isListening ? 'Listening for speech...' : placeholder}
          </AppText>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    minHeight: 120,
    overflow: 'hidden',
  },
  cursor: {
    color: '#C85A8C',
    fontWeight: '300',
  },
  errorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  headerText: {
    fontWeight: '500',
  },
  listeningIndicator: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  placeholder: {
    fontStyle: 'italic',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 12,
  },
  scrollView: {
    flex: 1,
  },
  transcript: {
    lineHeight: 24,
  },
});
