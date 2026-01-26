/**
 * FrameworkSelector Component
 *
 * Displays available journaling frameworks for the user to choose.
 * Suggests frameworks based on context (recovery phase, recent entries, time of day).
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type {
  RecoveryFramework,
  FrameworkSuggestion,
  FrameworkRecoveryPhase,
} from '../../types/frameworks';
import { frameworkList, frameworkCategories } from '../../data/frameworks';

interface FrameworkSelectorProps {
  onSelectFramework: (framework: RecoveryFramework) => void;
  recoveryPhase?: FrameworkRecoveryPhase;
  recentPainLevel?: number;
  suggestedFrameworks?: FrameworkSuggestion[];
  showCategories?: boolean;
}

export const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  onSelectFramework,
  recoveryPhase = 'active',
  recentPainLevel,
  suggestedFrameworks,
  showCategories = true,
}) => {
  // Get personalized suggestions if not provided
  const suggestions = useMemo(() => {
    if (suggestedFrameworks) return suggestedFrameworks;

    return getDefaultSuggestions(recoveryPhase, recentPainLevel);
  }, [suggestedFrameworks, recoveryPhase, recentPainLevel]);

  const topSuggestion = suggestions[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How would you like to journal?</Text>
        <Text style={styles.subtitle}>Choose a guided framework or just talk freely</Text>
      </View>

      {/* Top Recommendation */}
      {topSuggestion && (
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionLabel}>Recommended for you</Text>
          <FrameworkCard
            framework={topSuggestion.framework}
            onPress={() => onSelectFramework(topSuggestion.framework)}
            isRecommended
            reason={topSuggestion.reason}
          />
        </View>
      )}

      {/* Quick Options */}
      <View style={styles.quickOptions}>
        <Text style={styles.sectionLabel}>Quick options</Text>
        <View style={styles.quickGrid}>
          {suggestions.slice(1, 5).map(suggestion => (
            <QuickOptionChip
              key={suggestion.framework.id}
              framework={suggestion.framework}
              onPress={() => onSelectFramework(suggestion.framework)}
            />
          ))}
        </View>
      </View>

      {/* All Frameworks by Category */}
      {showCategories && (
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionLabel}>All frameworks</Text>
          {frameworkCategories.map(category => (
            <View key={category.category} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              {category.frameworks.map(framework => (
                <FrameworkCard
                  key={framework.id}
                  framework={framework}
                  onPress={() => onSelectFramework(framework)}
                  compact
                />
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// ============================================================================
// Sub-components
// ============================================================================

interface FrameworkCardProps {
  framework: RecoveryFramework;
  onPress: () => void;
  isRecommended?: boolean;
  reason?: string;
  compact?: boolean;
}

const FrameworkCard: React.FC<FrameworkCardProps> = ({
  framework,
  onPress,
  isRecommended = false,
  reason,
  compact = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.frameworkCard,
        isRecommended && styles.recommendedCard,
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
          <Text style={[styles.frameworkName, compact && styles.compactName]}>
            {framework.name}
          </Text>
          {!compact && <Text style={styles.frameworkDescription}>{framework.description}</Text>}
          {isRecommended && reason && <Text style={styles.reasonText}>{reason}</Text>}
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.durationText}>
            {framework.duration.min}-{framework.duration.max} min
          </Text>
          <Feather name="chevron-right" size={20} color="#7F8C8D" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface QuickOptionChipProps {
  framework: RecoveryFramework;
  onPress: () => void;
}

const QuickOptionChip: React.FC<QuickOptionChipProps> = ({ framework, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, { borderColor: framework.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Feather
        name={framework.icon as keyof typeof Feather.glyphMap}
        size={16}
        color={framework.color}
      />
      <Text style={[styles.chipText, { color: framework.color }]}>{framework.shortName}</Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

function getDefaultSuggestions(
  phase: FrameworkRecoveryPhase,
  painLevel?: number
): FrameworkSuggestion[] {
  const suggestions: FrameworkSuggestion[] = [];

  // Always include daily check-in first
  const dailyCheckIn = frameworkList.find(f => f.id === 'daily-check-in')!;
  suggestions.push({
    framework: dailyCheckIn,
    reason: 'Perfect for your daily reflection',
    priority: 10,
    isPersonalized: false,
  });

  // High pain? Suggest pain processing
  if (painLevel && painLevel >= 6) {
    const painFramework = frameworkList.find(f => f.id === 'pain-processing')!;
    suggestions.unshift({
      framework: painFramework,
      reason: "For when you're having a tough pain day",
      priority: 15,
      isPersonalized: true,
    });
  }

  // Phase-specific suggestions
  if (phase === 'early') {
    // Early recovery: focus on pain and basic tracking
    const painFramework = frameworkList.find(f => f.id === 'pain-processing')!;
    if (!suggestions.find(s => s.framework.id === 'pain-processing')) {
      suggestions.push({
        framework: painFramework,
        reason: 'Common in early recovery',
        priority: 8,
        isPersonalized: true,
      });
    }
  } else if (phase === 'active') {
    // Active recovery: support audit (isolation peaks at week 3-4)
    const supportFramework = frameworkList.find(f => f.id === 'support-audit')!;
    suggestions.push({
      framework: supportFramework,
      reason: 'Support often fades around this time',
      priority: 7,
      isPersonalized: true,
    });
  } else if (phase === 'late' || phase === 'maintenance') {
    // Late recovery: progress and meaning
    const progressFramework = frameworkList.find(f => f.id === 'progress-gratitude')!;
    suggestions.push({
      framework: progressFramework,
      reason: "Great time to see how far you've come",
      priority: 8,
      isPersonalized: true,
    });
  }

  // Add PT reflection
  const ptFramework = frameworkList.find(f => f.id === 'pt-reflection')!;
  suggestions.push({
    framework: ptFramework,
    reason: 'Process your PT sessions',
    priority: 6,
    isPersonalized: false,
  });

  // Add free journal as an option
  const freeJournal = frameworkList.find(f => f.id === 'free-journal')!;
  suggestions.push({
    framework: freeJournal,
    reason: 'When you just need to talk',
    priority: 5,
    isPersonalized: false,
  });

  // Sort by priority
  suggestions.sort((a, b) => b.priority - a.priority);

  return suggestions;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cardText: {
    flex: 1,
  },
  categoriesSection: {
    paddingBottom: 40,
  },
  categoryDescription: {
    color: '#7F8C8D',
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  categoryGroup: {
    marginBottom: 24,
  },
  categoryTitle: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactCard: {
    padding: 12,
  },
  compactName: {
    fontSize: 15,
  },
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1,
  },
  durationText: {
    color: '#7F8C8D',
    fontSize: 13,
  },
  frameworkCard: {
    backgroundColor: '#FFFFFF',
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
  frameworkDescription: {
    color: '#7F8C8D',
    fontSize: 14,
    lineHeight: 18,
  },
  frameworkName: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
  },
  quickOptions: {
    marginBottom: 24,
  },
  reasonText: {
    color: '#4A90E2',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  recommendedCard: {
    backgroundColor: '#F0F7FF',
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#7F8C8D',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 24,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#7F8C8D',
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    color: '#2C3E50',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
});

export default FrameworkSelector;
