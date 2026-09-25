## BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY
Format: ## YYYY-MM-DD - [Title] **Learning:** [Insight] **Action:** [How to apply next time]

## 2024-10-27 - Script Combination Failure
**Learning:** Combining JavaScript files without a clear understanding of their dependencies and execution order can break critical functionality. In this case, the site's preloader script (`preloader.js`) failed to hide because it was combined with other scripts it likely needed to precede, causing a timeout in verification.
**Action:** Before combining scripts, analyze their dependencies. Prioritize less disruptive optimizations. If combining scripts, ensure the execution order is preserved, especially for initialization and UI-blocking scripts like preloaders.
