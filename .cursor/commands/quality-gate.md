# Quality Gate Checklist

#

# Use this after implementation to confirm safety and stability.

# Intended for automated runs and human review.

## Code Quality

- [ ] All function parameters and returns are typed
- [ ] No `any` types without justification
- [ ] No unused imports or variables
- [ ] No inline styles in React Native components

## Error Handling

- [ ] All async operations use try/catch
- [ ] Errors are logged with context (no sensitive data)
- [ ] User-facing errors are friendly
- [ ] No silent failures unless explicitly allowed

## Security

- [ ] No hardcoded secrets
- [ ] Auth checks exist for protected operations
- [ ] Input validation for user-supplied data
- [ ] Errors do not leak internal details

## Stability

- [ ] Loading, empty, error, and success states are implemented
- [ ] Cleanup logic exists for subscriptions/timers/streams
- [ ] Long-running operations have timeouts or cancellation

## Performance

- [ ] No `ScrollView` used for long lists (use `FlatList`)
- [ ] `useMemo` and `useCallback` used for expensive work
- [ ] Avoid inline functions in render for frequently re-rendered components

## Testing

- [ ] Tests added for core logic (if applicable)
- [ ] Critical paths have manual test steps documented

## Documentation

- [ ] New public functions are documented
- [ ] README or module docs updated if needed

## Final Decision

- [ ] Safe to merge
