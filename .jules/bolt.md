## 2024-07-25 - Animations Can Break Screenshot Verification

**Learning:** CSS-based fade-in animations, like those triggered by Waypoints.js in this project, can interfere with automated screenshot capture tools like Playwright. The screenshot may be taken before the animation completes, resulting in a blank or partially rendered image. This can cause a valid code change to fail verification.

**Action:** When verifying changes on a page with scroll-triggered animations, update the verification script to temporarily disable the animations before capturing the screenshot. This can be done by injecting JavaScript to remove the animation-triggering classes (e.g., `.animate-box`) from the relevant elements. This ensures the screenshot accurately reflects the final rendered state of the UI, not an intermediate animation state.

## 2024-05-06 - Undiscovered Asset Dependencies

**Learning:** This codebase had a "phantom font" dependency. `Poppins` was used extensively in `css/custom.css` (primary branding font) but was never actually loaded via Google Fonts in `index.html`. This resulted in inconsistent rendering across different environments depending on whether the user had the font installed locally.

**Action:** Always cross-reference `font-family` declarations in CSS files with the font loading strategy in the HTML. Use the Google Fonts v2 API to consolidate multiple font families and weights into a single request with `&display=swap` to minimize HTTP round-trips and prevent Flash of Invisible Text (FOIT).
