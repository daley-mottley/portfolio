## 2024-07-25 - Animations Can Break Screenshot Verification

**Learning:** CSS-based fade-in animations, like those triggered by Waypoints.js in this project, can interfere with automated screenshot capture tools like Playwright. The screenshot may be taken before the animation completes, resulting in a blank or partially rendered image. This can cause a valid code change to fail verification.

**Action:** When verifying changes on a page with scroll-triggered animations, update the verification script to temporarily disable the animations before capturing the screenshot. This can be done by injecting JavaScript to remove the animation-triggering classes (e.g., `.animate-box`) from the relevant elements. This ensures the screenshot accurately reflects the final rendered state of the UI, not an intermediate animation state.
