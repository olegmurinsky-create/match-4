# Case File: project-out-of-control

## Hand-off Brief

_(This will be filled in at the end of the investigation)_

---

## Case Info

| Field                  | Value                    |
| ---------------------- | ------------------------ |
| **Case ID**            | project-out-of-control   |
| **Date Opened**        | 2026-05-21               |
| **Investigator**       | GitHub Copilot           |
| **Status**             | **Concluded**            |
| **Confidence**         | **High**                 |

---

## Problem Statement

The user reports that the project is "out of control", citing bugs and discrepancies between the code and the documentation, and is unsure how to proceed with fixing it.

---

## Evidence Inventory

| ID  | Type | Description | Status |
| --- | --- | --- | --- |
| E1  | User Statement | Initial problem description | Confirmed |
| E2  | User Statement | Claim: `targetScore` logic was changed for progressive difficulty. | **Discrepancy Found** |
| E3  | User Statement | Claim: Fever Mode timer was changed to absolute positioning. | Confirmed |
| E4  | User Statement | Claim: Hint animation was changed from 'rotate' to 'scale'. | Confirmed |
| E5  | User Statement | Claim: A `ReferenceError` was fixed by declaring `hintTimeoutRef`. | Confirmed |

---

## Hypothesized Paths

| ID  | Hypothesis                                     | Status | Resolution |
| --- | ---------------------------------------------- | ------ | ---------- |
| H1  | The project has significant unmanaged divergence between its implementation and its documentation, leading to bugs and developer confusion. | **Confirmed** | A discrepancy was found in the `targetScore` calculation logic. |

---

## Investigation Backlog

| ID  | Task                                     | Status      |
| --- | ---------------------------------------- | ----------- |
| B1  | Identify a specific, reproducible bug.   | Done        |
| B2  | Find a concrete code/doc discrepancy.    | Done        |
| B3  | Verify the `ReferenceError` fix for `hintTimeoutRef`. | Done        |
| B4  | Verify the new `targetScore` calculation logic. | Done        |
| B5  | Verify the CSS positioning of the Fever Mode timer. | Done        |
| B6  | Verify the new hint animation (`scale` vs. `rotate`). | Done        |

---

## Investigation Log

### 2026-05-21

- Case opened.
- Initial problem statement captured (E1, H1).
- User provided a list of four recent changes (E2, E3, E4, E5), which will serve as our initial investigation threads.
- **Stronghold selected:** The `ReferenceError` fix (E5) is our starting point due to its critical nature.
- Investigation of E3, E4, and E5 confirmed that the code matches the user's description.
- **Discrepancy Found:** Investigation of E2 revealed that the implemented formula for `targetScore` (`nextLevel * 1000 - 500`) does **not** match the user's provided requirement (`score + (nextLevel * 1000 - 500)`). This confirms Hypothesis H1.
- **Resolution:** User chose to correct the code. The formula in `src/App.tsx` was updated to align with the requirement.
- **Case Concluded:** With the fix applied, the investigation is now closed.
