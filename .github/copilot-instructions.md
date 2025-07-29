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
- **Creating sub-components**: Use `src/components/ui/` for reusable UI elements, ensuring they are generic and not tied to specific game logic. If they're tied to a specific game feature, place them in the parent component's folder, inside a `components/` subfolder. .tsx`. They also need their own folder with an `index.ts` file for clean exports.

### Routing with TanStack Router

- **File-based routing**: Routes in `src/routes/` with automatic route tree generation
- **Route config**: `tsr.config.json` controls generation, outputs to `routeTree.gen.ts`
- **Root layout**: `__root.tsx` provides navigation and shared layout

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
