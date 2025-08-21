# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Project Architecture

This is a React-based breathing meditation app with a single-page architecture using functional components and hooks. The entire application is contained in `src/App.js` as a monolithic component with three main screens managed by state.

### Core Application Structure

- **Single Component Architecture**: Everything is in `src/App.js` with nested components defined within
- **Screen Management**: Uses `currentScreen` state to switch between 'start', 'session', and 'complete' views
- **State Management**: Uses React hooks for all state management (no external state library)

### Key Components

1. **Main Start Screen** (default view):
   - Duration selector dropdown (30s to 20min)
   - Start button to begin breathing session
   - Settings button (not yet implemented)

2. **BreathingSession Component** (lines 94-345):
   - Precise timing system using `Date.now()` for accuracy
   - Three-circle animation system (outer fixed, inner fixed, animated guide)
   - Touch-to-reveal controls (pause/resume, stop, timer)
   - Breath counting and session progress tracking

3. **CompletionScreen Component** (lines 348-418):
   - Session completion summary
   - Continue and Share buttons
   - Uses flexbox layout optimized for mobile responsiveness

### Breathing Pattern System

- **Pattern Configuration**: Defined in `breathingPatterns` object (lines 12-31)
- **Timing Logic**: Handles multi-phase breathing cycles with precise timing
- **Animation Mapping**: Maps breathing phases to circle animation progress
- **Current Patterns**: Natural Taoist Breath (4s inhale/6s exhale), Wu Wei Balance (box breathing)

### Styling and Design

- **Tailwind CSS**: Custom configuration with app-specific color palette
- **Mobile-First**: Responsive design optimized for mobile devices
- **Custom Fonts**: EB Garamond (headlines), Karla (body), IBM Plex Mono (buttons)
- **Dark Theme**: Uses custom `app-*` color variables defined in `tailwind.config.js`

### Asset Dependencies

- **SVG Icons**: Located in `public/images/` (pause, play, stop, share, chevrons, slider)
- **PNG Images**: Decorative breath elements in `public/images/`
- **Expected Assets**: All UI icons and decorative images should be present in `/public/images/`

### State and Data Flow

- **Session Timing**: Uses `sessionStartTime` and `pausedTime` tracking for precise duration management
- **Animation Progress**: Calculated based on current breathing phase and elapsed time
- **Persistence**: Session completion count stored in component state (localStorage integration planned)

### Performance Considerations

- **Animation Loop**: 60fps updates using 16ms intervals for smooth circle animation
- **Timing Precision**: Uses `Date.now()` instead of timers for accurate breath timing
- **Memory Management**: Proper cleanup of intervals and event listeners

## Important Implementation Notes

- When modifying timing logic, always use `Date.now()` for precision rather than counting intervals
- Responsive layout uses flexbox with specific `flex-none` and `flex-1` patterns - maintain this structure
- Circle animation calculations are mathematical based on radius interpolation between fixed boundaries
- Touch interactions should include `e.stopPropagation()` to prevent bubbling in nested controls