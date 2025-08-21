# Natural Taoist Breath App - Product Requirements Document

## Overview
A minimalist, mobile-first breathing app focused on guided Natural Taoist Breath practice (4s inhale, 6s exhale). Clean, dark-themed interface with visual breathing guidance, audio cues, and haptic feedback.

## Core Features (v1)

### 1. Main Start Screen
- **Title**: "Natural Taoist Breath"
- **Subtitle**: "Inhale 4s → Exhale 6s"
- **Duration Selector**: Dropdown with 30s, 1min, 1:30, 2min, 2:30, 3min... up to 20min (30-second intervals)
- **Default Duration**: 1 minute
- **Start Button**: Large, prominent button to begin session
- **Settings Access**: Gear icon (top right) leads to settings screen

### 2. Session Duration Setup
- **Duration Adjustment**: Users can modify duration before starting
- **Visual**: Clean interface showing selected time
- **Save Button**: Confirms duration selection
- **Plus/Minus Controls**: Adjust time in 30-second increments

### 3. Active Breathing Session
#### Visual Animation System:
- **Outer Circle**: Fixed boundary (maximum inhalation point)
- **Inner Circle**: Fixed core containing "Inhale"/"Exhale" text (minimum point)  
- **Animated Guide Circle**: Expands/contracts between inner and outer circles

#### Animation Behavior:
- **Inhale Phase (4s)**:
  - Text displays "Inhale"
  - Guide circle smoothly expands from inner to outer circle over 4 seconds
  - User follows expansion with breathing in
  
- **Exhale Phase (6s)**:
  - Text displays "Exhale"
  - Guide circle smoothly contracts from outer to inner circle over 6 seconds
  - User follows contraction with breathing out

#### Session Controls:
- **Play/Pause Button**: Center bottom (toggles session)
- **Stop Button**: Immediately ends session, returns to home screen (no confirmation)
- **Countdown Timer**: Shows remaining time, counts down from set duration
- **Haptic Toggle**: Quick access button for haptic feedback on/off

#### Timer Logic:
- Session completes when countdown reaches 0:00
- If timer hits 0:00 mid-cycle, allow current breathing cycle to finish naturally
- Only completed sessions count toward progress tracking

### 4. Session Completion
- **Breath Count Display**: "183 Breaths" (example)
- **Progress Tracking**: Increment total completed sessions in local storage
- **Continue Button**: Return to main screen for new session
- **Share Option**: Share completion (future enhancement)

## Technical Specifications

### Audio & Haptic Feedback
- **Audio Cues**: Gentle transition sounds for inhale/exhale (user-provided sound file)
- **Haptic Feedback**: Vibration pulses at breathing transitions (mobile devices)
- **Controls**: 
  - Settings screen toggle for audio on/off
  - Quick haptic toggle button during sessions
  - Both default to ON

### Session Management
- **Background Behavior**: Auto-pause when app goes to background
- **Return Behavior**: Show resume option when user returns to app
- **Session Definition**: Only sessions completed to full duration count as "completed"
- **Incomplete Sessions**: Don't increment progress counter

### Data Storage (Local Storage)
```javascript
{
  totalSessions: 47,                    // Completed sessions only
  settings: {
    soundEnabled: true,
    hapticEnabled: true
  }
  // Future: totalBreaths, sessionHistory, etc.
}
```

### Settings Screen
**Accessible via**: Gear icon on main screen
**Current Settings**:
- Sound On/Off toggle
- Haptic On/Off toggle  
- Data backup information message

**Future Settings**:
- Breathing exercise cards (different techniques)
- When user selects new technique → return to home screen with new exercise details

## Design Requirements

### Visual Design
- **Theme**: Dark mode only (for v1)
- **Color Palette**: Dark backgrounds, light text, minimal accent colors
- **Typography**: Clean, readable fonts
- **Animation**: Smooth, natural easing (no linear/robotic movement)

### Responsive Design
- **Primary**: Mobile-first (320px-768px)
- **Secondary**: Tablet and desktop support
- **Desktop Behavior**: Maintain vertical mobile layout (no landscape adaptation)
- **Framework**: React web app

### User Flow
```
Main Screen → Duration Setup → Active Session → Completion Screen
     ↑                                ↓
     ←----------- Stop Button --------←
```

## Navigation & UX

### Single-Flow Experience
- No complex navigation or back buttons
- Linear progression through screens
- Stop button returns to main screen from any point

### Onboarding
- **Approach**: Let users discover naturally
- **No Tutorial**: Users learn 4s inhale/6s exhale through experience
- **Simple Interface**: Self-explanatory design

## Platform Requirements

### Technical Stack
- **Framework**: React (web-based)
- **Platform**: Mobile web first, responsive for all devices
- **PWA Considerations**: Future enhancement for offline capability
- **Browser Support**: Modern mobile browsers (Chrome, Safari, Firefox)

### Performance Requirements
- **Animation**: 60fps smooth breathing guide animation
- **Timing Accuracy**: Precise 4s/6s breathing cycles
- **Responsiveness**: Immediate feedback on all user interactions

## Future Enhancements (Post v1)

### Additional Breathing Techniques
- Box Breathing (Wu Wei Balance): 4s inhale → 4s hold → 4s exhale → 4s hold
- Embryonic Breathing (Huiyin focus): 6s inhale → 2s hold → 6s exhale → 2s hold  
- Microcosmic Orbit: 6s inhale (rise) → 6s exhale (descend)
- Cleansing Breath: 4s inhale → 8s exhale

### Enhanced Analytics
- Session history tracking
- Weekly/monthly statistics
- Streak counting
- Total breath counters

### Advanced Features
- Custom breathing ratios
- Background music options
- Achievement system
- Data backup/sync

## Success Metrics

### User Engagement
- Session completion rate
- Average session duration
- Return user rate
- Sessions per user per week

### Technical Performance
- App load time < 2 seconds
- Animation frame rate consistency
- Zero crashes during sessions

## Launch Readiness Checklist

- [ ] Core breathing animation system
- [ ] Timer countdown functionality  
- [ ] Audio/haptic feedback integration
- [ ] Local storage implementation
- [ ] Settings screen
- [ ] Responsive design testing
- [ ] Cross-browser compatibility
- [ ] Performance optimization

---

**Product Vision**: Create the most intuitive, distraction-free breathing app that helps users develop consistent Natural Taoist Breath practice through beautiful visual guidance and seamless user experience.