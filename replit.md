# AI Business Insights Portfolio

## Overview

This is a personal portfolio website for Daley Mottley, an AI Consultant specializing in workflow automations and machine learning. The site features a static portfolio showcasing skills and projects, along with an interactive AI Business Insights questionnaire application. The questionnaire collects business information from users and generates custom AI-powered insights reports using OpenAI's API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static Portfolio Site**
- Built with vanilla HTML, CSS, and JavaScript
- Uses jQuery for DOM manipulation and animations
- Bootstrap 3.3.5 for responsive grid layout and components
- Multiple CSS animation libraries (Animate.css, Flexslider, Owl Carousel) for visual effects
- Custom styling via `css/custom.css` with utility classes for flexbox layouts

**Vue.js Questionnaire Application**
- Separate single-page application at `/questionnaire.html`
- Vue 3 loaded via CDN (ESM browser build)
- Component-based architecture with `QuestionnaireForm` as the main interactive component
- Client-side form handling with multiple-choice questions and additional text input
- Responsive design for collecting business insights data

**Design Patterns**
- Modular CSS approach with separate files for different libraries
- Progressive enhancement with Modernizr for feature detection
- Mobile-first responsive design with viewport meta tags
- Icon fonts (Icomoon, Flaticons) for scalable vector graphics

### Backend Architecture

**Flask REST API**
- Minimal Flask application serving a single endpoint: `/generate-report`
- Accepts POST requests with JSON payload containing user answers
- Stateless API design - no session management or data persistence

**AI Report Generation**
- OpenAI GPT-3 integration using the legacy Completion API (text-davinci-003 engine)
- Generates custom business insights reports based on user questionnaire responses
- Prompt engineering combines multiple answer fields into structured business report
- Report generation configured for 1500 max tokens

**Environment Configuration**
- API key management via environment variables (`OPENAI_API_KEY`)
- CORS-enabled for cross-origin requests from frontend
- Deployed on Render.com platform (based on API endpoint URL)

**Limitations in Current Implementation**
- PDF generation is stubbed (writes text to file, not actual PDF)
- Google Drive upload functionality is not implemented
- Returns placeholder URL instead of actual download link
- No error handling or input validation on backend

### External Dependencies

**Third-Party Libraries (Frontend)**
- jQuery 2.1.4 - DOM manipulation and AJAX
- Bootstrap 3.3.5 - UI framework
- Vue.js 3 - Reactive component framework for questionnaire
- Owl Carousel - Image/content carousel
- FlexSlider 2.6.0 - Responsive slider
- Waypoints 4.0.0 - Scroll-triggered animations
- CountTo - Animated number counting
- Animate.css - CSS animation library
- Google Fonts (Quicksand, Playfair Display) - Typography

**Third-Party Services**
- OpenAI API - GPT-3 text generation (text-davinci-003 model)
- Google Maps JavaScript API - Location mapping (configured for Brooklyn, NY)
- Render.com - Backend API hosting

**Python Dependencies (Backend)**
- Flask - Web framework
- openai - OpenAI Python SDK (legacy version using Completion API)

**Missing Integrations**
- PDF generation library (mentioned but not implemented)
- Google Drive API (planned but not implemented)
- Email service for report delivery (not implemented)