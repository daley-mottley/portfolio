## 2024-07-25 - Animations Can Break Screenshot Verification

**Learning:** CSS-based fade-in animations, like those triggered by Waypoints.js in this project, can interfere with automated screenshot capture tools like Playwright. The screenshot may be taken before the animation completes, resulting in a blank or partially rendered image. This can cause a valid code change to fail verification.

**Action:** When verifying changes on a page with scroll-triggered animations, update the verification script to temporarily disable the animations before capturing the screenshot. This can be done by injecting JavaScript to remove the animation-triggering classes (e.g., `.animate-box`) from the relevant elements. This ensures the screenshot accurately reflects the final rendered state of the UI, not an intermediate animation state.

## 2025-01-24 - Redundant Font Requests and Missing Assets

**Learning:** This codebase had redundant Google Font v1 requests and a missing `Poppins` font-family import, despite it being used extensively in `custom.css`. It also suffered from a 404 error on a non-existent CSS file (`flaticon.css`) in the critical path.

**Action:** Always audit font imports and asset links. Consolidate font requests into a single Google Fonts v2 API call with `&display=swap` to reduce HTTP requests and prevent FOIT. Use `preconnect` and `dns-prefetch` resource hints for critical external domains (Cloudinary, Google Fonts) to accelerate connection setup.
