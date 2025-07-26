# Regexle - AI Coding Agent Instructions

## Project Overview

Regexle is a React/TypeScript regex puzzle game built with Vite, TanStack Router, Zustand state management, and Tailwind CSS. Players solve regex puzzles across difficulty levels (easy → nightmare) with gamification features like spin wheels.

## Architecture & Key Patterns

### State Management with Zustand

- **Store co-location**: Each store (`gameStore.ts`, `spinWheelStore.ts`) contains both state and actions in a single file
- **Direct consumption**: Components import and use stores directly via hooks (e.g., `useGameStore()`) without prop drilling
- **Inter-store communication**: Uses callback pattern for decoupled communication between stores

### Data Layer Architecture

- **Manifest-driven configuration**: Central JSON manifest indexes all data entries by category/difficulty
- **Dynamic loading**: Lazy loading with Vite dynamic imports for code splitting
- **Service layer**: Dedicated service files handle business logic and data orchestration
- **Engine layer**: Core validation and processing logic isolated in dedicated engine modules

### Component Architecture

- **Hierarchical organization**: Components organized by feature/page in nested folder structure
- **Index exports**: Every component folder includes `index.ts` for clean import paths
- **File co-location patterns**:
  - `ComponentName.tsx` - Main component implementation
  - `ComponentName.consts.ts` - Constants and configuration data
  - `ComponentName.hooks.ts` - Custom hooks specific to the component
  - `ComponentName.utils.ts` - Utility functions (when needed)
- **Sub-component grouping**: Complex features use `components/` subfolder for related components
- **Utility grouping**: Shared utilities organized in `utils/` subfolders with descriptive filenames
- **Three-tier structure**:
  - **Pages**: Top-level route components in `src/components/pages/`
  - **Feature components**: Page-specific components nested under parent page folders
  - **UI primitives**: Reusable components in `src/components/ui/`

### Routing with TanStack Router

- **File-based routing**: Routes in `src/routes/` with automatic route tree generation
- **Route config**: `tsr.config.json` controls generation, outputs to `routeTree.gen.ts`
- **Root layout**: `__root.tsx` provides navigation and shared layout

### Adding New Puzzles

#### Conceptualization

- **Puzzle theme**: Choose a fun and engaging theme that fits the difficulty level. It can be based on real-world applications, common regex patterns, or creative challenges.
- **Duplicate avoidance**: Ensure the new puzzle does not duplicate existing ones. Check the `manifest.json` for existing puzzle summaries, categories, and tags to identify similar themes or patterns.
- **Creative twist**: Feel free (not always) to add a unique element to the puzzle, such as a specific context or a playful narrative that makes it stand out.

#### Step-by-Step Process

1. **Create puzzle file**: Add JSON file in `src/data/puzzles/{difficulty}/` directory
2. **Update manifest**: Register puzzle metadata in `manifest.json`
3. **Validate**: Run puzzle validation report after changes

#### Required Schema Structure

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "difficulty": "easy|medium|hard|expert|nightmare",
  "testCases": [
    {
      "input": "string",
      "shouldMatch": "boolean"
    }
  ],
  "solution": "string",
  "solutionSummary": "string"
}
```

#### Test Case Requirements

- **Matching cases**: 4-6 test cases with `shouldMatch: true`
- **Non-matching cases**: 4-6 test cases with `shouldMatch: false`
- **Total count**: Must be even for balanced gameplay. The amount of matching and non-matching cases should be equal.
- **Coverage**: Include edge cases and common pitfalls
- **Clarity**: Should be solvable from viewing first pass/fail case

#### Content Guidelines

**Title**:

- Descriptive but mysterious/vague
- Should not reveal the solution

**Description**:

- Provides context for the puzzle
- Should describe the pattern required but not reveal the solution. Don't mention specific regex syntax or constructs.
- Please use clear and concise language, not overly technical

**Solution**:

- Valid regex pattern that passes ALL test cases
- Appropriate for the puzzle difficulty level
- Elegant and concise while remaining correct
- Contextually sensible for the puzzle description
- Not overfitted to test cases

**Solution Summary**:

- Educational explanation of regex concepts used
- Highlights main techniques and patterns
- Provides learning value for players

#### Validation

After making any changes to puzzles, run validation report to ensure all puzzles are valid and pass their test cases.

### Component Development Patterns

- **State consumption**: Import stores directly in components, no prop drilling
- **UI consistency**: Use `cn()` utility from `src/lib/utils.ts` for className merging
- **Path aliases**: `@/` maps to `src/` (configured in `vite.config.ts`)
- **Type safety**: Leverage TypeScript interfaces in `src/types/game.ts`

## Critical Integration Points

### Game Engine Integration

- `RegexGameEngine.testPattern()` is the core validation logic
- Returns `GameResult` with passed/failed test breakdown
- Components call `testPatternWithEffects()` from gameStore for UI updates

### Gamification Features

- **Spin wheel**: Triggered on test failures, provides hints/encouragement

### Data Flow

1. User enters regex → `updatePattern()` in gameStore
2. Test execution → `testPatternWithEffects()` → engine validation
3. Failure handling → spin wheel integration via callback system
4. Success → puzzle completion tracking in `completedPuzzles` Set

## Project-Specific Conventions

- **Difficulty progression**: easy → medium → hard → expert → nightmare
- **Component naming**: PascalCase with descriptive suffixes (Card, Input, Button)
- **Store actions**: Descriptive verb-noun patterns (`loadPuzzleByMode`, `testPatternWithEffects`)
- **File organization**: Feature-based grouping with consistent index exports
- **Import style**: Relative imports within features, absolute for cross-cutting concerns
