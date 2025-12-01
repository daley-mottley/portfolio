# Overview

This is a personal portfolio website for Daley Mottley, an AI Consultant and Full-Stack Web Developer based in Barbados. The site showcases professional skills, projects, and services with a focus on AI solutions and web development. The portfolio includes internationalization support for multiple languages and features an interactive typewriter animation in the contact form.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

- **December 1, 2025**: Fixed newline handling in the typewriter animation. The `adjustPlaceholderText()` function now converts literal `\n` strings from JSON translation files into actual newline characters before processing.

# System Architecture

## Frontend Architecture

**Static Site with Progressive Enhancement**
- Built as a static HTML/CSS/JavaScript application with no build process required
- Uses vanilla JavaScript with Vue.js 3 (ESM browser version) for the questionnaire feature only
- Progressive enhancement allows core content to be accessible even without JavaScript

**Multi-Language Support (i18n)**
- Client-side internationalization using JSON locale files (en, es, fr, de, zh, ja, pt, fa)
- Language detection from URL parameters (`?lang=es`) and localStorage persistence
- Dynamic content replacement using `data-i18n` attributes
- Supports 8 languages including right-to-left languages (Persian/Farsi)

**UI Framework Stack**
- Bootstrap 3.3.5 for responsive grid and components
- Custom CSS with utility classes for additional styling
- Animate.css for entrance animations
- FlexSlider for carousels/sliders
- Owl Carousel for advanced carousel needs
- Font choices: Quicksand (body), Playfair Display (headings)

**Project Filtering System**
- Custom JavaScript-based filtering for portfolio projects
- Load-more pagination functionality
- Category-based filtering with active state management

## Key Files

- `index.html` - Main portfolio page
- `js/custom.js` - Project filtering, contact form handling, typewriter animation
- `js/i18n.js` - Internationalization logic
- `locales/*.json` - Translation files for 8 languages
- `css/style.css` - Main styles
- `css/custom.css` - Custom overrides

# External Dependencies

**Frontend Libraries**
- jQuery 2.1.4 - DOM manipulation and AJAX
- Bootstrap 3.3.5 - Responsive framework
- Vue.js 3 (ESM) - For questionnaire component
- Animate.css - CSS animation library
- FlexSlider 2.6.0 - Image/content slider
- Owl Carousel - Advanced carousel functionality

**External Assets**
- Cloudinary - Image hosting (res.cloudinary.com/dzpafdvkm)
- Google Fonts - Quicksand and Playfair Display
- Flag CDN (flagcdn.com) - Country flags for language switcher

# Development

The site runs on Python's built-in HTTP server:
```bash
python3 -m http.server 5000 --bind 0.0.0.0
```

Access the site at the Replit preview URL or localhost:5000.
