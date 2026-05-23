---
title: 'Hide Name Input After Save'
type: 'bugfix'
created: '2026-05-23'
status: 'draft'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Currently, after a game ends, the player can enter their name and click "Save" to save their score on the leaderboard multiple times.
**Approach:** Add a state to track whether the score has been saved in the current game over session. Once the score is saved, hide the name input and save button. Reset this state when the player starts a new game.

## Boundaries & Constraints

**Always:** Ensure the leaderboard is correctly updated before hiding the input.
**Ask First:** If any visual changes or additions to the "Game Over" screen other than hiding the input form are needed.
**Never:** Do not change the leaderboard storage logic or the sorting logic. Do not persist this state in `localStorage`.

</frozen-after-approval>

## Code Map

- `src/App.tsx` -- Main game component containing the leaderboard entry form, state, and `saveScore` logic.

## Tasks & Acceptance

**Execution:**
- [ ] `src/App.tsx` -- Add `isScoreSaved` state variable initialized to `false` -- To track if the score was saved.
- [ ] `src/App.tsx` -- Update `saveScore` function to set `isScoreSaved` to `true` on successful save -- To trigger hiding the input.
- [ ] `src/App.tsx` -- Update `restartGame` function to reset `isScoreSaved` to `false` -- To allow score saving in the next game session.
- [ ] `src/App.tsx` -- Wrap the `.leaderboard-entry` div rendering in a condition `!isScoreSaved` -- To hide the form when the score is already saved.

**Acceptance Criteria:**
- Given the game is over and the player hasn't saved the score, when the player views the game over screen, then the name input and save button are visible.
- Given the game is over, when the player enters a valid name and clicks "Save", then their score is added to the leaderboard and the name input and save button disappear.
- Given the player has saved a score, when they click "Play Again" and finish another game, then the name input and save button are visible again.

## Verification

**Manual checks (if no CLI):**
- Finish a game (score over 0).
- Enter a name and save.
- Verify the score appears in the leaderboard and the input form is hidden.
- Click "Play Again".
- End the new game.
- Verify the input form is visible again.
