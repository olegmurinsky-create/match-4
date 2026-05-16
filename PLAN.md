# React Match-5 Game Plan

## 1. Objective
Create a simple web-based Match-5 game using React. The game combines "Match-3" swapping mechanics (swap adjacent to match) with "Color Lines" matching rules (5 in a line), featuring gravity (balls fall down) and top-refill.

## 2. Key Mechanics & Rules
- **Grid:** 20x20 cells.
- **Colors:** 4 distinct colors.
- **Interaction:** The player clicks on a ball, then clicks on an adjacent ball (up, down, left, right) to swap them.
- **Valid Swap:** A swap is only valid if it results in at least 5 balls of the same color aligning consecutively (horizontally, vertically, or diagonally). If the swap doesn't result in a match, the balls revert to their original positions (instantaneously).
- **Matching & Clearing:** When 5 or more balls form a line, they immediately disappear.
- **Gravity:** Balls above the cleared space instantly fall straight down to fill the empty cells.
- **Refill:** Empty cells at the top of the board are instantly filled with new balls of random colors.
- **Chain Reactions:** If falling balls create new matches of 5 or more, those matches also clear automatically (cascading).
- **Animations:** Instant state updates without complex transitions, as requested.
- **End Condition:** Endless gameplay focusing on score accumulation (classic high-score mechanic).

## 3. Tech Stack
- **Framework:** React 18+ (using Vite for fast bootstrapping).
- **Language:** JavaScript or TypeScript (TypeScript recommended for game state safety).
- **Styling:** Vanilla CSS or CSS Modules (simple, clean colored circles).

## 4. Implementation Steps
1. **Scaffold Project:** Run `npm create vite@latest . -- --template react-ts` in the target directory, install dependencies.
2. **Game State Management:**
   - Define a 20x20 2D array representation of the board in a custom hook or React state.
   - Track `selectedCell` to handle the two-click swap interaction.
   - Track `score`.
3. **Core Game Logic (Functions):**
   - `initializeBoard()`: Generate a 20x20 grid with random colors, ensuring no pre-existing lines of 5.
   - `checkMatches(board)`: Scan the board for lines of 5+ (horizontal, vertical, diagonal).
   - `handleSwap(r1, c1, r2, c2)`: Temporarily swap, call `checkMatches`. If match found, apply; else, revert.
   - `applyGravityAndRefill(board)`: Make balls fall down and generate new ones at the top.
   - `processTurn()`: A loop/effect to handle cascading matches until no matches are left.
4. **UI Components:**
   - `Game`: Main container, handles score display and reset button.
   - `Board`: Renders the 20x20 grid.
   - `Cell`: Renders a single square with a colored circle inside. Handles click events for selection/swapping.

## 5. Verification & Testing
- Ensure no initial matches of 5 exist upon loading.
- Verify that invalid swaps are reverted.
- Verify horizontal, vertical, and diagonal lines of 5+ are correctly identified and cleared.
- Verify gravity correctly pulls items down column by column.
- Verify chain reactions trigger automatically.

## 6. Migration & Future Expansion (Out of Scope for V1)
- Smooth CSS animations for falling and swapping.
- Sounds and particle effects.
- Levels and power-ups.