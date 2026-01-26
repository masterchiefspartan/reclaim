/**
 * FrameworkSelectionScreen
 *
 * Allows users to choose a journaling framework before starting their entry.
 * This screen appears when user taps "Start Entry" from the home screen.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import type { RecoveryFramework, FrameworkSuggestion, PerspectiveId } from '@/types/frameworks';
import { useAppTheme } from '@/hooks/useAppTheme';
import { frameworkList, frameworkCategories, aiPerspectives } from '@/data/frameworks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FrameworkSelectionScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();

  const [selectedPerspective, setSelectedPerspective] =
    useState<PerspectiveId>('compassionate-companion');
  const [showPerspectives, setShowPerspectives] = useState(false);

  // Get personalized suggestions based on user context
  const suggestions = useMemo(() => {
    return getDefaultSuggestions();
  }, []);

  const handleSelectFramework = useCallback(
    (framework: RecoveryFramework) => {
      navigation.navigate('VoiceJournal', {
        mode: framework.id === 'free-journal' ? 'free' : 'guided',
        frameworkId: framework.id,
        perspectiveId: selectedPerspective,
      });
    },
    [navigation, selectedPerspective]
  );

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const topSuggestion = suggestions[0];
  const currentPerspective = aiPerspectives[selectedPerspective];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>New Journal Entry</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            How would you like to journal?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
            Choose a guided framework or just talk freely
          </Text>
        </View>

        {/* AI Perspective Selector */}
        <TouchableOpacity
          style={[styles.perspectiveSelector, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowPerspectives(!showPerspectives)}
        >
          <View style={styles.perspectiveLeft}>
            <View
              style={[styles.perspectiveIcon, { backgroundColor: currentPerspective.color + '20' }]}
            >
              <Feather
                name={currentPerspective.icon as keyof typeof Feather.glyphMap}
                size={18}
                color={currentPerspective.color}
              />
            </View>
            <View>
              <Text style={[styles.perspectiveLabel, { color: theme.colors.muted }]}>
                AI Perspective
              </Text>
              <Text style={[styles.perspectiveName, { color: theme.colors.text }]}>
                {currentPerspective.name}
              </Text>
            </View>
          </View>
          <Feather
            name={showPerspectives ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.muted}
          />
        </TouchableOpacity>

        {/* Expanded Perspective List */}
        {showPerspectives && (
          <View style={[styles.perspectiveList, { backgroundColor: theme.colors.surface }]}>
            {Object.values(aiPerspectives).map(perspective => (
              <TouchableOpacity
                key={perspective.id}
                style={[
                  styles.perspectiveOption,
                  selectedPerspective === perspective.id && styles.perspectiveOptionSelected,
                ]}
                onPress={() => {
                  if (!perspective.isPremium) {
                    setSelectedPerspective(perspective.id);
                    setShowPerspectives(false);
                  }
                }}
              >
                <View
                  style={[
                    styles.perspectiveOptionIcon,
                    { backgroundColor: perspective.color + '20' },
                  ]}
                >
                  <Feather
                    name={perspective.icon as keyof typeof Feather.glyphMap}
                    size={16}
                    color={perspective.color}
                  />
                </View>
                <View style={styles.perspectiveOptionText}>
                  <Text style={[styles.perspectiveOptionName, { color: theme.colors.text }]}>
                    {perspective.name}
                  </Text>
                  <Text
                    style={[styles.perspectiveOptionDesc, { color: theme.colors.muted }]}
                    numberOfLines={1}
                  >
                    {perspective.description}
                  </Text>
                </View>
                {perspective.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Feather name="lock" size={12} color="#7F8C8D" />
                    <Text style={styles.premiumText}>Pro</Text>
                  </View>
                )}
                {selectedPerspective === perspective.id && (
                  <Feather name="check" size={18} color={perspective.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recommended Framework */}
        {topSuggestion && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>
              RECOMMENDED FOR YOU
            </Text>
            <FrameworkCard
              framework={topSuggestion.framework}
              onPress={() => handleSelectFramework(topSuggestion.framework)}
              isRecommended
              reason={topSuggestion.reason}
              theme={theme}
            />
          </View>
        )}

        {/* Quick Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>QUICK OPTIONS</Text>
          <View style={styles.quickGrid}>
            {suggestions.slice(1, 5).map(suggestion => (
              <TouchableOpacity
                key={suggestion.framework.id}
                style={[styles.quickChip, { borderColor: suggestion.framework.color }]}
                onPress={() => handleSelectFramework(suggestion.framework)}
              >
                <Feather
                  name={suggestion.framework.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={suggestion.framework.color}
                />
                <Text style={[styles.quickChipText, { color: suggestion.framework.color }]}>
                  {suggestion.framework.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Frameworks by Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>ALL FRAMEWORKS</Text>
          {frameworkCategories.map(category => (
            <View key={category.category} style={styles.categoryGroup}>
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                {category.title}
              </Text>
              <Text style={[styles.categoryDescription, { color: theme.colors.muted }]}>
                {category.description}
              </Text>
              {category.frameworks.map(framework => (
                <FrameworkCard
                  key={framework.id}
                  framework={framework}
                  onPress={() => handleSelectFramework(framework)}
                  compact
                  theme={theme}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// FrameworkCard Component
// ============================================================================

interface FrameworkCardProps {
  framework: RecoveryFramework;
  onPress: () => void;
  isRecommended?: boolean;
  reason?: string;
  compact?: boolean;
  theme: any;
}

const FrameworkCard: React.FC<FrameworkCardProps> = ({
  framework,
  onPress,
  isRecommended = false,
  reason,
  compact = false,
  theme,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.frameworkCard,
        { backgroundColor: theme.colors.surface },
        isRecommended && styles.recommendedCard,
        isRecommended && { borderColor: framework.color },
        compact && styles.compactCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: framework.color + '20' }]}>
          <Feather
            name={framework.icon as keyof typeof Feather.glyphMap}
            size={compact ? 20 : 24}
            color={framework.color}
          />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.frameworkName,
              { color: theme.colors.text },
              compact && styles.compactName,
            ]}
          >
            {framework.name}
          </Text>
          {!compact && (
            <Text style={[styles.frameworkDescription, { color: theme.colors.muted }]}>
              {framework.description}
            </Text>
          )}
          {isRecommended && reason && (
            <Text style={[styles.reasonText, { color: framework.color }]}>{reason}</Text>
          )}
        </View>
        <View style={styles.cardMeta}>
          <Text style={[styles.durationText, { color: theme.colors.muted }]}>
            {framework.duration.min}-{framework.duration.max} min
          </Text>
          <Feather name="chevron-right" size={20} color={theme.colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

function getDefaultSuggestions(): FrameworkSuggestion[] {
  const suggestions: FrameworkSuggestion[] = [];

  // Daily check-in as top recommendation
  const dailyCheckIn = frameworkList.find(f => f.id === 'daily-check-in')!;
  suggestions.push({
    framework: dailyCheckIn,
    reason: 'Perfect for your daily reflection',
    priority: 10,
    isPersonalized: false,
  });

  // Add other options
  const painFramework = frameworkList.find(f => f.id === 'pain-processing')!;
  suggestions.push({
    framework: painFramework,
    reason: "For when you're having a tough pain day",
    priority: 8,
    isPersonalized: false,
  });

  const ptFramework = frameworkList.find(f => f.id === 'pt-reflection')!;
  suggestions.push({
    framework: ptFramework,
    reason: 'Process your PT sessions',
    priority: 7,
    isPersonalized: false,
  });

  const progressFramework = frameworkList.find(f => f.id === 'progress-gratitude')!;
  suggestions.push({
    framework: progressFramework,
    reason: "See how far you've come",
    priority: 6,
    isPersonalized: false,
  });

  const freeJournal = frameworkList.find(f => f.id === 'free-journal')!;
  suggestions.push({
    framework: freeJournal,
    reason: 'When you just need to talk',
    priority: 5,
    isPersonalized: false,
  });

  return suggestions;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  // Perspective Selector
  perspectiveSelector: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 12,
  },
  perspectiveLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  perspectiveIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  perspectiveLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  perspectiveName: {
    fontSize: 15,
    fontWeight: '600',
  },
  perspectiveList: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  perspectiveOption: {
    alignItems: 'center',
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 12,
  },
  perspectiveOptionSelected: {
    backgroundColor: '#F8F9FA',
  },
  perspectiveOptionIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    marginRight: 12,
    width: 32,
  },
  perspectiveOptionText: {
    flex: 1,
  },
  perspectiveOptionName: {
    fontSize: 14,
    fontWeight: '500',
  },
  perspectiveOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  premiumBadge: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    color: '#7F8C8D',
    fontSize: 11,
    fontWeight: '500',
  },
  // Sections
  section: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  // Quick options
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
  },
  quickChip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Category groups
  categoryGroup: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  categoryDescription: {
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  // Framework cards
  frameworkCard: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  recommendedCard: {
    borderWidth: 2,
  },
  compactCard: {
    padding: 12,
  },
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  cardText: {
    flex: 1,
  },
  frameworkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactName: {
    fontSize: 15,
  },
  frameworkDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  reasonText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  cardMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  durationText: {
    fontSize: 13,
  },
});

export default FrameworkSelectionScreen;
