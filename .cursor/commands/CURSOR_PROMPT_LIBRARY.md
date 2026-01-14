# 🚀 Cursor Prompt Library - Your Code Maintenance Toolkit

> **Last Updated:** January 6, 2025  
> **Version:** 1.0  
> **Purpose:** A comprehensive guide to maintaining code quality using AI-powered prompts

---

## 📖 HOW TO USE THIS GUIDE

### **Think of this as your code maintenance checklist**

Just like a pilot uses a pre-flight checklist, you'll use these prompts at specific moments in your development workflow. Don't try to use all of them at once - that's overwhelming and unnecessary.

### **The Three Questions to Ask Yourself:**

1. **"What am I about to do?"** → Use "Before You Start" prompts
2. **"What did I just do?"** → Use "After You Code" prompts
3. **"Is something wrong?"** → Use "When Things Break" prompts

### **Quick Start (If You're New):**

Start with just these 3 prompts for your first week:

1. **Daily:** Prompt #1 (Dead Code Detection) before you start coding
2. **Before Committing:** Prompt #9 (Error Handling Audit)
3. **Before PR:** Prompt #13 (Documentation Generator)

That's it. Master these three, then gradually add more.

---

## 🎯 WHEN TO USE WHICH PROMPT - THE DECISION TREE

```
START HERE
    ├─ Are you STARTING a new feature/task?
    │   ├─ Yes → Use Section: "BEFORE YOU START CODING"
    │   └─ No → Continue below
    │
    ├─ Did you JUST FINISH writing code?
    │   ├─ Yes → Use Section: "AFTER YOU CODE"
    │   └─ No → Continue below
    │
    ├─ Are you ABOUT TO COMMIT/PUSH?
    │   ├─ Yes → Use Section: "BEFORE YOU COMMIT"
    │   └─ No → Continue below
    │
    ├─ Is something SLOW/BROKEN/BUGGY?
    │   ├─ Yes → Use Section: "WHEN THINGS BREAK"
    │   └─ No → Continue below
    │
    ├─ Is it END OF WEEK/SPRINT?
    │   ├─ Yes → Use Section: "WEEKLY MAINTENANCE"
    │   └─ No → Continue below
    │
    └─ Just want to CLEAN UP the codebase?
        └─ Yes → Use Section: "DEEP CLEANING"
```

---

## 🗓️ YOUR CODING ROUTINE WITH PROMPTS

### **Morning (Before You Code) - 5 minutes**

```
☐ Run Prompt #1 on files you'll touch today
☐ Run Prompt #27 to understand dependencies
☐ Check Prompt #28 for today's focus
```

### **After Writing Code - 3 minutes**

```
☐ Run Prompt #9 on your new code
☐ Run Prompt #3 on your new code
☐ Run Prompt #13 if you added new functions
```

### **Before Committing - 10 minutes**

```
☐ Run Prompt #35 (Ultimate Combo) on changed files
☐ Run Prompt #11 to ensure tests exist
☐ Run Prompt #7 for security check
```

### **End of Day - 5 minutes**

```
☐ Run Prompt #2 on today's work
☐ Run Prompt #13 to document what you built
☐ Run Prompt #29 to plan tomorrow
```

### **Friday Afternoon - 30 minutes**

```
☐ Run Prompt #4 on the week's code
☐ Run Prompt #15 to check dependencies
☐ Run Prompt #19 to check architecture
```

---

## 📚 THE COMPLETE PROMPT LIBRARY

Below are all prompts organized by use case. Each prompt includes:

- 🎯 **When to use it** (the scenario)
- 📥 **What you'll get** (the output)
- ⚡ **Copy-paste ready prompt** (use as-is)

---

## 🔵 SECTION 1: BEFORE YOU START CODING

These prompts help you understand what you're about to touch BEFORE you break something.

---

### Prompt #27: Dependency Mapper

**File:** `prompt-dependency-mapper.md`

🎯 **When to use:**

- You're about to refactor a function/component
- You want to know what will break if you change something
- You're inheriting someone else's code

📥 **What you'll get:**

- Visual map of what depends on this code
- List of files that import/use this code
- Potential breaking changes if you modify it

⚡ **The Prompt:**

```
I'm about to modify [function/component/module name].

Before I make changes, show me:
1. All files that import or depend on this code
2. All functions that call this function
3. All components that use this component
4. Potential breaking changes if I modify the signature/interface
5. Tests that cover this code (if any)

Format as:
- DIRECT DEPENDENCIES: Files that directly import this
- INDIRECT DEPENDENCIES: Files that depend on direct dependents
- TESTS: Test files covering this code
- RISK LEVEL: High/Medium/Low for refactoring
```

**Example Usage:**

```
I'm about to modify the `calculateTotalCost` function in utils/pricing.js.

Before I make changes, show me:
[rest of prompt above]
```

---

### Prompt #28: Context Builder

**File:** `prompt-context-builder.md`

🎯 **When to use:**

- Starting work on a new feature
- Coming back to code after a break
- Trying to understand unfamiliar code

📥 **What you'll get:**

- Summary of what this code does
- Key functions/components explained
- Data flow diagram (text-based)
- Where to start making changes

⚡ **The Prompt:**

```
Help me understand this codebase/module/feature before I start working on it.

Provide:
1. HIGH-LEVEL PURPOSE: What does this code do in one sentence?
2. KEY COMPONENTS: List the 3-5 most important files/functions
3. DATA FLOW: How does data move through this code?
4. EXTERNAL DEPENDENCIES: What APIs/services does this interact with?
5. COMMON MODIFICATIONS: What do people usually change here?
6. GOTCHAS: What should I be careful about?
7. STARTING POINT: If I want to add [specific feature], where should I start?

Format this as a briefing I can read in 2 minutes.
```

**Example Usage:**

```
Help me understand the bartender authentication module before I start working on it.
[rest of prompt above]
Starting point: If I want to add fingerprint authentication, where should I start?
```

---

### Prompt #29: Task Breakdown

**File:** `prompt-task-breakdown.md`

🎯 **When to use:**

- You have a vague feature request
- You don't know where to start
- You want to estimate time accurately

📥 **What you'll get:**

- Step-by-step implementation plan
- Estimated time for each step
- Potential blockers identified upfront

⚡ **The Prompt:**

```
I need to implement: [describe feature/task]

Break this down into concrete coding steps:

1. PREPARATION:
   - Files I need to read/understand first
   - Dependencies I might need to add
   - Database changes required (if any)

2. IMPLEMENTATION STEPS:
   - Step 1: [What to do]
     - Estimated time: [X minutes/hours]
     - Files to modify: [list]
     - Potential blockers: [list]
   - Step 2: [continue...]

3. TESTING STEPS:
   - What tests to write
   - What to manually test

4. EDGE CASES TO CONSIDER:
   - [List potential issues]

5. TOTAL ESTIMATED TIME: [X hours]

Order steps by dependency (what must happen first).
```

**Example Usage:**

```
I need to implement: Add real-time theft alerts when bartender pours without POS transaction

Break this down into concrete coding steps:
[rest of prompt above]
```

---

## 🟢 SECTION 2: AFTER YOU CODE

You just wrote some code. Use these prompts to make sure it's clean before you move on.

---

### Prompt #1: Dead Code Detection

**File:** `prompt-dead-code.md`

🎯 **When to use:**

- After you finish a feature
- Before you commit
- When you've deleted/refactored code

📥 **What you'll get:**

- List of unused imports, functions, variables
- Commented-out code to remove
- Duplicate code to consolidate

⚡ **The Prompt:**

```
Analyze this codebase and identify:

1. UNUSED IMPORTS:
   - List each unused import
   - File and line number
   - Safe to remove? Yes/No

2. UNUSED FUNCTIONS/VARIABLES:
   - Name of function/variable
   - Defined in: [file:line]
   - Never called from: anywhere
   - Safe to remove? Yes/No

3. UNREACHABLE CODE:
   - Code that can never execute
   - Why it's unreachable
   - Safe to remove? Yes

4. COMMENTED CODE:
   - Code blocks commented out
   - How long have they been commented? (check git history if possible)
   - Reason they're commented (if obvious)
   - Recommend: Delete or uncomment?

5. DUPLICATE CODE:
   - Similar code blocks (>5 lines)
   - Locations: [list files:lines]
   - Suggested consolidation: Extract to function named [X]

FORMAT:
For each category, list items with:
✓ Safe to delete immediately
⚠ Maybe safe (needs review)
✗ Don't delete (still used, just not obvious)
```

**Example Usage:**

```
Analyze this codebase and identify:
[run on current file, or use @workspace for entire project]
```

---

### Prompt #2: Code Smell Detector

**File:** `prompt-code-smells.md`

🎯 **When to use:**

- After writing a complex function
- Code review before submitting PR
- When code feels "messy" but you can't pinpoint why

📥 **What you'll get:**

- Specific refactoring suggestions
- Complexity scores
- Before/after code examples

⚡ **The Prompt:**

```
Review this code for common code smells and suggest specific refactorings:

1. LONG FUNCTIONS (>50 lines):
   - Function name: [name]
   - Current length: [X lines]
   - Suggested split: Break into [function1], [function2], [function3]
   - Provide refactored version

2. TOO MANY PARAMETERS (>4):
   - Function name: [name]
   - Current parameters: [X]
   - Suggested refactor: Use options object / split function / other
   - Provide refactored version

3. DEEP NESTING (>3 levels):
   - Location: [file:line]
   - Current nesting: [X levels]
   - Suggested refactor: Early returns / extract function / guard clauses
   - Provide refactored version

4. REPEATED LOGIC:
   - Pattern repeated: [describe]
   - Locations: [list file:line]
   - Suggested refactor: Extract to function named [X]
   - Provide extracted function

5. MAGIC NUMBERS/STRINGS:
   - Value: [value]
   - Used in: [locations]
   - Suggested constant name: [NAME]
   - Provide constant definition

6. GOD CLASSES (>500 lines or >10 methods):
   - Class name: [name]
   - Current size: [X lines, Y methods]
   - Suggested split: [Class1], [Class2], [Class3]
   - Responsibility of each new class

PRIORITY:
Rank issues by:
1. Impact on maintainability (High/Medium/Low)
2. Difficulty to refactor (Easy/Medium/Hard)
3. Recommended order to tackle
```

**Example Usage:**

```
Review this code for common code smells and suggest specific refactorings:
[paste your code or use current file]
```

---

### Prompt #3: Naming Consistency

**File:** `prompt-naming-consistency.md`

🎯 **When to use:**

- After adding new variables/functions
- During code review
- When onboarding to a new team (learn their conventions)

📥 **What you'll get:**

- List of naming violations
- Suggested renames
- Project naming conventions documented

⚡ **The Prompt:**

```
Audit naming conventions across this codebase and suggest improvements:

1. VARIABLE NAMING:
   Current style detected: [camelCase/snake_case/other]
   Inconsistencies found:
   - Variable: [name] (file:line)
   - Current style: [style]
   - Should be: [corrected_name]
   - Reason: [explanation]

2. FUNCTION NAMING:
   Expected pattern: [verb][Noun] (e.g., getUserData, calculateTotal)
   Issues found:
   - Function: [name]
   - Problem: [not following verb-noun / unclear purpose / other]
   - Suggested rename: [better_name]

3. CLASS/COMPONENT NAMING:
   Expected: PascalCase nouns
   Issues found:
   - Class: [name]
   - Problem: [not PascalCase / verb instead of noun / other]
   - Suggested rename: [BetterName]

4. CONSTANTS:
   Expected: UPPER_SNAKE_CASE
   Issues found:
   - Constant: [name]
   - Current: [style]
   - Should be: [CORRECTED_NAME]

5. BOOLEAN VARIABLES:
   Expected: is/has/should prefix
   Issues found:
   - Variable: [name]
   - Current: [name]
   - Should be: [isActive/hasPermission/shouldRender]

6. FILE NAMING:
   Current convention: [kebab-case/camelCase/PascalCase]
   Inconsistencies:
   - File: [filename]
   - Should be: [corrected-filename]

SUMMARY:
- Total issues found: [X]
- Most common violation: [type]
- Recommended project standard: [document the convention]

REFACTORING SCRIPT:
Provide a find/replace list for automated refactoring:
Old Name → New Name
[old] → [new]
```

**Example Usage:**

```
Audit naming conventions across this codebase and suggest improvements:
[run on @workspace or specific files]
```

---

### Prompt #9: Error Handling Audit

**File:** `prompt-error-handling.md`

🎯 **When to use:**

- After writing any code that could fail
- Before deploying to production
- When debugging production errors

📥 **What you'll get:**

- Missing try/catch blocks identified
- Better error messages suggested
- Logging improvements

⚡ **The Prompt:**

````
Review error handling patterns in this code:

1. MISSING ERROR HANDLING:
   Location: [file:line]
   Risk: [function/operation] can fail but has no try/catch
   Failure scenario: [what could go wrong]
   Suggested fix:
   ```[language]
   try {
     // existing code
   } catch (error) {
     // suggested error handling
   }
````

2. SILENT FAILURES:
   Location: [file:line]
   Problem: Empty catch block / error not logged
   Current code: [show]
   Suggested fix: [show improved version with logging]

3. POOR ERROR MESSAGES:
   Location: [file:line]
   Current message: "[current error message]"
   Problem: [not helpful / no context / technical jargon]
   User-facing suggestion: "[better message]"
   Log suggestion: "[detailed technical log]"

4. UNHANDLED PROMISE REJECTIONS:
   Location: [file:line]
   Promise: [promise name/operation]
   Missing: .catch() or try/await/catch
   Suggested fix: [show code]

5. INCONSISTENT ERROR HANDLING:
   Pattern 1: [describe approach in file A]
   Pattern 2: [describe approach in file B]
   Recommendation: Standardize to [preferred pattern]
   Example implementation:

   ```[language]
   // show standardized error handling
   ```

6. LOGGING QUALITY:
   Issues found:
   - Missing context: [location]
   - Wrong log level: [location - should be error not info]
   - Sensitive data logged: [location - remove password/token]
   - Not enough info to debug: [location - add more context]

7. ERROR RECOVERY:
   Location: [file:line]
   Current: Error thrown, app crashes
   Suggested: [retry logic / fallback / graceful degradation]
   Code example: [show]

CRITICAL OPERATIONS TO PROTECT:
List all operations that MUST have error handling:

1. [Database operations]
2. [API calls]
3. [File I/O]
4. [User input processing]
5. [Payment processing]

Show current status: ✓ Protected / ✗ Missing

```

**Example Usage:**
```

Review error handling patterns in this code:
[paste code or use current file]

```

---

### Prompt #13: Documentation Generator
**File:** `prompt-documentation.md`

🎯 **When to use:**
- After writing any new function
- Before submitting PR
- When code reviewers ask "what does this do?"

📥 **What you'll get:**
- Proper JSDoc/docstrings
- Usage examples
- Parameter descriptions

⚡ **The Prompt:**
```

Generate comprehensive documentation for this code:

For EACH PUBLIC FUNCTION/METHOD:

1. FUNCTION SIGNATURE DOCUMENTATION:

```[language]
/**
 * [One-sentence description of what it does]
 *
 * [Longer explanation if complex - 2-3 sentences about:
 *  - What problem it solves
 *  - How it works (high-level)
 *  - When to use it vs alternatives]
 *
 * @param {type} paramName - [Description of parameter, including:
 *                             - What it represents
 *                             - Valid values/range
 *                             - Default if optional]
 * @param {type} param2 - [Description]
 *
 * @returns {type} [Description of return value, including:
 *                   - What it represents
 *                   - Possible values
 *                   - What null/undefined means if applicable]
 *
 * @throws {ErrorType} [When this error is thrown and why]
 *
 * @example
 * // [Describe the use case]
 * const result = functionName(param1, param2);
 * // result = [example output]
 *
 * @example
 * // [Edge case or advanced use]
 * const result = functionName(specialCase);
 */
function functionName(param1, param2) {
  // implementation
}
```

2. INLINE COMMENTS FOR COMPLEX LOGIC:
   Identify code blocks that need explanation:

- Location: [line numbers]
- Current: No comment
- Add:

```[language]
// Explanation of why we do this (not what - code shows what)
// Edge case: [describe scenario this handles]
```

3. EDGE CASES & GOTCHAS:
   Document non-obvious behavior:

```
// GOTCHA: This function modifies the input array in place
// If you need the original, clone it first: [...array]

// EDGE CASE: Returns null if user not found
// Check for null before using: if (user) { ... }

// PERFORMANCE: O(n²) complexity - avoid for large datasets
// For >1000 items, use [alternative approach]
```

4. USAGE EXAMPLES:
   For each function, provide 2-3 examples:

- Basic usage (most common case)
- Advanced usage (with all options)
- Error handling (how to handle failures)

```[language]
// BASIC USAGE
const user = await getUserById('123');

// WITH OPTIONS
const user = await getUserById('123', {
  includePermissions: true,
  includeHistory: false
});

// ERROR HANDLING
try {
  const user = await getUserById('invalid');
} catch (error) {
  if (error.code === 'USER_NOT_FOUND') {
    // handle gracefully
  }
}
```

5. TYPE DEFINITIONS (if TypeScript/typed):
   Ensure all functions have proper type annotations:

```typescript
interface UserOptions {
  includePermissions?: boolean;
  includeHistory?: boolean;
}

function getUserById(id: string, options?: UserOptions): Promise<User | null>;
```

6. README/MODULE DOCUMENTATION:
   If this is a module/package, create overview documentation:

```markdown
## [Module Name]

### Purpose

[What problem this module solves]

### Installation

[How to add to project]

### Quick Start

[Minimal example to get started]

### API Reference

[Link to generated docs or list key functions]

### Common Patterns

[Show 2-3 real-world usage patterns]

### Troubleshooting

[Common issues and solutions]
```

STYLE GUIDE:

- Use active voice ("Returns user object" not "User object is returned")
- Focus on WHY not WHAT (code shows what)
- Include examples for anything non-obvious
- Document failure modes and how to handle them
- Keep descriptions under 80 characters per line

```

**Example Usage:**
```

Generate comprehensive documentation for this code:
[paste your new function]

```

---

## 🟡 SECTION 3: BEFORE YOU COMMIT

These prompts are your "pre-flight checklist" before pushing code.

---

### Prompt #35: Ultimate Combo Pre-Commit Audit
**File:** `prompt-pre-commit-audit.md`

🎯 **When to use:**
- Right before `git commit`
- Before submitting a pull request
- Before merging to main branch

📥 **What you'll get:**
- Comprehensive quality report
- Prioritized list of issues to fix
- Green light to commit or "fix these first"

⚡ **The Prompt:**
```

Perform a comprehensive pre-commit audit on the files I've changed:

RUN ALL CHECKS:

1. ✓ CLEANUP:
   - Unused imports, functions, variables
   - Commented-out code to remove
   - Inconsistent naming
   - Code smells (long functions, deep nesting)
2. ✓ PERFORMANCE:
   - Obvious bottlenecks (nested loops, N+1 queries)
   - Missing async where needed
   - Large data structures that should paginate
3. ✓ SECURITY:
   - Hardcoded secrets or API keys
   - SQL injection risks
   - XSS vulnerabilities
   - Unvalidated user input
4. ✓ ERROR HANDLING:
   - Missing try/catch blocks
   - Silent failures (empty catch)
   - Poor error messages
   - Unhandled promise rejections
5. ✓ TESTING:
   - New code without tests
   - Edge cases not covered
   - Breaking changes without test updates
6. ✓ DOCUMENTATION:
   - New functions without JSDoc/docstrings
   - Missing parameter descriptions
   - No usage examples for complex functions
7. ✓ TYPE SAFETY:
   - Functions missing return types
   - Use of 'any' that should be specific
   - Missing null checks

OUTPUT FORMAT:

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Changed: [X]
Issues Found: [Total count]
Critical: [count]
High: [count]
Medium: [count]
Low: [count]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL ISSUES (Fix before commit):
🔴 [Issue 1]
File: [file:line]
Problem: [description]
Fix: [suggested solution]
Est. time: [X minutes]

🔴 [Issue 2]
[same format]

HIGH PRIORITY (Strongly recommended):
🟠 [Issue 3]
[same format]

MEDIUM PRIORITY (Should fix soon):
🟡 [Issue 4]
[same format]

LOW PRIORITY (Nice to have):
🔵 [Issue 5]
[same format]

COMMIT DECISION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Safe to commit (0 critical issues)
OR
⛔ DO NOT COMMIT - Fix [X] critical issues first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED ACTION PLAN:

1. [First thing to fix - 5 min]
2. [Second thing - 10 min]
3. [Third thing - 3 min]

Total time to make commit-ready: [X minutes]

```

**Example Usage:**
```

Perform a comprehensive pre-commit audit on the files I've changed:
[Cursor will automatically detect changed files, or you can specify]

```

---

### Prompt #11: Test Coverage Gaps
**File:** `prompt-test-coverage.md`

🎯 **When to use:**
- After writing any new function
- Before submitting PR
- When CI shows low test coverage

📥 **What you'll get:**
- Specific test cases to write
- Coverage % estimate
- Edge cases you missed

⚡ **The Prompt:**
```

Identify untested or under-tested code and suggest specific test cases:

1. FUNCTIONS WITHOUT TESTS:
   Function: [name] (file:line)
   Complexity: [High/Medium/Low]
   Why it needs tests: [reason]

   Suggested test cases:

   TEST 1: Happy path

   ```[language]
   test('should [expected behavior] when [condition]', () => {
     // Arrange
     const input = [example];

     // Act
     const result = functionName(input);

     // Assert
     expect(result).toBe([expected]);
   });
   ```

   TEST 2: Edge case

   ```[language]
   test('should [handle edge case] when [condition]', () => {
     // test code
   });
   ```

   TEST 3: Error case

   ```[language]
   test('should throw error when [invalid input]', () => {
     // test code
   });
   ```

2. EDGE CASES NOT COVERED:
   Function: [name]
   Existing tests: [list what's already tested]
   Missing edge cases:
   - Null/undefined input
   - Empty array/string
   - Very large numbers
   - Negative numbers
   - Special characters in string
   - [other specific edge cases]

   Test code for each: [provide]

3. ERROR PATHS NOT TESTED:
   Function: [name]
   Error scenarios to test:
   - Network failure
   - Timeout
   - Invalid permissions
   - Database connection lost
   - [other error scenarios]

   Test code: [provide]

4. INTEGRATION POINTS NOT TESTED:
   Component: [name]
   External dependencies:
   - API call to [service]
   - Database query to [table]
   - External service [name]

   Need integration tests for:
   - [Scenario 1]
   - [Scenario 2]

   Mock/stub strategy: [describe]
   Test code: [provide]

5. COMPLEX LOGIC WITHOUT UNIT TESTS:
   Location: [file:line]
   Code complexity: [cyclomatic complexity score if available]
   Current coverage: [X%]
   Target coverage: [90%+]

   Break down into test cases:
   - Case 1: [condition] → [expected result]
   - Case 2: [condition] → [expected result]
   - Case 3: [condition] → [expected result]

COVERAGE ESTIMATE:
Current coverage: [X%]
After suggested tests: [Y%]
Remaining gaps: [describe what will still be untested]

PRIORITY:
Order tests to write by:

1. [Test name] - Critical (High risk if broken)
2. [Test name] - High (Common use case)
3. [Test name] - Medium (Edge case but important)
4. [Test name] - Low (Rare scenario)

```

**Example Usage:**
```

Identify untested or under-tested code and suggest specific test cases:
[run on new functions or entire changed files]

```

---

### Prompt #7: Security Vulnerability Scan
**File:** `prompt-security-scan.md`

🎯 **When to use:**
- Before every commit (seriously)
- Before deploying to production
- After adding any user input handling

📥 **What you'll get:**
- Security vulnerabilities found
- Severity ratings
- Specific fixes with code examples

⚡ **The Prompt:**
```

Perform a security audit of this code. Find vulnerabilities and provide fixes:

1. SQL INJECTION VULNERABILITIES:
   Location: [file:line]
   Vulnerable code:

   ```[language]
   [show vulnerable code]
   ```

   Exploit scenario:
   User could input: `[example malicious input]`
   Resulting query: `[show dangerous query]`
   Impact: [data breach / data deletion / unauthorized access]

   Severity: 🔴 CRITICAL

   Fix:

   ```[language]
   [show parameterized query / ORM usage / prepared statement]
   ```

2. XSS (Cross-Site Scripting):
   Location: [file:line]
   Vulnerable code:

   ```[language]
   innerHTML = userInput;
   ```

   Exploit scenario:
   User inputs: `<script>alert('XSS')</script>`
   Impact: [steal cookies / redirect user / keylogger]

   Severity: 🔴 CRITICAL

   Fix:

   ```[language]
   textContent = userInput; // or use DOMPurify
   ```

3. HARDCODED SECRETS:
   Location: [file:line]
   Found:
   - API key: `[first 4 chars]***` (NEVER COMMIT THIS)
   - Password: `***` (NEVER COMMIT THIS)
   - Token: `***` (NEVER COMMIT THIS)

   Severity: 🔴 CRITICAL

   Fix:
   1. Remove from code immediately
   2. Rotate the secret (generate new one)
   3. Store in environment variable:

   ```[language]
   const apiKey = process.env.API_KEY;
   if (!apiKey) throw new Error('API_KEY not set');
   ```

   4. Add to .gitignore: .env
   5. Document in .env.example

4. UNVALIDATED USER INPUT:
   Location: [file:line]
   Input: [parameter name]
   Used in: [operation]
   Risk: [injection / DoS / data corruption]

   Severity: 🟠 HIGH

   Fix - Add validation:

   ```[language]
   const schema = {
     email: z.string().email(),
     age: z.number().min(0).max(120),
     username: z.string().regex(/^[a-zA-Z0-9_]+$/)
   };

   const validated = schema.parse(userInput);
   ```

5. AUTHENTICATION/AUTHORIZATION ISSUES:
   Location: [file:line]
   Problem: [no auth check / weak password policy / session fixation]
   Impact: [unauthorized access]

   Severity: 🔴 CRITICAL / 🟠 HIGH

   Fix: [specific code]

6. SENSITIVE DATA EXPOSURE:
   Location: [file:line]
   Data exposed: [password / SSN / credit card / token]
   How: [logs / error messages / API response]

   Severity: 🔴 CRITICAL

   Fix:

   ```[language]
   // Don't log sensitive fields
   const sanitized = { ...user };
   delete sanitized.password;
   delete sanitized.ssn;
   logger.info('User created:', sanitized);
   ```

7. INSECURE DEPENDENCIES:
   Package: [package name]
   Version: [current]
   Vulnerability: [CVE number or description]

   Severity: [based on CVSS score]

   Fix:

   ```bash
   npm update [package] --save
   # or
   npm install [package]@[safe version]
   ```

8. MISSING CSRF PROTECTION:
   Route: [endpoint]
   Method: POST/PUT/DELETE
   Risk: Cross-site request forgery

   Severity: 🟠 HIGH

   Fix: [add CSRF token / SameSite cookie / etc]

9. CORS MISCONFIGURATION:
   Current: `Access-Control-Allow-Origin: *`
   Problem: Allows any origin

   Severity: 🟡 MEDIUM

   Fix:

   ```[language]
   cors({
     origin: process.env.ALLOWED_ORIGINS.split(','),
     credentials: true
   })
   ```

10. TIMING ATTACKS:
    Location: [file:line - password comparison]
    Problem: Using `===` for password compare
    Risk: Attacker can time responses to guess password

    Severity: 🟡 MEDIUM

    Fix:

    ```[language]
    const crypto = require('crypto');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(inputPassword),
      Buffer.from(hashedPassword)
    );
    ```

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━
Total vulnerabilities: [X]
🔴 Critical: [X] - FIX NOW
🟠 High: [X] - FIX BEFORE DEPLOY
🟡 Medium: [X] - FIX THIS WEEK
🔵 Low: [X] - FIX WHEN CONVENIENT
━━━━━━━━━━━━━━━━━━━━━━━━

COMMIT DECISION:
⛔ DO NOT COMMIT if any Critical vulnerabilities
⚠️ OK to commit but FIX BEFORE DEPLOY if High
✅ Safe to commit if only Medium/Low

```

**Example Usage:**
```

Perform a security audit of this code. Find vulnerabilities and provide fixes:
[run on any code that handles user input, auth, or sensitive data]

```

---

## 🔴 SECTION 4: WHEN THINGS BREAK

Your code is slow, buggy, or not working. These prompts help you debug.

---

### Prompt #4: Performance Bottleneck Analysis
**File:** `prompt-performance-bottleneck.md`

🎯 **When to use:**
- Page/app is loading slowly
- API response is taking too long
- Users complaining about lag
- High CPU/memory usage

📥 **What you'll get:**
- Specific slow operations identified
- Expected performance gain from fixes
- Optimized code examples

⚡ **The Prompt:**
```

Analyze this code for performance bottlenecks and provide optimizations:

1. NESTED LOOPS (O(n²) or worse):
   Location: [file:line]
   Current code:

   ```[language]
   [show nested loop]
   ```

   Complexity: O([n², n³, etc])
   Data size: [typical array size]
   Estimated time: [X ms/seconds]

   Severity: 🔴 HIGH (if n > 1000) / 🟡 MEDIUM (if n < 1000)

   Optimization:

   ```[language]
   // Use Map/Set for O(n) lookup instead of nested loop
   [show optimized code]
   ```

   New complexity: O(n)
   Expected speedup: [Xx faster]

2. DATABASE N+1 QUERIES:
   Location: [file:line]
   Problem:

   ```[language]
   // Loading users
   for (const user of users) {
     user.posts = await db.query('SELECT * FROM posts WHERE user_id = ?', user.id);
     // ^ This runs 1 query PER USER
   }
   ```

   Impact: If 100 users → 101 queries (1 for users + 100 for posts)

   Severity: 🔴 CRITICAL (if common query) / 🟠 HIGH

   Optimization:

   ```[language]
   // Single query with JOIN
   const usersWithPosts = await db.query(`
     SELECT u.*, p.*
     FROM users u
     LEFT JOIN posts p ON p.user_id = u.id
   `);
   // Or use eager loading in ORM
   ```

   Expected speedup: [Xx faster, Y fewer queries]

3. UNNECESSARY RE-RENDERS (React/Vue):
   Component: [ComponentName]
   Problem: Re-renders [X] times on each user action
   Cause: [props/state changing / missing memoization / etc]

   Current:

   ```jsx
   function Component({ items }) {
     const sorted = items.sort(); // Runs on every render!
     return <List items={sorted} />;
   }
   ```

   Severity: 🟡 MEDIUM

   Optimization:

   ```jsx
   function Component({ items }) {
     const sorted = useMemo(() => items.sort(), [items]);
     return <List items={sorted} />;
   }
   ```

4. MEMORY LEAKS:
   Location: [file:line]
   Leak type: [Event listener / Timer / Subscription]

   Problem:

   ```[language]
   useEffect(() => {
     window.addEventListener('scroll', handleScroll);
     // No cleanup! Listener stays forever
   }, []);
   ```

   Severity: 🔴 HIGH

   Fix:

   ```[language]
   useEffect(() => {
     window.addEventListener('scroll', handleScroll);
     return () => {
       window.removeEventListener('scroll', handleScroll);
     };
   }, []);
   ```

5. BLOCKING OPERATIONS:
   Location: [file:line]
   Operation: [synchronous file read / heavy computation / etc]
   Blocks UI for: [X ms]

   Problem:

   ```[language]
   const data = fs.readFileSync('large-file.json'); // Blocks!
   ```

   Severity: 🟠 HIGH

   Fix:

   ```[language]
   const data = await fs.promises.readFile('large-file.json');
   // Or use worker thread for heavy computation
   ```

6. LARGE DATA LOADED UNNECESSARILY:
   Location: [file:line]
   Data: [describe - e.g., "all user records"]
   Size: [X MB / Y records]
   Actually needed: [small subset]

   Problem:

   ```[language]
   const allUsers = await db.query('SELECT * FROM users');
   // Then filter in JavaScript
   const activeUsers = allUsers.filter(u => u.active);
   ```

   Severity: 🟠 HIGH

   Fix:

   ```[language]
   const activeUsers = await db.query(
     'SELECT * FROM users WHERE active = true'
   );
   ```

7. MISSING INDEXES:
   Query: [show query]
   Table: [table name]
   Filter on: [column]
   Index exists: ❌ NO

   Impact: Full table scan on [X] rows
   Query time: [Y ms]

   Severity: 🔴 CRITICAL (if > 10k rows)

   Fix:

   ```sql
   CREATE INDEX idx_users_email ON users(email);
   ```

   Expected speedup: [Xms → Yms]

8. INEFFICIENT RENDERING:
   Component: [name]
   Issue: Rendering [large list / complex SVG / heavy calculation]

   Optimizations:
   - Use virtualization for lists (react-window)
   - Lazy load offscreen content
   - Memoize expensive calculations

   Code: [show implementation]

PERFORMANCE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current issues found: [X]
🔴 Critical (>1s delay): [X]
🟠 High (>100ms delay): [X]
🟡 Medium (<100ms delay): [X]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPECTED IMPROVEMENTS:
Current total time: [X ms/seconds]
After optimizations: [Y ms/seconds]
Speedup: [Zx faster]

PRIORITY ORDER:

1. [Fix #1] - Biggest impact (saves X ms)
2. [Fix #2] - Second biggest (saves Y ms)
3. [Fix #3] - Easiest fix (5 min effort)

```

**Example Usage:**
```

Analyze this code for performance bottlenecks and provide optimizations:
[paste slow code or run on slow file]

```

---

### Prompt #30: Debug Helper
**File:** `prompt-debug-helper.md`

🎯 **When to use:**
- Something's broken and you don't know why
- Getting an error you don't understand
- Code used to work, now it doesn't

📥 **What you'll get:**
- Step-by-step debugging plan
- Likely causes identified
- Console.log strategies

⚡ **The Prompt:**
```

Help me debug this issue:

PROBLEM DESCRIPTION:
[Describe what's broken - be specific]

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What's actually happening]

ERROR MESSAGE (if any):

```
[paste full error message and stack trace]
```

RELEVANT CODE:

```[language]
[paste the code that's not working]
```

NOW HELP ME DEBUG:

1. INITIAL DIAGNOSIS:
   Most likely cause: [hypothesis]
   Why: [reasoning]
   Confidence: [High/Medium/Low]

2. DEBUGGING STRATEGY:
   Step 1: Check [specific thing]
   How: [exact console.log or breakpoint to add]
   What to look for: [expected vs actual values]

   Step 2: Verify [another thing]
   How: [debugging technique]
   What to look for: [indicators of problem]

   Step 3: Test [hypothesis]
   How: [test to run]
   Expected result if correct: [describe]
   Expected result if wrong: [describe]

3. CONSOLE.LOG STRATEGY:
   Add these console.logs in this order:

   ```[language]
   console.log('🔍 Step 1: Input received:', input);
   console.log('🔍 Step 2: After processing:', processed);
   console.log('🔍 Step 3: Before API call:', payload);
   console.log('🔍 Step 4: API response:', response);
   console.log('🔍 Step 5: Final result:', result);
   ```

   Look for:
   - Where does the value become wrong?
   - Is it undefined when it should have a value?
   - Is it null when checking for it?
   - Is the type wrong? (string vs number, etc)

4. COMMON CAUSES FOR THIS TYPE OF ERROR:
   Cause 1: [common mistake]
   Check: [what to verify]

   Cause 2: [another common mistake]
   Check: [what to verify]

   Cause 3: [third common mistake]
   Check: [what to verify]

5. POTENTIAL FIXES:

   Fix Option A: [most likely]

   ```[language]
   [show code change]
   ```

   When this works: [scenario]

   Fix Option B: [alternative]

   ```[language]
   [show code change]
   ```

   When this works: [scenario]

6. IF STILL BROKEN:
   Try these advanced debugging steps:
   - [Step 1]
   - [Step 2]
   - [Step 3]

   Questions to ask:
   - Does it fail consistently or intermittently?
   - Does it work in dev but not prod?
   - Did anything change recently?

7. MINIMAL REPRODUCTION:
   Create this simple test case:

   ```[language]
   [minimal code that reproduces the issue]
   ```

   Run it in isolation.
   If it works → problem is elsewhere
   If it fails → problem is in this code

```

**Example Usage:**
```

Help me debug this issue:

PROBLEM DESCRIPTION:
User login is failing with "Invalid credentials" even though password is correct

EXPECTED BEHAVIOR:
User should log in successfully

ACTUAL BEHAVIOR:
Always gets "Invalid credentials" error

ERROR MESSAGE:
Error: Invalid credentials at validatePassword (auth.js:42)

RELEVANT CODE:
[paste code]

```

---

### Prompt #31: "Why is this slow?" Analyzer
**File:** `prompt-why-slow.md`

🎯 **When to use:**
- Specific operation is taking too long
- You want to understand WHERE time is spent
- Profiler shows hot spots but you don't know why

📥 **What you'll get:**
- Time breakdown (what's taking the longest)
- Optimization suggestions
- Expected performance after fixes

⚡ **The Prompt:**
```

This operation is slow. Help me understand why and how to fix it:

SLOW OPERATION:
[Describe what's slow - e.g., "Loading user dashboard takes 5 seconds"]

CURRENT PERFORMANCE:
Time taken: [X seconds/ms]
Acceptable time: [Y seconds/ms]

CODE INVOLVED:

```[language]
[paste the code path from start to finish]
```

ANALYZE:

1. TIME BREAKDOWN:
   Estimate time spent in each part:

   Step 1: [Description]
   Estimated time: [X ms]
   % of total: [Y%]

   Step 2: [Description]
   Estimated time: [X ms]
   % of total: [Y%]

   [Continue for all steps]

   BOTTLENECK: [which step is slowest]

2. ROOT CAUSE ANALYSIS:
   The bottleneck is slow because:
   - [Reason 1 - e.g., "Fetching data from slow API"]
   - [Reason 2 - e.g., "Processing 10,000 records in memory"]
   - [Reason 3 - e.g., "No caching, always fresh data"]

3. OPTIMIZATION STRATEGY:

   Quick Win #1: [easiest fix]

   ```[language]
   [show code change]
   ```

   Expected improvement: [X ms faster]
   Effort: [Low/Medium/High]

   Quick Win #2: [second easiest]

   ```[language]
   [show code change]
   ```

   Expected improvement: [Y ms faster]
   Effort: [Low/Medium/High]

   Bigger Change: [more involved fix]

   ```[language]
   [show code change]
   ```

   Expected improvement: [Z ms faster]
   Effort: [Medium/High]

4. TOTAL EXPECTED IMPROVEMENT:
   Current: [X ms]
   After quick wins: [Y ms] (Z% faster)
   After all changes: [W ms] (Q% faster)
5. ALTERNATIVE APPROACHES:
   Instead of optimizing current approach, consider:

   Approach A: [different strategy]
   Pros: [list]
   Cons: [list]
   Estimated time: [X ms]

   Approach B: [another strategy]
   Pros: [list]
   Cons: [list]
   Estimated time: [Y ms]

6. MONITORING:
   Add performance logging:

   ```[language]
   console.time('operation-name');
   // ... code ...
   console.timeEnd('operation-name');

   // Or more detailed:
   const start = performance.now();
   // ... code ...
   const duration = performance.now() - start;
   console.log(`Operation took ${duration}ms`);
   ```

```

**Example Usage:**
```

This operation is slow. Help me understand why and how to fix it:

SLOW OPERATION:
Generating report takes 8 seconds

CURRENT PERFORMANCE:
Time taken: 8000ms
Acceptable time: <1000ms

CODE INVOLVED:
[paste code]

```

---

## 🟣 SECTION 5: WEEKLY/MONTHLY MAINTENANCE

These are deeper dives you do periodically, not on every commit.

---

### Prompt #15: Dependency Audit
**File:** `prompt-dependency-audit.md`

🎯 **When to use:**
- Every Monday morning (weekly routine)
- Before deploying to production
- After npm/pip/composer updates

📥 **What you'll get:**
- Unused dependencies to remove
- Outdated packages to update
- Security vulnerabilities

⚡ **The Prompt:**
```

Analyze package.json (or requirements.txt / composer.json) dependencies:

1. UNUSED DEPENDENCIES:
   Check each dependency to see if it's actually imported/used

   Package: [package-name]
   Version: [current version]
   Used in files: ❌ NEVER IMPORTED
   Safe to remove: ✅ YES

   Removal command:

   ```bash
   npm uninstall [package-name]
   ```

2. OUTDATED DEPENDENCIES:
   For each package, check latest version

   Package: [package-name]
   Current: [version]
   Latest: [latest version]
   Type of change: [major / minor / patch]
   Breaking changes: [Yes/No - describe if yes]

   Update strategy:
   - Patch updates (1.2.3 → 1.2.4): ✅ Safe to update immediately
   - Minor updates (1.2.0 → 1.3.0): ⚠️ Review changelog, likely safe
   - Major updates (1.0.0 → 2.0.0): ❌ Breaking changes - test carefully

   Update command:

   ```bash
   npm update [package-name]
   # or for major updates
   npm install [package-name]@latest
   ```

3. SECURITY VULNERABILITIES:
   Run: `npm audit` or equivalent

   Vulnerability: [CVE number]
   Package: [affected package]
   Severity: [Critical/High/Medium/Low]
   Description: [what's vulnerable]
   Fixed in: [version]

   Fix command:

   ```bash
   npm audit fix
   # or manually
   npm install [package]@[safe-version]
   ```

4. DUPLICATE DEPENDENCIES:
   Check for same functionality from multiple packages

   Duplication detected:
   - [package-1] and [package-2] both do [same thing]
   - Recommendation: Keep [package-1], remove [package-2]
   - Reason: [lighter / better maintained / more features]

5. DEV VS PRODUCTION SEPARATION:
   Packages in dependencies that should be in devDependencies:

   Package: [package-name]
   Current: dependencies
   Should be: devDependencies
   Reason: [only used in dev/testing, not in production code]

   Fix:

   ```bash
   npm uninstall [package-name]
   npm install --save-dev [package-name]
   ```

6. BUNDLE SIZE IMPACT:
   Heavy packages that could be replaced with lighter alternatives:

   Package: [heavy-package]
   Size: [X MB]
   Usage: [how it's used]
   Alternative: [lighter-alternative]
   Alternative size: [Y MB]
   Savings: [X-Y MB]

   Migration effort: [Low/Medium/High]

7. DEPRECATED PACKAGES:
   Packages no longer maintained:

   Package: [deprecated-package]
   Status: [deprecated / unmaintained / archived]
   Last update: [date]
   Recommended replacement: [alternative-package]
   Migration guide: [link or steps]

8. LICENSE COMPLIANCE:
   Check licenses for compatibility with your project:

   Package: [package-name]
   License: [license type]
   Compatible: [✅ Yes / ❌ No]
   Issue: [if incompatible, describe concern]

SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total dependencies: [X]
Unused: [X] - Remove these
Outdated: [X] - Update these
Vulnerable: [X] - Fix these immediately
Can optimize: [X] - Replace with lighter alternatives
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTION PLAN:

1. Fix security vulnerabilities (NOW)

   ```bash
   npm audit fix
   ```

2. Remove unused dependencies (5 min)

   ```bash
   npm uninstall [package1] [package2] [package3]
   ```

3. Update safe packages (10 min)

   ```bash
   npm update
   ```

4. Review major updates (test required)
   [list packages needing careful testing]

5. Consider replacements (future work)
   [list heavy packages to eventually replace]

```

**Example Usage:**
```

Analyze package.json dependencies:
[Cursor will read your package.json automatically]

```

---

### Prompt #19: Architecture Consistency Check
**File:** `prompt-architecture-check.md`

🎯 **When to use:**
- Monthly architectural review
- Before major refactoring
- When codebase feels messy/disorganized

📥 **What you'll get:**
- Architectural violations identified
- Suggested restructuring
- Migration plan

⚡ **The Prompt:**
```

Evaluate architectural consistency and suggest improvements:

1. FOLDER STRUCTURE ANALYSIS:
   Current structure:
   [show directory tree]

   Issues found:
   - [File X] is in wrong folder
     Current: `/components/utils/BusinessLogic.js`
     Should be: `/business-logic/...` or `/services/...`
     Reason: Utils should be generic, this is domain-specific
   - [Files Y, Z] should be grouped
     Current: Scattered across folders
     Should be: `/features/user-management/` (group by feature)

   Recommended structure:

   ```
   src/
   ├── features/           # Group by feature, not by type
   │   ├── auth/
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── services/
   │   │   └── tests/
   │   └── dashboard/
   ├── shared/             # Truly reusable code
   │   ├── components/
   │   └── utils/
   └── core/               # App-wide concerns
       ├── api/
       └── config/
   ```

2. SEPARATION OF CONCERNS:
   Violations found:

   File: [ComponentName.jsx]
   Problem: UI component contains business logic
   Specifically:

   ```jsx
   // BAD: Business logic in component
   function UserProfile() {
     const calculateUserTier = points => {
       if (points > 1000) return 'gold';
       // ...
     };
     // ...
   }
   ```

   Fix: Extract to service/hook

   ```jsx
   // GOOD: Separate concerns
   function UserProfile() {
     const tier = useUserTier(user.points);
     // Component only handles UI
   }

   // services/userTier.js
   export function calculateUserTier(points) {
     // Business logic here
   }
   ```

3. CIRCULAR DEPENDENCIES:
   Detected cycles:

   Cycle 1:
   `ModuleA.js` imports `ModuleB.js`
   `ModuleB.js` imports `ModuleC.js`
   `ModuleC.js` imports `ModuleA.js` ← CIRCULAR!

   Impact: [bundling issues / hard to test / coupling]

   Fix strategy:
   - Extract shared code to `ModuleD.js`
   - Both A, B, C import from D (no cycle)

4. COMPONENT/MODULE SIZE:
   Oversized files:

   File: [ComponentName]
   Lines: [X] (target: <300)
   Methods: [Y] (target: <10)

   Suggested split:
   - Extract: [SubComponent1] (lines 50-150)
   - Extract: [SubComponent2] (lines 160-250)
   - Extract: [HelperFunctions] to utils (lines 300-400)

5. DATA FLOW CLARITY:
   Current data flow:
   [diagram of how data moves]

   Issues:
   - [Component] fetches data directly (should use hook/service)
   - [Component] mutates props (should use state management)
   - Global state used for local concerns

   Recommended:

   ```
   API → Service → Hook → Component
         ↓
       Cache (if needed)
   ```

6. INCONSISTENT PATTERNS:
   Pattern confusion:

   API Calls:
   - `/features/auth/` uses axios directly
   - `/features/dashboard/` uses custom apiClient
   - `/features/settings/` uses fetch

   Standardize to: [chosen approach]
   Migration: [step-by-step plan]

   State Management:
   - Some components use useState
   - Some use Context
   - Some use Redux

   When to use what: [decision guide]

7. MISSING ABSTRACTIONS:
   Repeated code that should be abstracted:

   Pattern: [describe repeated pattern]
   Found in: [list 5+ files]

   Abstraction:

   ```[language]
   // Create shared function/component/hook
   [show implementation]
   ```

   Update all files to use it

8. LAYERING VIOLATIONS:
   Architectural layers:

   ```
   Presentation (UI)
        ↓
   Application (Business Logic)
        ↓
   Domain (Core Models)
        ↓
   Infrastructure (API, DB)
   ```

   Violations:
   - [UI component] directly calls [Database]
   - [Business logic] imports [React components]

   Fix: Respect layer boundaries

ARCHITECTURE SCORE:
━━━━━━━━━━━━━━━━━━━━━━
Folder structure: [X/10]
Separation of concerns: [X/10]
No circular deps: [X/10]
Module size: [X/10]
Data flow: [X/10]
Consistency: [X/10]
━━━━━━━━━━━━━━━━━━━━━━
Overall: [X/60]
━━━━━━━━━━━━━━━━━━━━━━

REFACTORING PLAN:
Phase 1 (This week): [easiest fixes]
Phase 2 (This month): [medium complexity]
Phase 3 (Next quarter): [major restructure]

```

**Example Usage:**
```

Evaluate architectural consistency and suggest improvements:
[run on @workspace to analyze entire codebase]

```

---

### Prompt #32: Technical Debt Inventory
**File:** `prompt-tech-debt.md`

🎯 **When to use:**
- Monthly sprint planning
- Before deciding what to refactor
- When prioritizing cleanup work

📥 **What you'll get:**
- Complete list of tech debt
- Severity and effort estimates
- ROI for fixing each item

⚡ **The Prompt:**
```

Create a comprehensive technical debt inventory:

Scan the codebase for:

1. TODO/FIXME COMMENTS:
   Location: [file:line]
   Comment: "[full text of TODO]"
   Age: [how long it's been there - check git blame]
   Impact: [High/Medium/Low]
   Effort: [Hours to fix]
   Priority: [Urgent/Soon/Eventually]

2. DEPRECATED API USAGE:
   Code: [show code using deprecated API]
   Location: [file:line]
   What's deprecated: [specific API/method]
   Why deprecated: [reason]
   Modern alternative: [show replacement]
   Migration effort: [X hours]
   Risk if not fixed: [library stops working]

3. WORKAROUNDS/HACKS:
   Location: [file:line]
   Code:

   ```[language]
   // HACK: This is a temporary fix for...
   [show hacky code]
   ```

   Problem it works around: [original issue]
   Proper fix would be: [describe]
   Why not fixed yet: [reason]
   Effort to fix properly: [X hours]

4. HARDCODED VALUES:
   Location: [file:line]
   Value: [hardcoded value]
   Should be: [config var / constant / database value]
   Impact: [makes changes hard / environment-specific / etc]
   Effort: [30 min]

5. COPY-PASTED CODE:
   Duplicate code found:
   - Original: [file:line]
   - Copy 1: [file:line]
   - Copy 2: [file:line]
   - [x] total copies

   Refactor to: [shared function/component]
   Effort: [1-2 hours]
   Benefit: [easier to maintain / fewer bugs]

6. MISSING ERROR HANDLING:
   [Already covered in Prompt #9, reference it]

7. MISSING TESTS:
   [Already covered in Prompt #11, reference it]

8. OUTDATED DEPENDENCIES:
   [Already covered in Prompt #15, reference it]

9. INCONSISTENT NAMING:
   [Already covered in Prompt #3, reference it]

10. PERFORMANCE ISSUES:
    [Already covered in Prompt #4, reference it]

11. COMMENTED OUT CODE:
    Location: [file:lines]
    Size: [X lines]
    Age: [date last active - git blame]
    Reason commented: [if documented]
    Action: Delete (if >3 months old)

12. UNUSED FEATURES:
    Feature: [name]
    Code location: [files]
    Last used: [date if trackable]
    Analytics: [usage data]
    Recommendation: [Remove / Keep / Simplify]
    Effort to remove: [X hours]

DEBT SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━
Total debt items: [X]
By severity:
🔴 Critical: [X]
🟠 High: [X]
🟡 Medium: [X]
🔵 Low: [X]

By effort:
⚡ Quick (<1 hr): [X]
🔨 Medium (1-4 hrs): [X]
🏗️ Large (>4 hrs): [X]
━━━━━━━━━━━━━━━━━━━━━━━━

PRIORITIZATION MATRIX:
High Impact + Low Effort:

1. [Debt item] - 30 min effort, fixes critical bug
2. [Debt item] - 1 hr effort, improves performance 50%

High Impact + High Effort:

1. [Debt item] - 8 hrs effort, eliminates whole class of bugs
   (Schedule for next sprint)

Low Impact + Low Effort:

1. [Debt item] - 20 min effort, clean code
   (Do when you have spare time)

Low Impact + High Effort:

1. [Debt item] - 6 hrs effort, marginal benefit
   (Probably skip)

RECOMMENDED CLEANUP SPRINTS:
Week 1: Focus on [theme - e.g., "Error handling"]

- [Item 1] - 2 hrs
- [Item 2] - 3 hrs
- [Item 3] - 1 hr
  Total: 6 hrs

Week 2: Focus on [theme - e.g., "Performance"]

- [Item 4] - 4 hrs
- [Item 5] - 2 hrs
  Total: 6 hrs

ROI CALCULATION:
If we fix top 5 items:

- Time saved per week: [X hours]
- Bugs prevented: [Y estimated]
- Performance improvement: [Z%]
- Developer happiness: [improved morale]

```

**Example Usage:**
```

Create a comprehensive technical debt inventory:
[run on @workspace for full codebase audit]

```

---

## 🟠 SECTION 6: SPECIALIZED PROMPTS

These are for specific technologies or scenarios.

---

### Prompt #23: React Performance Audit
**File:** `prompt-react-performance.md`

🎯 **When to use:**
- React app feels sluggish
- Components re-rendering too much
- DevTools shows performance warnings

📥 **What you'll get:**
- Specific React optimizations
- useMemo/useCallback opportunities
- Component splitting suggestions

⚡ **The Prompt:**
```

Optimize this React code for performance:

1. UNNECESSARY RE-RENDERS:
   Component: [ComponentName]
   Re-renders: [X] times per user action

   Cause analysis:
   - Props changing: [which props, why]
   - State changing: [which state, why]
   - Parent re-rendering: [yes/no]
   - Context changing: [which context]

   Fix:

   ```jsx
   // Before
   function Component({ items }) {
     return <List items={items} />;
   }

   // After
   const Component = memo(
     function Component({ items }) {
       return <List items={items} />;
     },
     (prevProps, nextProps) => {
       // Custom comparison
       return prevProps.items.length === nextProps.items.length;
     }
   );
   ```

2. MISSING MEMOIZATION:
   Location: [Component]

   Expensive calculation running on every render:

   ```jsx
   function Component({ items }) {
     const sorted = items.sort(); // Runs every render!
     const filtered = sorted.filter(x => x.active); // Runs every render!
     return <List items={filtered} />;
   }
   ```

   Fix with useMemo:

   ```jsx
   function Component({ items }) {
     const filtered = useMemo(() => {
       return items.sort().filter(x => x.active);
     }, [items]); // Only recalculate when items change

     return <List items={filtered} />;
   }
   ```

3. MISSING useCallback:
   Component: [Parent]
   Problem: Passing new function to child on every render

   ```jsx
   // Bad
   function Parent() {
     const handleClick = () => console.log('clicked');
     return <Child onClick={handleClick} />; // New function every render
   }

   // Good
   function Parent() {
     const handleClick = useCallback(() => {
       console.log('clicked');
     }, []); // Same function reference
     return <Child onClick={handleClick} />;
   }
   ```

4. COMPONENT TOO LARGE - SHOULD SPLIT:
   Component: [ComponentName]
   Lines: [X]
   Renders: [Y elements]

   Split into:

   ```jsx
   function LargeComponent() {
     return (
       <>
         <Header /> {/* Extract this */}
         <MainContent /> {/* Extract this */}
         <Sidebar /> {/* Extract this */}
         <Footer /> {/* Extract this */}
       </>
     );
   }
   ```

   Benefit: Each section can re-render independently

5. PROPS DRILLING - USE CONTEXT:
   Data: [data being drilled]
   Depth: [X components deep]

   Current (props drilling):

   ```jsx
   <GrandParent user={user}>
     <Parent user={user}>
       <Child user={user}>
         <GrandChild user={user} /> {/* Finally uses it */}
       </Child>
     </Parent>
   </GrandParent>
   ```

   Better (Context):

   ```jsx
   const UserContext = createContext();

   function GrandParent() {
     const [user] = useState(...);
     return (
       <UserContext.Provider value={user}>
         <Parent />
       </UserContext.Provider>
     );
   }

   function GrandChild() {
     const user = useContext(UserContext); // Direct access
   }
   ```

6. CONTROLLED VS UNCONTROLLED:
   Component: [FormComponent]
   Issue: Re-renders on every keystroke

   If you don't need real-time value:

   ```jsx
   // Instead of controlled:
   const [value, setValue] = useState('');
   <input value={value} onChange={e => setValue(e.target.value)} />;

   // Use uncontrolled:
   const inputRef = useRef();
   <input ref={inputRef} defaultValue="" />;
   // Get value on submit: inputRef.current.value
   ```

7. KEY PROP ISSUES IN LISTS:
   Component: [ListComponent]
   Problem: Using index as key

   ```jsx
   // Bad
   {
     items.map((item, index) => (
       <Item key={index} {...item} /> // Index as key is bad!
     ));
   }

   // Good
   {
     items.map(item => (
       <Item key={item.id} {...item} /> // Stable unique ID
     ));
   }
   ```

   Why: Index as key causes React to re-render unnecessarily

8. LAZY LOADING OPPORTUNITIES:
   Components that could be lazy loaded:

   ```jsx
   // Instead of
   import HeavyComponent from './HeavyComponent';

   // Use lazy loading
   const HeavyComponent = lazy(() => import('./HeavyComponent'));

   function App() {
     return (
       <Suspense fallback={<Loading />}>
         <HeavyComponent />
       </Suspense>
     );
   }
   ```

OPTIMIZATION SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━
Components analyzed: [X]
Re-render issues: [X]
Memoization opportunities: [X]
Should split: [X]
Should lazy load: [X]
━━━━━━━━━━━━━━━━━━━━━━

EXPECTED IMPROVEMENT:
Current render count: [X]
After optimizations: [Y]
Reduction: [Z%]

```

**Example Usage:**
```

Optimize this React code for performance:
[paste component or run on React files]

```

---

### Prompt #5: Database Query Optimization
**File:** `prompt-database-optimization.md`

🎯 **When to use:**
- Database queries are slow
- High database CPU usage
- Users experiencing lag

📥 **What you'll get:**
- Optimized queries
- Index recommendations
- Query plan analysis

⚡ **The Prompt:**
```

Review and optimize database queries:

1. QUERY ANALYSIS:
   Original query:

   ```sql
   [paste query]
   ```

   Issues:
   - SELECT \*: Fetching [X] unnecessary columns
   - Missing WHERE clause: Scanning [Y] rows
   - Missing INDEX: Full table scan
   - JOIN without index: Cartesian product

   Estimated time: [X ms]
   Rows scanned: [Y]
   Rows returned: [Z]

   Optimized query:

   ```sql
   [show optimized version]
   ```

   Improvements:
   - Specific columns: Only fetch what's needed
   - WHERE clause: Filter early
   - Proper JOINs: Use indexed columns

   Estimated time: [X ms] → [Y ms] (Z% faster)

2. N+1 QUERY PROBLEM:
   Code:

   ```[language]
   [show code causing N+1]
   ```

   Current: [X] queries for [Y] items

   Solution - Use JOIN or eager loading:

   ```[language]
   [show fixed code]
   ```

   New: [1] query for [Y] items
   Improvement: [X]x fewer queries

3. MISSING INDEXES:
   Table: [table_name]
   Query filters on: [column]
   Index exists: ❌ NO

   Impact:
   - Full table scan
   - Rows scanned: [X]
   - Time: [Y ms]

   Recommended index:

   ```sql
   CREATE INDEX idx_[table]_[column]
   ON [table]([column]);
   ```

   Expected improvement: [X ms] → [Y ms]

4. INEFFICIENT JOINS:
   Current:

   ```sql
   SELECT *
   FROM users u
   LEFT JOIN posts p ON u.id = p.user_id
   WHERE p.published = true;
   ```

   Problem: LEFT JOIN then filter = inefficient

   Better:

   ```sql
   SELECT u.*, p.*
   FROM users u
   INNER JOIN posts p ON u.id = p.user_id AND p.published = true;
   ```

   Or even better - filter published posts first:

   ```sql
   WITH published_posts AS (
     SELECT * FROM posts WHERE published = true
   )
   SELECT u.*, pp.*
   FROM users u
   INNER JOIN published_posts pp ON u.id = pp.user_id;
   ```

5. SELECT _ ISSUES:
   Query: `SELECT _ FROM users`
   Columns in table: [X]
   Actually needed: [Y columns]

   Wasted bandwidth: [Z KB per row]

   Fix:

   ```sql
   SELECT id, name, email FROM users;
   ```

6. MISSING PAGINATION:
   Query: `SELECT * FROM large_table`
   Rows: [100,000+]

   Problem: Loading all data at once

   Add pagination:

   ```sql
   SELECT * FROM large_table
   LIMIT 50 OFFSET 0;
   ```

   Or cursor-based:

   ```sql
   SELECT * FROM large_table
   WHERE id > :last_id
   ORDER BY id
   LIMIT 50;
   ```

7. CACHING OPPORTUNITIES:
   Query:

   ```sql
   [frequently run query that rarely changes]
   ```

   Execution frequency: [X] times/minute
   Data changes: [Y] times/day

   Cache strategy:
   - Cache for: [Z] minutes
   - Invalidate when: [condition]
   - Expected load reduction: [%]

8. QUERY PLAN ANALYSIS:
   Run EXPLAIN on query:

   ```sql
   EXPLAIN [query];
   ```

   Key indicators:
   - Seq Scan → Need index
   - High cost number → Needs optimization
   - Nested Loop → Consider hash join

   Interpretation: [explain what plan shows]

OPTIMIZATION SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━
Queries analyzed: [X]
N+1 problems: [X]
Missing indexes: [X]
Need pagination: [X]
Can cache: [X]
━━━━━━━━━━━━━━━━━━━━━━

MIGRATION PLAN:

1. Add indexes (low risk)

   ```sql
   [index creation statements]
   ```

2. Update queries (test in staging)

   ```sql
   [optimized queries]
   ```

3. Add caching (monitor cache hit rate)
   [caching strategy]

EXPECTED IMPROVEMENT:
Current avg query time: [X ms]
After optimization: [Y ms]
Reduction: [Z%]
Database CPU: -[%]

```

**Example Usage:**
```

Review and optimize database queries:
[paste slow SQL or ORM code]

```

---

## 🎁 BONUS: WORKFLOW OPTIMIZATION PROMPTS

These help you work smarter, not just write better code.

---

### Prompt #33: Code Review Checklist Generator
**File:** `prompt-code-review-checklist.md`

🎯 **When to use:**
- Reviewing someone else's PR
- Want to know what to look for in code review

📥 **What you'll get:**
- Customized checklist for this specific PR
- What to pay extra attention to

⚡ **The Prompt:**
```

Generate a code review checklist for this PR:

PR DESCRIPTION:
[paste PR description or summarize changes]

FILES CHANGED:
[list files or let Cursor detect]

GENERATE CHECKLIST:

1. FUNCTIONAL REVIEW:
   ☐ Does the code do what it claims?
   ☐ Are edge cases handled?
   ☐ Are error cases handled?
   ☐ Is the logic correct?

   Specific checks for this PR:
   ☐ [PR-specific check based on changes]
   ☐ [Another PR-specific check]

2. CODE QUALITY:
   ☐ Is code readable and well-named?
   ☐ Are functions appropriately sized?
   ☐ Is there unnecessary complexity?
   ☐ Are there code smells?

   Red flags to watch for:
   - [Based on PR, what could go wrong]

3. TESTING:
   ☐ Are new functions tested?
   ☐ Are edge cases tested?
   ☐ Do tests actually test the right thing?
   ☐ Is test coverage adequate?

4. SECURITY:
   ☐ Any user input validated?
   ☐ Any SQL injection risks?
   ☐ Any XSS risks?
   ☐ Secrets properly handled?

   Pay extra attention to:
   - [Based on PR changes]

5. PERFORMANCE:
   ☐ Any obvious performance issues?
   ☐ Database queries optimized?
   ☐ No N+1 query problems?
   ☐ Caching used where appropriate?

6. DOCUMENTATION:
   ☐ Complex code documented?
   ☐ Public APIs documented?
   ☐ README updated if needed?

7. BACKWARDS COMPATIBILITY:
   ☐ Are there breaking changes?
   ☐ Is migration path provided?
   ☐ Are deprecations documented?

RISK ASSESSMENT:
Based on changes, this PR is:
Risk level: [Low/Medium/High]
Reason: [explanation]

RECOMMENDATION:
✅ Approve if checklist passes
⚠️ Approve with comments if minor issues
❌ Request changes if critical issues

```

**Example Usage:**
```

Generate a code review checklist for this PR:

PR DESCRIPTION:
Add user authentication with JWT tokens

FILES CHANGED:
auth.js, middleware.js, user.model.js, auth.test.js

```

---

### Prompt #34: Refactoring Plan Generator
**File:** `prompt-refactoring-plan.md`

🎯 **When to use:**
- About to refactor complex code
- Want to break refactoring into safe steps

📥 **What you'll get:**
- Step-by-step refactoring plan
- Tests to write before refactoring
- Rollback strategy if something breaks

⚡ **The Prompt:**
```

Create a safe refactoring plan for this code:

CURRENT CODE:

```[language]
[paste code to refactor]
```

GOAL:
[What you want to achieve - e.g., "Extract business logic from component"]

GENERATE REFACTORING PLAN:

1. PRE-REFACTORING SETUP:

   a) Write characterization tests:

   ```[language]
   // Test current behavior BEFORE changing anything
   test('existing behavior - case 1', () => {
     // Document what it currently does
   });

   test('existing behavior - case 2', () => {
     // Document edge cases
   });
   ```

   Why: Safety net to ensure refactoring doesn't break anything

   b) Document current behavior:
   - Input: [what goes in]
   - Output: [what comes out]
   - Side effects: [what changes]

2. REFACTORING STEPS (in order):

   Step 1: [First safe change]

   ```[language]
   [show code change]
   ```

   Why this first: [reason]
   Tests to run: [which tests]
   Rollback if: [what indicates failure]
   Estimated time: [X min]

   Step 2: [Next safe change]

   ```[language]
   [show code change]
   ```

   Why this second: [builds on step 1]
   Tests to run: [which tests]
   Rollback if: [what indicates failure]
   Estimated time: [Y min]

   Step 3: [Continue...]

   [Continue for all steps]

3. POST-REFACTORING:

   a) Verify all tests pass
   b) Run performance comparison
   c) Update documentation
   d) Code review before merging

4. ROLLBACK STRATEGY:

   If something breaks:
   - Revert to commit: [hash]
   - Tests that would catch issue: [list]
   - Alternative approach if this fails: [describe]

5. RISK MITIGATION:

   Highest risks:
   - [Risk 1]: [how to mitigate]
   - [Risk 2]: [how to mitigate]

   Safe because:
   - Small steps
   - Tests at each step
   - Easy to rollback

REFACTORING CHECKLIST:
☐ Tests written for current behavior
☐ Step 1 completed and tested
☐ Step 2 completed and tested
☐ [...]
☐ All original tests still pass
☐ No new warnings/errors
☐ Performance unchanged (or better)
☐ Documentation updated
☐ Code reviewed

TIME ESTIMATE:
Total refactoring time: [X] hours
Broken down:

- Writing tests: [Y] hours
- Refactoring steps: [Z] hours
- Verification: [W] hours

```

**Example Usage:**
```

Create a safe refactoring plan for this code:

CURRENT CODE:
[paste messy code]

GOAL:
Extract authentication logic into separate service

```

---

## 📋 QUICK REFERENCE CARDS

### **Daily Prompts (Run These Every Day)**
```

Morning:

1. Prompt #1 (Dead Code) on today's files
2. Prompt #28 (Context Builder) for today's tasks

After Coding: 3. Prompt #3 (Naming Consistency) 4. Prompt #9 (Error Handling)

Before Commit: 5. Prompt #35 (Ultimate Combo)

```

---

### **Weekly Prompts (Run These Every Monday)**
```

1. Prompt #15 (Dependency Audit)
2. Prompt #7 (Security Scan)
3. Prompt #32 (Tech Debt Inventory)

```

---

### **When Something Breaks**
```

1. Prompt #30 (Debug Helper)
2. Prompt #31 (Why Is This Slow)
3. Prompt #4 (Performance Bottleneck)

```

---

### **Before Major Changes**
```

1. Prompt #27 (Dependency Mapper)
2. Prompt #34 (Refactoring Plan)
3. Prompt #29 (Task Breakdown)

````

---

## 🔧 CUSTOMIZATION GUIDE

### **Creating Your Own Prompts**

Use this template to create project-specific prompts:

```markdown
### Prompt #XX: [Name]
**File:** `prompt-[name].md`

🎯 **When to use:**
[Describe the scenario]

📥 **What you'll get:**
[Describe the output]

⚡ **The Prompt:**
````

[Your custom prompt text]

```

**Example Usage:**
```

[Show example]

```

```

---

## 📊 METRICS TO TRACK

Track these to see if prompts are helping:

```
Weekly:
- Time spent debugging: [before] vs [after]
- Bugs found in production: [before] vs [after]
- Code review comments: [before] vs [after]
- Time to commit: [before] vs [after]

Monthly:
- Tech debt items resolved: [X]
- Test coverage: [%]
- Performance improvements: [%]
- Security vulnerabilities: [X]
```

---

## 🎓 LEARNING PATH

**Week 1:** Start with these 3 prompts

- #1 (Dead Code)
- #9 (Error Handling)
- #13 (Documentation)

**Week 2:** Add these 3

- #3 (Naming)
- #7 (Security)
- #35 (Pre-Commit Combo)

**Week 3:** Add these 3

- #4 (Performance)
- #11 (Test Coverage)
- #30 (Debug Helper)

**Week 4:** Add weekly/monthly prompts

- #15 (Dependencies)
- #19 (Architecture)
- #32 (Tech Debt)

**Month 2+:** Customize and create your own!

---

## 💡 PRO TIPS

1. **Don't run all prompts all the time**
   - That's overwhelming and unnecessary
   - Pick prompts based on what you're doing

2. **Start small**
   - Master 3 prompts before adding more
   - Build habits gradually

3. **Customize for your project**
   - Modify prompts to match your stack
   - Add project-specific checks

4. **Create keyboard shortcuts**
   - Cursor allows custom shortcuts
   - Bind your most-used prompts

5. **Share with your team**
   - Create team-specific prompts
   - Standardize quality checks

6. **Track what works**
   - Note which prompts find the most issues
   - Double down on high-value prompts

---

## 🆘 TROUBLESHOOTING

**Q: Cursor isn't understanding my prompt**
A: Be more specific - reference file names, line numbers, exact functions

**Q: Output is too generic**
A: Provide more context - paste the actual code, not just descriptions

**Q: Prompt takes too long**
A: Run on specific files, not @workspace for everything

**Q: Getting different results each time**
A: AI is probabilistic - provide more constraints in prompt for consistency

---

## 📚 ADDITIONAL RESOURCES

**Cursor Documentation:**

- https://docs.cursor.sh

**Prompt Engineering:**

- https://www.promptingguide.ai

**Code Quality:**

- Clean Code by Robert C. Martin
- Refactoring by Martin Fowler

---

## ✅ FINAL CHECKLIST

Before you start using this library:

☐ Read the "How to Use This Guide" section
☐ Pick 3 prompts to start with
☐ Add them to your daily workflow
☐ Create reminder/checklist
☐ Track results for 1 week
☐ Adjust and add more prompts
☐ Share with team (if applicable)

---

**Remember:** These prompts are tools, not rules. Adapt them to your workflow, your stack, and your team's needs.

**The goal is not to use ALL prompts, but to use the RIGHT prompts at the RIGHT time.**

Happy coding! 🚀
