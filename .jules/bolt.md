## 2024-07-25 - Animations Can Break Screenshot Verification

**Learning:** CSS-based fade-in animations, like those triggered by Waypoints.js in this project, can interfere with automated screenshot capture tools like Playwright. The screenshot may be taken before the animation completes, resulting in a blank or partially rendered image. This can cause a valid code change to fail verification.

**Action:** When verifying changes on a page with scroll-triggered animations, update the verification script to temporarily disable the animations before capturing the screenshot. This can be done by injecting JavaScript to remove the animation-triggering classes (e.g., `.animate-box`) from the relevant elements. This ensures the screenshot accurately reflects the final rendered state of the UI, not an intermediate animation state.

## 2024-05-15 - Redundant Preloads and Google Fonts Consolidation

**Learning:** Using both `<link rel="preload">` and `<link rel="stylesheet">` for the same font assets can cause duplicate downloads if not implemented perfectly. Furthermore, separate requests for different font families increase HTTP round-trips. The modern Google Fonts CSS2 API allows for a single consolidated request, and when combined with `preconnect` hints, it provides a significantly faster and more efficient font-loading experience than manual preloading of multiple CSS files.

**Action:** Always audit the `<head>` for redundant font declarations. Consolidate multiple Google Font requests into a single CSS2 API call with `&display=swap` and use `preconnect` for both `fonts.googleapis.com` and `fonts.gstatic.com` to minimize latency. Remove any manual preloads for these fonts unless they are strictly necessary for critical above-the-fold content and verified not to cause double downloads.
