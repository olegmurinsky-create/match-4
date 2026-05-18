# React Match-4 Game Plan

## 1. Objective
Create a simple web-based Match-4 game using React. The game combines "Match-3" swapping mechanics (swap adjacent to match) with "Color Lines" matching rules (4 in a line), featuring gravity (balls fall down), top-refill, and clearing animations.

## 2. Key Mechanics & Rules
- **Grid:** 15x15 cells.
- **Colors:** 4 distinct colors.
- **Interaction:** The player clicks on a ball, then clicks on an adjacent ball (up, down, left, right) to swap them.
- **Valid Swap:** A swap is only valid if it results in at least 4 balls of the same color aligning consecutively (horizontally, vertically, or diagonally). If the swap doesn't result in a match, the balls revert to their original positions (instantaneously).
- **Matching & Clearing:** When 4 or more balls form a line, they disappear with an animation.
- **Gravity:** Balls above the cleared space instantly fall straight down to fill the empty cells.
- **Refill:** Empty cells at the top of the board are instantly filled with new balls of random colors.
- **Chain Reactions:** If falling balls create new matches of 4 or more, those matches also clear automatically (cascading).
- **Animations:** UI animations powered by `framer-motion` for smoother clearing and falling visuals.
- **End Condition:** Endless gameplay focusing on score accumulation (classic high-score mechanic).

## 3. Tech Stack
- **Framework:** React 18+ (using Vite for fast bootstrapping).
- **Language:** JavaScript or TypeScript (TypeScript recommended for game state safety).
- **Styling:** Vanilla CSS or CSS Modules with `framer-motion` for animations.

## 4. Implementation Steps
1. **Scaffold Project:** Run `npm create vite@latest . -- --template react-ts` in the target directory, install dependencies.
2. **Game State Management:**
   - Define a 15x15 2D array representation of the board in a custom hook or React state.
   - Track `selectedCell` to handle the two-click swap interaction.
   - Track `score`.
3. **Core Game Logic (Functions):**
   - `initializeBoard()`: Generate a 15x15 grid with random colors, ensuring no pre-existing lines of 4.
   - `checkMatches(board)`: Scan the board for lines of 4+ (horizontal, vertical, diagonal).
   - `handleSwap(r1, c1, r2, c2)`: Temporarily swap, call `checkMatches`. If match found, apply; else, revert.
   - `applyGravityAndRefill(board)`: Make balls fall down and generate new ones at the top.
   - `processTurn()`: A loop/effect to handle cascading matches until no matches are left.
4. **UI Components:**
   - `Game`: Main container, handles score display and reset button.
   - `Board`: Renders the 15x15 grid.
   - `Cell`: Renders a single square with a colored circle inside. Handles click events for selection/swapping.

## 5. Verification & Testing
- Ensure no initial matches of 4 exist upon loading.
- Verify that invalid swaps are reverted.
- Verify horizontal, vertical, and diagonal lines of 4+ are correctly identified and cleared.
- Verify gravity correctly pulls items down column by column.
- Verify chain reactions trigger automatically.

## 6. Migration & Future Expansion (Out of Scope for V1)
- Sounds and particle effects.
- Levels and power-ups.