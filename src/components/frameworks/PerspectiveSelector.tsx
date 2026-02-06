/**
 * PerspectiveSelector Component
 *
 * Allows users to choose which AI perspective they want to respond.
 * Similar to Mindsera's "Minds" feature - multiple AI personas.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { AIPerspective, PerspectiveId } from '../../types/frameworks';
import { perspectiveList } from '../../data/frameworks';

interface PerspectiveSelectorProps {
  selectedPerspective: PerspectiveId;
  onSelectPerspective: (perspectiveId: PerspectiveId) => void;
  isPremiumUser?: boolean;
  showDescription?: boolean;
}

export const PerspectiveSelector: React.FC<PerspectiveSelectorProps> = ({
  selectedPerspective,
  onSelectPerspective,
  isPremiumUser = false,
  showDescription = true,
}) => {
  const handleSelect = (perspective: AIPerspective) => {
    if (perspective.isPremium && !isPremiumUser) {
      // Could show upgrade modal here
      return;
    }
    onSelectPerspective(perspective.id);
  };

  return (
    <View style={styles.container}>
      {showDescription && (
        <View style={styles.header}>
          <Text style={styles.title}>Choose a perspective</Text>
          <Text style={styles.subtitle}>Different voices offer different insights</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {perspectiveList.map(perspective => (
          <PerspectiveCard
            key={perspective.id}
            perspective={perspective}
            isSelected={selectedPerspective === perspective.id}
            isLocked={perspective.isPremium && !isPremiumUser}
            onPress={() => handleSelect(perspective)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// PerspectiveCard Sub-component
// ============================================================================

interface PerspectiveCardProps {
  perspective: AIPerspective;
  isSelected: boolean;
  isLocked: boolean;
  onPress: () => void;
}

const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  perspective,
  isSelected,
  isLocked,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        isSelected && { borderColor: perspective.color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLocked}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: perspective.color + '20' }]}>
        <Feather
          name={perspective.icon as keyof typeof Feather.glyphMap}
          size={24}
          color={perspective.color}
        />
      </View>

      {/* Name */}
      <Text style={styles.perspectiveName}>{perspective.shortName}</Text>

      {/* Description */}
      <Text style={styles.perspectiveDescription} numberOfLines={2}>
        {perspective.description}
      </Text>

      {/* Lock indicator for premium */}
      {isLocked && (
        <View style={styles.lockBadge}>
          <Feather name="lock" size={12} color="#7F8C8D" />
          <Text style={styles.lockText}>Premium</Text>
        </View>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <View style={[styles.selectedBadge, { backgroundColor: perspective.color }]}>
          <Feather name="check" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// Compact Selector (for inline use)
// ============================================================================

interface CompactPerspectiveSelectorProps {
  selectedPerspective: PerspectiveId;
  onSelectPerspective: (perspectiveId: PerspectiveId) => void;
  isPremiumUser?: boolean;
}

export const CompactPerspectiveSelector: React.FC<CompactPerspectiveSelectorProps> = ({
  selectedPerspective,
  onSelectPerspective,
  isPremiumUser = false,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.compactScroll}
    >
      {perspectiveList.map(perspective => {
        const isSelected = selectedPerspective === perspective.id;
        const isLocked = perspective.isPremium && !isPremiumUser;

        return (
          <TouchableOpacity
            key={perspective.id}
            style={[
              styles.compactChip,
              isSelected && styles.compactChipSelected,
              isSelected && {
                borderColor: perspective.color,
                backgroundColor: perspective.color + '10',
              },
            ]}
            onPress={() => {
              if (!isLocked) {
                onSelectPerspective(perspective.id);
              }
            }}
            activeOpacity={0.7}
          >
            <Feather
              name={perspective.icon as keyof typeof Feather.glyphMap}
              size={16}
              color={isSelected ? perspective.color : '#7F8C8D'}
            />
            <Text style={[styles.compactChipText, isSelected && { color: perspective.color }]}>
              {perspective.shortName}
            </Text>
            {isLocked && <Feather name="lock" size={12} color="#BDC3C7" />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    width: 140,
  },
  selectedCard: {
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    width: 48,
  },
  perspectiveName: {
    color: '#2C3E50',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  perspectiveDescription: {
    color: '#7F8C8D',
    fontSize: 12,
    lineHeight: 16,
  },
  lockBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  lockText: {
    color: '#7F8C8D',
    fontSize: 11,
  },
  selectedBadge: {
    alignItems: 'center',
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 22,
  },
  // Compact styles
  compactScroll: {
    gap: 8,
    paddingHorizontal: 16,
  },
  compactChip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compactChipSelected: {
    borderWidth: 1.5,
  },
  compactChipText: {
    color: '#7F8C8D',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default PerspectiveSelector;
