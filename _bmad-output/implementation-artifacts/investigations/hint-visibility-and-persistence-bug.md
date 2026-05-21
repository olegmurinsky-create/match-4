# Case File: hint-visibility-and-persistence-bug

## Hand-off Brief

_(This will be filled in at the end of the investigation)_

---

## Case Info

| Field                  | Value                               |
| ---------------------- | ----------------------------------- |
| **Case ID**            | hint-visibility-and-persistence-bug |
| **Date Opened**        | 2026-05-22                          |
| **Investigator**       | GitHub Copilot                      |
| **Status**             | Active                              |
| **Confidence**         | -                                   |

---

## Problem Statement

The user reports two issues with the hint functionality: 1) The animation is not visually prominent enough. 2) The hint is not persistent and may show different possible moves on each animation cycle, instead of sticking to one.

---

## Evidence Inventory

| ID  | Type | Description | Status |
| --- | --- | --- | --- |
| E1  | User Statement | "анимация подсказки не видна" (Hint animation is not visible) | Confirmed |
| E2  | User Statement | "подсказка повторялась на одних и тех же шариках" (Hint should repeat on the same balls) | Confirmed |

---

## Hypothesized Paths

| ID  | Hypothesis                                     | Status | Resolution |
| --- | ---------------------------------------------- | ------ | ---------- |
| H1  | The animation's `scale` factor is too small, and the logic re-calculates the hint on every interval instead of storing it. | Open   | -          |

---

## Investigation Backlog

| ID  | Task                                     | Status      |
| --- | ---------------------------------------- | ----------- |
| B1  | Increase visibility of the hint animation. | Done |
| B2  | Refactor logic to store the hinted move and repeat the animation for it. | Done |
| B3  | Adjust hint repeat interval to match specification (5 seconds). | Done |

---

## Investigation Log

### 2026-05-22

- Case opened based on user feedback.
- **Stronghold:** The user's direct feedback on the two specific shortcomings of the hint feature.
- **Update (2026-05-22):** The user confirmed the animation visibility and persistence were fixed, but the repeat interval was too short (3s instead of 5s).
- **Resolution:** The `setInterval` delay in `src/App.tsx` was corrected from `3000` to `5000` to provide the required 3.5s pause between animations.
- **Case Concluded:** With this final correction, the feature now aligns with all user requirements. The investigation is closed.
