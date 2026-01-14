# Safe Rollback Plan

#

# Use this when implementing a change that could affect stability.

# Fill in the placeholders as part of the PRD or implementation log.

## Rollback Trigger

- [ ] What signals require rollback?
  - Example: crash rate > 1%, auth failures spike, API errors increase

## What to Roll Back

- [ ] Feature name:
- [ ] Files or modules involved:
- [ ] Any data migrations or schema changes:

## Rollback Steps

1. Revert the change (branch or commit reference).
2. Re-deploy or re-run the previous stable build.
3. Verify critical paths:
   - [ ] Auth/login
   - [ ] Primary user flow
   - [ ] Data writes/reads

## Data Safety

- [ ] Confirm data migrations are backward compatible
- [ ] If not, document recovery steps

## Post-Rollback

- [ ] Record root cause
- [ ] Add test coverage to prevent regression
- [ ] Update PRD or specs with learnings
