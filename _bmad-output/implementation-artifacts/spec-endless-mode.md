---
title: 'Implement Endless Mode'
type: 'feature'
created: '2026-06-06'
status: 'ready-for-dev'
baseline_commit: 'ca0c28ae78943a2c1772a7255a4b6f8942817152'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The game currently only supports a "Survival" mode where moves eventually run out due to empty spaces or lack of matches, making the gameplay purely tactical. Players who want a relaxing, meditative experience with continuous chain reactions (cascades) don't have a mode suited to their playstyle.

**Approach:** Implement a new "Endless" mode alongside the existing mode. In Endless mode, empty spaces are automatically filled by balls falling from the top, triggering automatic cascades. Difficulty scales naturally by adding new colors to the pool every 100 popped balls instead of ending prematurely. The game will feature a mode selection screen, unified combo scoring, and mode-specific high scores.

## Boundaries & Constraints

**Always:**
- Separate high scores for Survival and Endless modes in `localStorage` and leaderboard UI.
- Use asynchronous loops (e.g., `setTimeout` or `await new Promise`) for smooth cascade resolutions without locking the UI.
- Reuse the existing progress bar in Endless mode to show progress towards the next color addition (0 to 100).
- **Architecture Standard (Plugin-like Modes):** Refactor the core loop into an engine that accepts a `GameModeStrategy` object/plugin. This strategy must dictate rules like: how to fill empty spaces (gravity only vs gravity + refill), how to handle level-ups (e.g., new colors vs pure levels), and when Game Over occurs. If we add a third mode later, it should just be a new strategy object, not a change to the core engine.
- Ensure Endless game over only triggers when there are no possible moves after the board is completely filled and stabilized. Ensure a valid move exists after refilling.
- Clicking restart MUST safely cancel any ongoing cascade loops to prevent ghost cascades overwriting new games.

**Ask First:**
- Adding large dependencies or completely rewriting the React component tree.
- Changing the grid dimensions (`ROWS`, `COLS`).

**Never:**
- Break the existing Survival mode mechanics (e.g. balls shouldn't fall from the top in Survival mode).
- Add complex meta-progression, online leaderboards, timers, or move limits.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Auto-cascade | Player makes a match in Endless mode | Board clears matches, applies gravity, fills top spaces, checks for new matches automatically | If no matches found after fill, wait for player input |
| Progressive difficulty | Player pops 100th ball in Endless mode | Progress bar resets to 0, color pool increases by 1 (e.g., purple added), new falling balls include the new color | Avoid exceeding maximum defined colors |
| Game Over | Board is full and no valid moves exist | Game state transitions to `game_over`, prompt to save score in Endless leaderboard | N/A |
| Switch mode | Player clicks "Restart" during gameplay | Return to Mode Selection screen without saving a partial score. Stop all ongoing async cascade loops. | N/A |

</frozen-after-approval>

## Code Map

- `src/gameLogic.ts` -- Needs to be split/refactored to define the `GameModeStrategy` interface and extract mode-specific logic (Survival vs Endless).
- `src/modes/survival.ts` -- (New File) Implement the `GameModeStrategy` for Survival mode.
- `src/modes/endless.ts` -- (New File) Implement the `GameModeStrategy` for Endless mode.
- `src/App.tsx` -- Needs a Mode Selection screen (`gameState: 'mode_select'`), integration with the new strategy pattern, Endless loop cascade handling, and Mode-Specific Leaderboards.
- `src/StatusBar.tsx` -- May need slight text adjustments depending on mode (Level vs Endless Progress).
- `src/App.css` -- Add screen shake animation classes for combos.

## Tasks & Acceptance

**Execution:**
- [x] `src/gameLogic.ts` -- Define a `GameModeStrategy` interface. It must provide methods to `fillSpaces` (returning a new board), `processLevelProgression` (returning updated level state like `{ level, targetBalls, colorPool }` based on inputs), and `checkGameOver` (returning boolean).
- [x] `src/gameLogic.ts` -- Ensure `GameModeStrategy.fillSpaces` implementation explicitly handles gravity (applying gravity before refilling for endless, and just applying gravity for survival).
- [x] `src/gameLogic.ts` -- Refactor `COLORS`, `getRandomColor`, `createBall`, `fillRandom`, `createInitialBoard` to accept a dynamic `colorPool` array parameter.
- [x] `src/modes/survival.ts` -- Create plugin logic for Survival mode: `fillSpaces` applies gravity only. `processLevelProgression` increments level when balls popped >= targetBalls (using the app's standard `55 + level * 20` math).
- [x] `src/modes/endless.ts` -- Create plugin logic for Endless mode: `fillSpaces` applies gravity AND fills top spaces randomly from `colorPool`. Ensure `hasPossibleMoves` is checked and board is reshuffled if stuck. `processLevelProgression` expands the `colorPool` every 100 balls.
- [x] `src/App.tsx` -- Add a `gameMode` state (`'survival' | 'endless'`) and a `'mode_select'` state to `gameState`. Build a simple start screen to choose. Load the corresponding strategy on game start.
- [x] `src/App.tsx` -- Update `processCascades` to utilize the selected strategy's `fillSpaces`. Ensure the background async loop checks `gameState !== 'playing'` periodically and aborts if the player hits "Restart".
- [x] `src/App.tsx` -- Accumulate a global combo multiplier for scoring.
- [x] `src/App.tsx` -- Separate leaderboards into `match-4-leaderboard-survival` and `match-4-leaderboard-endless`. Save and load logic paths appropriately.
- [x] `src/StatusBar.tsx` -- Update progress bar logic. Survival: Level progress. Endless: `ballsPopped % 100` progress. Ensure modulo logic doesn't cause a visual 0-width snap incorrectly.
- [x] `src/App.css` -- Add a CSS animation class `.screen-shake` for progressive screen shake feedback on high combos (>= 3).

**Acceptance Criteria:**
- Given the game starts, when the player opens it, then they see a Mode Selection screen.
- Given the player is in Endless mode, when they make a match, then empty spaces are automatically filled with new balls from the top, triggering further matches if aligned.
- Given the player pops 100 balls in Endless mode, when the board fills new spaces, then a new color is introduced into the generation pool.
- Given the player clicks "Restart", when they are in any mode, then they are returned to the Mode Selection screen and all async loops immediately halt.

## Spec Change Log

- **2026-06-06 (Iteration 1):**
  - **Finding:** Strategy interfaces lacked sufficient context parameters, causing Survival logic to guess hardcoded values or break progression (e.g., `checkLevelUp` missed `targetBalls` info and broke level tracking). Also `fillSpaces` in `SurvivalStrategy` failed to apply gravity explicitly, leaving floating balls. Endless `fillSpaces` failed to guarantee board playability on refill. Restart did not cancel async background processes.
  - **Amended:** 
    - Updated `GameModeStrategy` definition to explicitly handle progression states (returning objects) rather than side-effecting.
    - Explicitly mandate `applyGravity` within the strategy `fillSpaces` implementations or as a mandatory step before refilling.
    - Added edge case for restarting while `isProcessing === true` (checking game state in loop).
    - Added requirement for Endless mode to guarantee possible moves after refill (reshuffle if stuck).
  - **Avoids:** Bizarre level jumps in Survival, floating gaps after matches, ghost cascades overwriting new games, and unfair insta-game-overs in Endless mode.
  - **KEEP:** The separation of leaderboards into two keys, the usage of modulo 100 for Endless progress UI, the dynamic `colorPool` concept, and the `.screen-shake` CSS animation logic.

## Design Notes

Endless mode cascade resolution is fundamentally different from Survival. In Survival, `applyGravity` moves balls down leaving `null` at the top. In Endless, `fillTopSpaces` must fill those `null`s with new balls and then re-check matches. 
To avoid infinite loops in the UI thread, `processCascades` must use `await new Promise(r => setTimeout(r, X))` to animate the cascades step-by-step.
Check `gameState` or `isProcessing` within the cascade while loop to abort safely if user hits Restart mid-cascade.
