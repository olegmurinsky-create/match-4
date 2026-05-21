---
stepsCompleted: [1]
inputDocuments: []
session_topic: 'Решение проблемы падения темпа игры в конце уровня'
session_goals: 'Продумать механики для динамичного завершения уровня (Hint, Next Level, Timer и др.)'
selected_approach: ''
techniques_used: []
ideas_generated: []
context_file: ''
---

## Session Overview

**Topic:** Решение проблемы падения темпа игры в конце уровня
**Goals:** Продумать механики для динамичного завершения уровня (Hint, Next Level, Timer и др.)

### Session Setup

Фокус на улучшении UX/UI в конце уровня, когда очков достаточно для прохождения, но найти оставшиеся возможные ходы становится слишком сложно и скучно.

## Technique Execution: SCAMPER

**[Category 1]**: Pure Popping (Reject Bombs)
*Concept*: The user explicitly rejected power-ups like bombs. The solution must revolve strictly around the core mechanic of matching/popping balls.
*Novelty*: Forces us to solve the pacing issue purely through UX, scoring, or rules rather than introducing external "easy out" mechanics.

**[Category 2]**: Fever Mode / Bonus Timer (Combine: Timer + Score)
*Concept*: Once the target score is reached, a countdown timer starts automatically. The game enters a "Fever Mode" where matches give 2x/3x points. When the timer hits zero, the level ends and transitions to the next.
*Novelty*: Turns the tedious "finding the last moves" phase into an exciting, rapid-fire bonus round. The player doesn't *have* to find every move—if they get stuck, the timer simply runs out and they advance naturally.

**[Category 3]**: Subtle Auto-Hint (Modify: Hint + Visuals)
*Concept*: Instead of a manual "Hint" button, when the target score is reached and the board has few moves left, the remaining valid matches begin to subtly pulse or glow.
*Novelty*: Removes the need for a UI button and seamlessly guides the player to the remaining pops, keeping the flow continuous and satisfying.

**[Category 4]**: Selected Approach: Fever Mode Countdown
*Concept*: User explicitly approved the "Fever Mode" approach with a 20-second timer that begins once the target score is reached. Visual hints can be added during this phase to accelerate popping.
*Novelty*: Transforms a pacing problem into a reward mechanic, ensuring every level ends on an energetic high note rather than frustrated searching.

**[Category 5]**: The "Stuck Before Target" Problem (Hint Variations)
*Concept*: User identified a critical edge case: being stuck *before* reaching the target score. Suggested a "Hint" mechanic to prevent soft-lock frustration.
*Novelty*: Explores how a hint system can integrate without making the game too easy, potentially introducing risk/reward or idle-detection mechanics.

**[Category 6]**: Selected Approach: Passive Auto-Hint (Idle Detection)
*Concept*: User chose the passive approach. If the player is idle (doesn't make a move), two balls that form a valid match will subtly shake for 1-2 seconds, followed by a 3-4 second pause, repeating until a move is made. No UI buttons added.
*Novelty*: Keeps the interface completely clean and provides a built-in "safety net" for players who lose focus or get stuck, seamlessly maintaining flow without punishing the player.

## Idea Organization and Prioritization

**Thematic Organization:**

**Theme 1: Pacing & Reward Phase (Fever Mode)**
- **Fever Mode Countdown**: 20-second timer triggers upon reaching the target score. Transforms the end of the level into an adrenaline-fueled bonus round with point multipliers.

**Theme 2: Frictionless Assistance (Auto-Hint)**
- **Passive Auto-Hint**: Idle detection mechanism. Subtle 1-2s shaking animation on valid matches followed by a 3-4s pause to organically guide the player without UI clutter.

**Prioritization Results:**

- **Top Priority Ideas:** Both Fever Mode and Passive Auto-Hint act synergistically. Auto-Hint solves mid-level friction, while Fever Mode solves end-of-level pacing.

**Action Planning:**
- **Step 1:** Implement the 20-second Fever Mode timer logic triggered by `score >= targetScore`.
- **Step 2:** Add score multipliers during the Fever Mode active state.
- **Step 3:** Implement an idle timer in the game loop (resetting on swap) that triggers a CSS shake animation on matched components after X seconds.
