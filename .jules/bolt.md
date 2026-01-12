
## 2024-07-29 - JS Bundling Breaks Preloader

**Learning:** Concatenating JavaScript files, including `preloader.js`, breaks the site's preloader functionality. The `preloader.js` script depends on the `window.load` event, and bundling it with other scripts disrupts the timing, causing the preloader to malfunction. This highlights a critical dependency that must be respected during optimization.

**Action:** Avoid bundling `preloader.js` with other scripts. Instead, load it separately to ensure it executes at the correct time. Prioritize less disruptive optimizations or carefully analyze script dependencies before combining them.
