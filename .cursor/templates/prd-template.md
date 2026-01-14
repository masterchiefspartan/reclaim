# PRD Template for Autonomous Implementation

#

# Goal: Provide a complete, unambiguous spec so automated work is safe.

# Keep each PRD focused to one feature or one user flow.

# Feature: [Feature Name]

## 1. Objective

[One sentence describing what this feature accomplishes.]

## 2. User Story

As a [user type], I want [goal] so that [benefit].

## 3. Requirements

### Functional Requirements

- [ ] FR1: [Requirement]
- [ ] FR2: [Requirement]
- [ ] FR3: [Requirement]

### Non-Functional Requirements

- [ ] Performance: [Constraint]
- [ ] Security: [Constraint]
- [ ] Accessibility: [Constraint]

## 4. Technical Specification

### Files to Create or Modify

- `src/screens/[ScreenName].tsx` - [Purpose]
- `src/hooks/use[Feature].ts` - [Purpose]
- `src/services/[feature]/[service].ts` - [Purpose]
- `src/types/[feature].ts` - [Purpose]

### Data Flow

User action -> Hook -> Service -> Backend -> Response -> UI update

### API Contract

```typescript
interface FeatureInput {
  // ...
}

interface FeatureOutput {
  // ...
}
```

### UI States

- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Success

## 5. Acceptance Criteria

- [ ] AC1: When [action], then [expected result]
- [ ] AC2: When [action], then [expected result]

## 6. Implementation Checklist

- [ ] Types defined
- [ ] Service created
- [ ] Hook created
- [ ] Components created
- [ ] Screens created
- [ ] Error handling added
- [ ] Loading and empty states added
- [ ] Security checklist verified
- [ ] Tests added (if applicable)

## 7. References

- Architecture: @ARCHITECTURE_DECISIONS.md
- Backend: @BACKEND_PLAN.md
- UI: @APP_PLAN.md
