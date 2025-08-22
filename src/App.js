import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedDuration, setSelectedDuration] = useState(60); // Default 1 minute in seconds
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'session' | 'complete' | 'settings'
  const [selectedPattern] = useState('naturalTaoist');
  
  // Audio and haptic settings
  const [audioEnabled, setAudioEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('taoistBreathAudioEnabled');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });
  
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('taoistBreathHapticEnabled');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });
  
  const [audioVolume, setAudioVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('taoistBreathAudioVolume');
      return saved ? parseFloat(saved) : 0.3;
    } catch (error) {
      return 0.3;
    }
  });
  
  // Audio context for sound generation
  const [audioContext, setAudioContext] = useState(null);
  
  // Load completed sessions from localStorage on app start
  const [completedBreaths, setCompletedBreaths] = useState(() => {
    try {
      const saved = localStorage.getItem('taoistBreathSessions');
      return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      console.log('Error loading saved sessions:', error);
      return 0;
    }
  });

  // Save to localStorage whenever completedBreaths changes
  useEffect(() => {
    try {
      localStorage.setItem('taoistBreathSessions', completedBreaths.toString());
    } catch (error) {
      console.log('Error saving sessions:', error);
    }
  }, [completedBreaths]);

  // Save audio/haptic settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taoistBreathAudioEnabled', JSON.stringify(audioEnabled));
    } catch (error) {
      console.log('Error saving audio setting:', error);
    }
  }, [audioEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('taoistBreathHapticEnabled', JSON.stringify(hapticEnabled));
    } catch (error) {
      console.log('Error saving haptic setting:', error);
    }
  }, [hapticEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('taoistBreathAudioVolume', audioVolume.toString());
    } catch (error) {
      console.log('Error saving audio volume:', error);
    }
  }, [audioVolume]);

  // Initialize audio context on first user interaction
  const initializeAudioContext = () => {
    if (!audioContext && audioEnabled) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
        return ctx;
      } catch (error) {
        console.log('Audio context not supported:', error);
        return null;
      }
    }
    return audioContext;
  };

  // Generate transition sound
  const playTransitionSound = (frequency = 440, duration = 0.1) => {
    if (!audioEnabled) return;
    
    const ctx = initializeAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(audioVolume * 0.1, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Trigger haptic feedback
  const triggerHaptic = () => {
    if (!hapticEnabled) return;
    
    try {
      if (navigator.vibrate) {
        navigator.vibrate(50); // 50ms gentle vibration
      }
    } catch (error) {
      console.log('Vibration not supported:', error);
    }
  };

  // Breathing patterns configuration
  const breathingPatterns = {
    naturalTaoist: {
      name: "Natural Taoist Breath",
      subtitle: "Inhale 4s → Exhale 6s",
      phases: [
        { type: 'inhale', duration: 4, text: 'Inhale' },
        { type: 'exhale', duration: 6, text: 'Exhale' }
      ]
    },
    boxBreathing: {
      name: "Wu Wei Balance", 
      subtitle: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s",
      phases: [
        { type: 'inhale', duration: 4, text: 'Inhale' },
        { type: 'hold', duration: 4, text: 'Hold' },
        { type: 'exhale', duration: 4, text: 'Exhale' },
        { type: 'hold', duration: 4, text: 'Hold' }
      ]
    }
  };

  // Duration options: 30s, 1min, 1:30, 2min, 3min, 4min, 5min ... 20min
  const generateDurationOptions = () => {
    const options = [
      30,   // 30s
      60,   // 1min
      90,   // 1:30
      120,  // 2min
    ];
    
    // Add 3min to 20min (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20)
    for (let minutes = 3; minutes <= 20; minutes++) {
      options.push(minutes * 60);
    }
    
    return options;
  };

  const durationOptions = generateDurationOptions();

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectDuration = (duration) => {
    setSelectedDuration(duration);
    setIsDropdownOpen(false);
  };

  const handleStart = () => {
    console.log(`Starting session: ${breathingPatterns[selectedPattern].name} for ${selectedDuration}s`);
    setCurrentScreen('session');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  // Simple viewport adjustment for mobile browsers
  useEffect(() => {
    // Set consistent viewport handling
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Breathing Session Component
  const BreathingSession = () => {
    const [isRunning, setIsRunning] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [sessionStartTime] = useState(Date.now());
    const [pausedTime, setPausedTime] = useState(0); // Track total paused time
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [animationProgress, setAnimationProgress] = useState(0); // 0 to 1
    const [displayTimeLeft, setDisplayTimeLeft] = useState(selectedDuration);
    const [, setBreathCount] = useState(0);
    const [lastCompletedCycle, setLastCompletedCycle] = useState(-1);

    const currentPattern = breathingPatterns[selectedPattern];
    const currentPhase = currentPattern.phases[currentPhaseIndex];

    // Handle page visibility changes (background/foreground)
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Page is hidden (user switched tabs, minimized, etc.)
          if (isRunning) {
            setIsRunning(false);
            setPauseStartTime(Date.now());
            setShowControls(true); // Show controls so user can see paused state when they return
          }
        }
        // Note: We don't auto-resume when page becomes visible - user should manually resume
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [isRunning]);

    useEffect(() => {
      if (!isRunning) return;

      const interval = setInterval(() => {
        const now = Date.now();
        const elapsedTime = (now - sessionStartTime - pausedTime) / 1000; // Convert to seconds
        const remainingTime = selectedDuration - elapsedTime;

        // Update display timer
        setDisplayTimeLeft(Math.max(0, remainingTime));

        // Calculate total cycle duration
        const cycleDuration = currentPattern.phases.reduce((sum, phase) => sum + phase.duration, 0);
        
        // Find current position in the cycle and count completed cycles
        const positionInCycle = elapsedTime % cycleDuration;
        
        // Count individual breaths (inhale + exhale = 1 breath)
        // For Natural Taoist: 4s inhale + 6s exhale = 10s per breath
        const totalBreathsInSession = Math.floor(elapsedTime / cycleDuration);
        
        // Update breath count when we complete a new breath
        if (totalBreathsInSession > lastCompletedCycle) {
          setBreathCount(totalBreathsInSession);
          setLastCompletedCycle(totalBreathsInSession);
        }

        // Check if session is complete
        if (remainingTime <= 0) {
          // Increment the total session count (automatically saved to localStorage)
          const newSessionCount = completedBreaths + 1;
          setCompletedBreaths(newSessionCount);
          setCurrentScreen('complete');
          return;
        }

        // Calculate which phase we should be in and progress within that phase
        let totalPhaseTime = 0;
        let targetPhaseIndex = 0;
        let phaseStartTime = 0;

        for (let i = 0; i < currentPattern.phases.length; i++) {
          if (positionInCycle >= totalPhaseTime && positionInCycle < totalPhaseTime + currentPattern.phases[i].duration) {
            targetPhaseIndex = i;
            phaseStartTime = totalPhaseTime;
            break;
          }
          totalPhaseTime += currentPattern.phases[i].duration;
        }

        // Update phase if needed
        if (targetPhaseIndex !== currentPhaseIndex) {
          const newPhase = currentPattern.phases[targetPhaseIndex];
          
          // Trigger audio on phase transitions
          if (newPhase.type === 'inhale') {
            playTransitionSound(523, 0.15); // C5 note for inhale
            triggerHaptic(); // Haptic feedback on inhale start
          } else if (newPhase.type === 'exhale') {
            playTransitionSound(392, 0.15); // G4 note for exhale
          }
          
          setCurrentPhaseIndex(targetPhaseIndex);
        }

        // Calculate precise progress within current phase
        const phaseElapsedTime = positionInCycle - phaseStartTime;
        const phaseProgress = Math.min(1, phaseElapsedTime / currentPattern.phases[targetPhaseIndex].duration);

        // Update animation based on phase type
        const phaseType = currentPattern.phases[targetPhaseIndex].type;
        if (phaseType === 'inhale') {
          setAnimationProgress(phaseProgress); // 0 to 1 (expand)
        } else if (phaseType === 'exhale') {
          setAnimationProgress(1 - phaseProgress); // 1 to 0 (contract)
        } else if (phaseType === 'hold') {
          // Hold at current position - don't change animationProgress
        }

      }, 16); // ~60fps for smooth updates

      return () => clearInterval(interval);
    }, [isRunning, sessionStartTime, pausedTime, currentPattern, currentPhaseIndex, lastCompletedCycle]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [pauseStartTime, setPauseStartTime] = useState(null);

    const togglePause = () => {
      if (isRunning) {
        // Pausing - record when we paused
        setPauseStartTime(Date.now());
        setIsRunning(false);
      } else {
        // Resuming - add the paused duration to total paused time
        const now = Date.now();
        if (pauseStartTime) {
          setPausedTime(prev => prev + (now - pauseStartTime));
        }
        setPauseStartTime(null);
        setIsRunning(true);
        setShowControls(false); // Hide controls when resuming
      }
    };

    const handleScreenTouch = () => {
      setShowControls(!showControls);
    };

    const handleStop = () => {
      setCurrentScreen('start');
    };

    // Calculate circle sizes
    const outerRadius = 150; // 300px diameter = 150px radius
    const innerRadius = 55.5; // 111px diameter = 55.5px radius
    const guideRadius = innerRadius + (outerRadius - innerRadius) * animationProgress;

    return (
      <div 
        className="relative w-screen bg-app-bg overflow-hidden max-w-sm mx-auto md:border-x md:border-app-btn-stroke cursor-pointer"
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        onClick={handleScreenTouch}
      >

        {/* Breathing Animation */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Outer Circle (Fixed) */}
          <div 
            className="absolute rounded-full border-none"
            style={{
              width: '300px',
              height: '300px',
              backgroundColor: '#1A1A1A',
              left: '-150px',
              top: '-150px'
            }}
          />
          
          {/* Animated Guide Circle */}
          <div 
            className="absolute rounded-full border-none"
            style={{
              width: `${guideRadius * 2}px`,
              height: `${guideRadius * 2}px`,
              backgroundColor: '#484848',
              left: `-${guideRadius}px`,
              top: `-${guideRadius}px`
            }}
          />
          
          {/* Inner Circle (Fixed) */}
          <div 
            className="absolute rounded-full border-none flex items-center justify-center"
            style={{
              width: '111px',
              height: '111px',
              backgroundColor: '#737373',
              left: '-55.5px',
              top: '-55.5px'
            }}
          >
            <span className="font-button font-bold text-lg text-white">
              {currentPhase.text}
            </span>
          </div>
        </div>

        {/* Controls (shown on touch) */}
        {showControls && (
          <>
            {isRunning ? (
              /* Running State - Pause Button */
              <button
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10"
                style={{
                  borderColor: '#404040',
                  backgroundColor: '#171717'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePause();
                }}
              >
                <img src="/images/pause.svg" alt="Pause" width="24" height="24" />
              </button>
            ) : (
              /* Paused State - Play and Stop Buttons */
              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-center gap-8 z-10">
                {/* Stop Button */}
                <button
                  className="w-14 h-14 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    borderColor: '#404040',
                    backgroundColor: '#171717'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStop();
                  }}
                >
                  <img src="/images/stop.svg" alt="Stop" width="24" height="24" />
                </button>

                {/* Play Button */}
                <button
                  className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: '#E5E5E5',
                    border: 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePause();
                  }}
                >
                  <img src="/images/play.svg" alt="Play" width="45" height="45" />
                </button>
              </div>
            )}

            {/* Countdown Timer */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="px-6 py-3 bg-app-element-bg border border-app-btn-stroke rounded-full">
                <span className="font-headline font-medium text-lg text-app-btn-bg">
                  {formatTime(displayTimeLeft)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Settings Screen Component
  const SettingsScreen = () => {
    const handleBack = () => {
      setCurrentScreen('start');
    };

    const toggleAudio = () => {
      setAudioEnabled(!audioEnabled);
    };

    const toggleHaptic = () => {
      setHapticEnabled(!hapticEnabled);
    };

    const handleVolumeChange = (e) => {
      setAudioVolume(parseFloat(e.target.value));
    };

    // Check if vibration is supported
    const vibrationSupported = 'vibrate' in navigator;

    return (
      <div className="relative w-screen bg-app-bg overflow-hidden max-w-sm mx-auto md:border-x md:border-app-btn-stroke flex flex-col"
           style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        
        {/* Header */}
        <div className="flex-none pt-6 pb-4 px-6 flex items-center">
          <button
            className="w-10 h-10 rounded-full border border-app-btn-stroke bg-transparent flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-app-element-bg active:scale-95"
            onClick={handleBack}
          >
            <img src="/images/chevron-up.svg" alt="Back" width="16" height="16" style={{ transform: 'rotate(-90deg)' }} />
          </button>
          <h1 className="font-headline font-semibold text-xl text-app-headline ml-4">
            Settings
          </h1>
        </div>

        {/* Settings Content */}
        <div className="flex-1 px-6 space-y-6">
          
          {/* Sound Settings */}
          <div className="space-y-4">
            <h2 className="font-headline font-medium text-lg text-app-headline">
              Sound
            </h2>
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-body text-base text-app-body">
                Transition Sounds
              </span>
              <button
                className={`w-12 h-6 rounded-full border transition-all duration-200 ${
                  audioEnabled 
                    ? 'bg-app-btn-bg border-app-btn-bg' 
                    : 'bg-app-element-bg border-app-btn-stroke'
                }`}
                onClick={toggleAudio}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    audioEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Volume Control */}
            {audioEnabled && (
              <div className="space-y-2">
                <label className="font-body text-sm text-app-body">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-app-element-bg rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>

          {/* Haptic Feedback Settings */}
          {vibrationSupported && (
            <div className="space-y-4">
              <h2 className="font-headline font-medium text-lg text-app-headline">
                Haptic Feedback
              </h2>
              
              <div className="flex items-center justify-between">
                <span className="font-body text-base text-app-body">
                  Vibrate on Inhale
                </span>
                <button
                  className={`w-12 h-6 rounded-full border transition-all duration-200 ${
                    hapticEnabled 
                      ? 'bg-app-btn-bg border-app-btn-bg' 
                      : 'bg-app-element-bg border-app-btn-stroke'
                  }`}
                  onClick={toggleHaptic}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      hapticEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Pattern Info */}
          <div className="space-y-4">
            <h2 className="font-headline font-medium text-lg text-app-headline">
              Current Pattern
            </h2>
            <div className="p-4 bg-app-element-bg border border-app-btn-stroke rounded-lg">
              <h3 className="font-headline font-medium text-base text-app-btn-bg">
                {breathingPatterns[selectedPattern].name}
              </h3>
              <p className="font-body text-sm text-app-body mt-1">
                {breathingPatterns[selectedPattern].subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Session Completion Component
  const CompletionScreen = () => {
    const handleContinue = () => {
      setCurrentScreen('start');
    };

    const handleShare = async () => {
      const shareData = {
        title: 'Natural Taoist Breath - Transform Your Mind in Minutes',
        text: `🧘‍♂️ Just completed ${completedBreaths} breathing session${completedBreaths === 1 ? '' : 's'}!\n\n✨ Discovered the ancient art of Natural Taoist Breathing:\n• 4 seconds inhale → 6 seconds exhale\n• Instant calm & mental clarity\n• Reduces stress & anxiety naturally\n• Just minutes a day for profound results\n\n🌟 Experience the transformation yourself - try this free breathing app:`,
        url: 'https://taoistbreath.com'
      };

      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback for browsers that don't support Web Share API
          const shareText = `${shareData.text}\n\n${shareData.url}`;
          await navigator.clipboard.writeText(shareText);
          
          // Optional: Show a brief success message
          console.log('Share message copied to clipboard!');
          // You could add a toast notification here in the future
        }
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    };

    return (
      <div className="relative w-screen bg-app-bg overflow-hidden max-w-sm mx-auto md:border-x md:border-app-btn-stroke flex flex-col"
           style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        {/* Breath Count Display */}
        <div className="flex-none pt-6 pb-4 text-center">
          <div className="font-button font-bold text-5xl text-white leading-none">
            {completedBreaths}
          </div>
          <div className="font-headline font-medium text-xl text-white mt-1">
            Breathing Sessions
          </div>
        </div>

        {/* Decorative Image */}
        <div className="flex items-center justify-center px-8 py-4" style={{ height: 'calc(var(--vh, 1vh) * 100 - 280px)' }}>
          <img 
            src="/images/breath_end.png" 
            alt="Decorative breath element" 
            className="object-contain max-w-full max-h-full"
          />
        </div>

        {/* Buttons Container */}
        <div className="flex-none pb-12 px-6 space-y-4">
          {/* Continue Button */}
          <button
            className="w-full h-12 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#e5e5e5',
              borderColor: '#404040'
            }}
            onClick={handleContinue}
          >
            <span className="font-button font-medium text-lg text-app-btn-text">
              Continue
            </span>
          </button>

          {/* Share Button */}
          <div className="flex justify-center">
            <button
              className="w-28 h-10 rounded-full border flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'rgba(23, 23, 23, 0.7)',
                borderColor: '#404040'
              }}
              onClick={handleShare}
            >
              <img src="/images/share.svg" alt="Share" width="14" height="14" />
              <span className="font-headline font-medium text-base" style={{ color: '#e5e5e5' }}>
                Share
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentScreen === 'session') {
    return <BreathingSession />;
  }

  if (currentScreen === 'complete') {
    return <CompletionScreen />;
  }

  if (currentScreen === 'settings') {
    return <SettingsScreen />;
  }

  return (
    <div className="relative w-screen bg-app-bg overflow-hidden max-w-sm mx-auto md:border-x md:border-app-btn-stroke" 
         style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Settings Icon */}
      <button 
        className="absolute top-6 right-6 w-14 h-14 border border-app-btn-stroke rounded-full bg-transparent text-app-headline flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-app-element-bg active:scale-95"
        onClick={handleSettings}
      >
        <img src="/images/slider.svg" alt="Settings" width="24" height="24" />
      </button>

      {/* Title Section */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 text-center">
        <h1 className="font-headline font-semibold text-lg leading-none text-app-headline m-0">
          Natural Taoist Breath
        </h1>
        <p className="font-body text-sm leading-5 text-app-body mt-2">
          Inhale 4s → Exhale 6s
        </p>
      </div>

      {/* Start Button */}
      <button 
        className="absolute bottom-48 left-1/2 transform -translate-x-1/2 w-32 h-32 border-none rounded-full bg-app-btn-bg text-app-btn-text font-button font-bold text-2xl cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
        style={{boxShadow: '0px 0px 20px 20px rgba(86, 86, 86, 0.25)'}}
        onClick={handleStart}
      >
        Start
      </button>

      {/* Duration Selector */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
        <div className="relative" data-dropdown>
          <div 
            className="w-28 h-11 bg-app-element-bg border border-app-btn-stroke rounded-full flex items-center justify-between px-4 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="font-headline font-medium text-lg text-app-btn-bg">
              {formatDuration(selectedDuration)}
            </span>
            <div className="flex flex-col gap-0">
              <button 
                className="bg-transparent border-none text-app-body cursor-pointer p-0 flex items-center justify-center transition-colors duration-200 hover:text-app-headline active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
              >
                <img src="/images/chevron-up.svg" alt="Up" width="16" height="16" />
              </button>
              <button 
                className="bg-transparent border-none text-app-body cursor-pointer p-0 flex items-center justify-center transition-colors duration-200 hover:text-app-headline active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
              >
                <img src="/images/chevron-down.svg" alt="Down" width="16" height="16" />
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-32 max-h-60 bg-app-element-bg border border-app-btn-stroke rounded-lg overflow-hidden shadow-lg z-50">
              <div className="overflow-y-auto max-h-60">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    className={`w-full px-4 py-3 text-left font-headline font-medium text-base transition-colors duration-200 border-none cursor-pointer ${
                      duration === selectedDuration 
                        ? 'bg-app-btn-stroke text-app-btn-bg' 
                        : 'bg-transparent text-app-btn-bg hover:bg-app-btn-stroke'
                    }`}
                    onClick={() => selectDuration(duration)}
                  >
                    {formatDuration(duration)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
