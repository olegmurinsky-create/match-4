---
project_name: 'match-4'
user_name: 'Oleg'
date: '2026-05-21'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 12
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **React**: ^18.2.0
- **TypeScript**: ^5.0.2 (strict mode enabled)
- **Vite**: ^4.4.5
- **Framer Motion**: ^10.18.0 (Crucial for game board animations)
- **Vitest**: ^0.34.6 (Used for business logic testing)

## Critical Implementation Rules

### Language & Framework Specific Rules

- **Immutable State Updates:** The game board (`Board` array of arrays) MUST be updated immutably (e.g., `board.map(row => [...row])`). Direct mutations will break React rendering.
- **Separation of Concerns:** Keep core game mechanics (matching, gravity) as pure TypeScript functions in `gameLogic.ts`. UI components should only handle rendering and orchestrating these functions.
- **Animation Orchestration:** When chaining game states for cascades, use explicit delays (e.g., `await new Promise(res => setTimeout(res, ms))`) within async functions in React components to allow Framer Motion animations to finish before the next state update.
- **TypeScript Strictness:** Always define interfaces for state objects (like `Position`, `Ball`). Avoid using `any`.

### Testing Rules

- **Focus on Business Logic:** Write comprehensive tests for `gameLogic.ts`. UI component testing is secondary to ensuring the core puzzle logic is flawless.
- **Framework:** Use `vitest`. Import `describe`, `it`, and `expect` directly from `vitest`.
- **Edge Case Coverage:** Always test board boundaries and non-matching states (e.g., lines of 3 balls).
- **Directional Testing:** Any match-finding logic MUST be tested against all possible line directions: horizontal, vertical, and both diagonals (down-right, down-left).

### Code Quality & Workflow Rules

- **File Naming:** React components use PascalCase (`App.tsx`). Utility/logic files use camelCase (`gameLogic.ts`).
- **Deployment Awareness:** The project is configured for GitHub Pages. The `base: '/match-4/'` property in `vite.config.ts` must remain intact.
- **Styling:** Standard CSS is used (`App.css`). Keep animations tied to `framer-motion` properties rather than CSS transitions where possible.

### Critical Don't-Miss Rules (Anti-Patterns)

- **DO NOT mutate React keys:** The `id` property on `Ball` objects is crucial for `framer-motion` layout animations. Never regenerate these IDs during a game session; move the existing object references instead.
- **DO NOT block the main thread:** Complex grid calculations (like finding cascades) must be efficient so they don't stutter the `framer-motion` animations.
- **DO NOT change Vite base path:** The project relies on the `/match-4/` base path for proper GitHub Pages deployment.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-05-21
