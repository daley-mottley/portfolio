## 2024-10-27 - Accessible Form Feedback

**Learning:** Using a `textarea`'s placeholder for form submission feedback is inaccessible and provides a poor user experience. Screen readers often ignore placeholders, and the feedback is not persistent. A dedicated, persistent feedback element with `aria-live="polite"` is the correct approach.

**Action:** When evaluating forms, always check for accessible and persistent feedback mechanisms. Prioritize using dedicated elements for status messages over repurposing other form elements like placeholders.
