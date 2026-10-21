# 🧘‍♂️ Natural Taoist Breath

**Transform Your Mind in Minutes**

A modern React-based breathing meditation app that brings the ancient wisdom of Taoist breathing techniques to your fingertips. Experience instant calm, mental clarity, and stress relief through scientifically-backed breathing patterns.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.3.1-blue.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

## 🌟 Live Demo

[Try the app now →](https://taoistbreath.com) taoistbreath.com

## ✨ Features

### 🫁 **Breathing Patterns**
- **Natural Taoist Breath**: 4 seconds inhale → 6 seconds exhale (promotes calm & balance)
- **Wu Wei Balance**: Box breathing (4-4-4-4) for focused meditation

### ⚙️ **Customizable Experience**
- Multiple breathing pattern selection
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
- Automatic pause on tab visibility changes; manual resume
- Session tracking with completion counters

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/breath.git
cd breath

# Install dependencies
nvm use
npm ci

# Start development server
npm start

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## 🛠️ Development

### Prerequisites
- Node.js 22.23.4 (`nvm use`; also pinned for Netlify)
- npm (the lockfile and Netlify installation use npm)
- Modern browser: Safari 16.4+, Chrome/Edge 111+, or Firefox 128+ for Tailwind 4 CSS

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Runs the timer and saved-settings regression tests once |
| `npm run test:watch` | Watches regression tests during development |
| `npm run preview` | Serves the production build locally |
| `npm run build` | Builds the app for production |

### Project Structure

```
src/
├── App.jsx          # Main application component (single-file architecture)
├── App.css         # Custom styles and Tailwind overrides
├── index.jsx        # React DOM rendering
└── index.css       # Global styles and Tailwind imports

public/
├── images/         # SVG icons and decorative elements
├── favicons/       # PWA icons for all devices
└── manifest.json   # PWA configuration
```

## 🏗️ Technical Architecture

- **Framework**: React 19.3.1 with functional components and hooks
- **Styling**: Tailwind CSS 4.3.3 with custom design system
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Vite 8 with React and Vitest
- **PWA**: Web app manifest for standalone installation (no service worker)

### Key Design Decisions

- **Single Component Architecture**: Entire app in `src/App.jsx` for simplicity and performance
- **Precise Timing**: Uses `Date.now()` instead of intervals for sub-second accuracy
- **Mobile-First**: Responsive design optimized for smartphone usage
- **Minimal Dependencies**: Leverages browser APIs over external libraries

## 🌐 Browser Support

- **Chrome**: Full support for all features
- **Safari**: Full support on all devices
- **Firefox**: Full support for all features
- **Edge**: Full support for all features

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
## Deployment verification

Netlify builds the `main` branch with Node 22.23.4, runs `npm test`, then publishes Vite's `build/` directory. `.npmrc` enforces the exact Node engine; run `nvm use` before installing dependencies. The regression suite covers saved settings, phase timing, pause/resume, backgrounding, stopping, completion counts and restarting.

The Vite security migration was published as `d2b1ffb` on 21 October 2026. Netlify confirmed production publication, and the live JS/CSS matched the tested build. Browser checks verified a completed breathing session and saved-duration restoration. The existing manifest references a missing 512px icon; physical iOS testing remains separate from these Chromium checks.
