# 🧘‍♂️ Natural Taoist Breath

**Transform Your Mind in Minutes**

A modern React-based breathing meditation app that brings the ancient wisdom of Taoist breathing techniques to your fingertips. Experience instant calm, mental clarity, and stress relief through scientifically-backed breathing patterns.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

## 🌟 Live Demo

[Try the app now →](https://taoistbreath.com) *(Add your deployment URL here)*

## ✨ Features

### 🫁 **Breathing Patterns**
- **Natural Taoist Breath**: 4 seconds inhale → 6 seconds exhale (promotes calm & balance)
- **Wu Wei Balance**: Box breathing (4-4-4-4) for focused meditation

### 🔊 **Audio Feedback**
- Web Audio API integration with synthesized transition tones
- C5 (523Hz) for inhale phases, G4 (392Hz) for exhale phases
- Adjustable volume controls with smooth fade-in/fade-out

### 📳 **Haptic Feedback**
- Gentle 50ms vibrations on inhale phase start
- Works on mobile devices with Vibration API support
- Device detection with intelligent UI hiding for unsupported browsers

### ⚙️ **Customizable Experience**
- Toggle audio and haptic feedback independently
- Volume slider for personalized sound levels
- Settings persist across sessions via localStorage
- Duration selector: 30 seconds to 20 minutes

### 📱 **Progressive Web App**
- Install on home screen for app-like experience
- Standalone display mode optimized for mobile
- Custom app icons and splash screens
- Works offline after initial load

### 🎯 **Precision & Performance**
- `Date.now()` based timing system for microsecond accuracy
- 60fps animation updates for smooth visual guidance
- Automatic pause/resume on tab visibility changes
- Session tracking with completion counters

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/breath.git
cd breath

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🛠️ Development

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm or yarn package manager

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (one-way operation) |

### Project Structure

```
src/
├── App.js          # Main application component (single-file architecture)
├── App.css         # Custom styles and Tailwind overrides
├── index.js        # React DOM rendering
└── index.css       # Global styles and Tailwind imports

public/
├── images/         # SVG icons and decorative elements
├── favicons/       # PWA icons for all devices
└── manifest.json   # PWA configuration
```

## 🏗️ Technical Architecture

- **Framework**: React 19.1.1 with functional components and hooks
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **Audio**: Web Audio API for real-time sound synthesis
- **Haptics**: Vibration API for mobile tactile feedback
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Create React App with zero-configuration setup
- **PWA**: Service worker and manifest for app-like experience

### Key Design Decisions

- **Single Component Architecture**: Entire app in `src/App.js` for simplicity and performance
- **Precise Timing**: Uses `Date.now()` instead of intervals for sub-second accuracy
- **Mobile-First**: Responsive design optimized for smartphone usage
- **Minimal Dependencies**: Leverages browser APIs over external libraries

## 🌐 Browser Support

- **Chrome**: Full support including haptic feedback
- **Safari**: Full support on iOS with haptic feedback on physical devices
- **Firefox**: Audio and visual features (haptic feedback varies by device)
- **Edge**: Full audio and visual support

**Note**: Haptic feedback requires a mobile device; it won't work in desktop browsers or simulators.

## 🎨 Customization

The app uses a custom Tailwind configuration with app-specific color palette:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'app-bg': '#141414',
      'app-btn-bg': '#e5e5e5',
      'app-element-bg': '#262626',
      // ... see tailwind.config.js for full palette
    }
  }
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and component patterns
- Test audio and haptic features on actual mobile devices
- Maintain the precise timing system when modifying breath logic
- Use existing Tailwind classes and custom CSS variables
- Update this README if adding new features

### Reporting Issues

Please use the [GitHub Issues](https://github.com/yourusername/breath/issues) page to report bugs or suggest features. Include:

- Browser and device information
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 James Godwin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 🙏 Acknowledgments

- Inspired by ancient Taoist breathing techniques
- Built with modern web technologies
- Icons and visual elements designed for clarity and calm
- Community feedback and contributions

## ⚠️ Health Disclaimer

This app is designed for educational and wellness purposes. The breathing techniques provided are generally safe for healthy individuals. However, if you have any respiratory conditions, heart problems, or other health concerns, please consult with a healthcare professional before using breathing exercises.

---

**Made with ❤️ for Taoism and open source**

*Star this repository if you find it helpful!*