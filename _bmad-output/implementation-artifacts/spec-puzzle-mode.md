---
title: 'Puzzle/Clear-Board Game Mode'
type: 'feature'
created: '2026-05-21'
6status: 'done'
baseline_commit: '3505839f5f07e2ae6da4a3ffbf277acb0756316c'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The game is currently an endless match-4 mode with refills, which becomes monotonous over time and doesn't provide a sense of achievement or completion.

**Approach:** Transition the game into a "Puzzle/Clear-Board Game Mode" with distinct levels and a target score. The board starts full, balls do not refill when popped, and the level ends when no valid moves remain, leading to either progression (if target score met) or Game Over with a local leaderboard.

## Boundaries & Constraints

**Always:**
- Keep core game mechanics in `gameLogic.ts` separated from UI in `App.tsx`.
- Calculate target score dynamically or through a predefined progression curve per level.
- Grant more points for cascades and longer matches compared to basic 4-matches.
- Validate if there are *any possible moves* left on the board to determine level end.

**Ask First:**
- If the scoring math needs complex balancing tweaks beyond standard multipliers.

**Never:**
- Do not implement power-ups/bonuses.
- Do not carry over elements (like remaining balls) between levels.
- Do not implement a backend/global leaderboard (use localStorage).
- Do not mutate React keys/objects during board state updates.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Board Generation | Level starts | Board fully populated, no pre-existing matches | N/A |
| Move Execution | Player swaps adjacent balls | Match processed, balls removed, gravity applied, NO refill | Revert swap if no match |
| No Moves Detection | Board has no possible valid swaps | Level ends automatically after animations | N/A |
| Level Clear | No moves left, Score >= Target | Transition to next level, new board generated | N/A |
| Game Over | No moves left, Score < Target | Display Game Over screen, prompt for 3-letter name if high score | N/A |

</frozen-after-approval>

## Code Map

- `src/gameLogic.ts` -- Core logic: gravity without refill, move detection, level start generation.
- `src/App.tsx` -- State management for level, target score, game over UI, leaderboard UI, next level transition.
- `src/App.css` -- Styling for new UI elements (Game Over modal, Leaderboard).

## Tasks & Acceptance

**Execution:**
- [x] `src/gameLogic.ts` -- Modify `applyGravityAndRefill` to `applyGravity` (remove refill logic) and update `createInitialBoard` to use it -- to support puzzle mode mechanics.
- [x] `src/gameLogic.ts` -- Add `hasPossibleMoves(board)` function -- to detect level end conditions.
- [x] `src/gameLogic.ts` -- Update `findMatches` score return or let `App.tsx` calculate based on match length (bonus for >4) -- to encourage strategic play.
- [x] `src/App.tsx` -- Add states for `level`, `targetScore`, `gameState` ('playing', 'level_clear', 'game_over') and update `processCascades` to handle new scoring and check for `hasPossibleMoves` at the end of cascades -- to manage level progression.
- [x] `src/App.tsx` -- Implement Game Over modal with 3-letter name input and LocalStorage saving, and Level Clear transition -- to satisfy brief requirements.
- [x] `src/App.css` -- Add styles for Game Over/Level Clear overlays and leaderboard -- to make the UI presentable.
- [x] `src/gameLogic.test.ts` -- Add tests for `applyGravity`, `hasPossibleMoves` -- to ensure puzzle mechanics work correctly.

**Acceptance Criteria:**
- Given a new game, when starting, then the board is full and the level is 1 with a visible target score.
- Given a playing state, when balls match and disappear, then the remaining balls fall but no new balls drop from the top.
- Given a playing state, when no possible moves are left and score is below target, then Game Over screen is shown and leaderboard can be updated.
- Given a playing state, when no possible moves are left and score meets target, then a Level Clear notification is shown and the next level starts.

## Design Notes

- **Score Calculation:** Base 4-match = 40 pts. 5-match = 100 pts. Cascades should multiply the score of subsequent matches in the same chain (e.g., multiplier x1, x2, x3).
- **Possible Moves Detection:** `hasPossibleMoves` should simulate swaps horizontally and vertically for every adjacent pair and check if `findMatches` returns true.
- **Level Progression:** Target score can start at e.g. 500 for level 1, and increase by e.g. 1000 for each subsequent level.

## Verification

**Commands:**
- `npm run test` -- expected: all game logic tests pass, including new ones for possible moves and gravity without refill.

**Manual checks:**
- Play the game to ensure no new balls drop after a match.
- Verify that the game transitions to "Game Over" or "Next Level" when no moves are available.
- Check that the leaderboard correctly saves and loads from localStorage.

## Suggested Review Order

**Core Game Rules**

- Removes refill logic and just drops balls
  [`gameLogic.ts:103`](../../src/gameLogic.ts#L103)
- Ensures board is fully generated and guaranteed to have moves
  [`gameLogic.ts:119`](../../src/gameLogic.ts#L119)
- Simulates adjacent swaps carefully avoiding empty cells
  [`gameLogic.ts:145`](../../src/gameLogic.ts#L145)

**Game Loop & Progression**

- New multiplier logic scoring chains up to target score
  [`App.tsx:61`](../../src/App.tsx#L61)
- Blocks input unless gameState is purely 'playing'
  [`App.tsx:106`](../../src/App.tsx#L106)
- Target score and clear conditions restart logic
  [`App.tsx:165`](../../src/App.tsx#L165)

**UI & Game Over Overlays**

- Displays level transition, final score, and leaderboard input
  [`App.tsx:228`](../../src/App.tsx#L228)
- Basic styling for modal layers and uppercase leaderboard
  [`App.css:100`](../../src/App.css#L100)

**Tests**

- Tests verify puzzle-specific logic and constraints
  [`gameLogic.test.ts:116`](../../src/gameLogic.test.ts#L116)