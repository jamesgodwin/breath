import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedDuration, setSelectedDuration] = useState(60); // Default 1 minute in seconds
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start' | 'session' | 'complete' | 'settings'
  const [selectedPattern, setSelectedPattern] = useState(() => {
    try {
      const saved = localStorage.getItem('taoistBreathSelectedPattern');
      return saved ? saved : 'naturalTaoist';
    } catch (error) {
      return 'naturalTaoist';
    }
  });
  
  
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


  useEffect(() => {
    try {
      localStorage.setItem('taoistBreathSelectedPattern', selectedPattern);
    } catch (error) {
      console.log('Error saving selected pattern:', error);
    }
  }, [selectedPattern]);


  // Breathing patterns configuration
  const breathingPatterns = {
    naturalTaoist: {
      name: "Natural Taoist Breath",
      subtitle: "Inhale 4s → Exhale 6s",
      description: "The most fundamental Taoist practice. Simple and calming.",
      phases: [
        { type: 'inhale', duration: 4, text: 'Inhale' },
        { type: 'exhale', duration: 6, text: 'Exhale' }
      ]
    },
    boxBreathing: {
      name: "Box Breathing (Wu Wei Balance)", 
      subtitle: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s",
      description: "Restores balance, steadiness.",
      phases: [
        { type: 'inhale', duration: 4, text: 'Inhale' },
        { type: 'hold', duration: 4, text: 'Hold' },
        { type: 'exhale', duration: 4, text: 'Exhale' },
        { type: 'hold', duration: 4, text: 'Hold' }
      ]
    },
    embryonicBreathing: {
      name: "Embryonic Breathing (Deep focus)",
      subtitle: "Inhale 6s → Hold 2s → Exhale 6s → Hold 2s", 
      description: "Classic Taoist rhythm for centring and focus.",
      phases: [
        { type: 'inhale', duration: 6, text: 'Inhale' },
        { type: 'hold', duration: 2, text: 'Hold' },
        { type: 'exhale', duration: 6, text: 'Exhale' },
        { type: 'hold', duration: 2, text: 'Hold' }
      ]
    },
    microcosmicOrbit: {
      name: "Microcosmic Orbit (Circulation breath)",
      subtitle: "Inhale 6s (rise) → Exhale 6s (descend).",
      description: "Energy Circulation",
      phases: [
        { type: 'inhale', duration: 6, text: 'Inhale' },
        { type: 'exhale', duration: 6, text: 'Exhale' }
      ]
    },
    cleansingBreath: {
      name: "Cleansing Breath",
      subtitle: "Inhale 4s → Exhale 8s",
      description: "Used for releasing stress and calming heart-mind.",
      phases: [
        { type: 'inhale', duration: 4, text: 'Inhale' },
        { type: 'exhale', duration: 8, text: 'Exhale' }
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
    const [holdCountdown, setHoldCountdown] = useState(null); // For countdown during hold phases

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
          setCurrentPhaseIndex(targetPhaseIndex);
        }

        // Calculate precise progress within current phase
        const phaseElapsedTime = positionInCycle - phaseStartTime;
        const phaseProgress = Math.min(1, phaseElapsedTime / currentPattern.phases[targetPhaseIndex].duration);

        // Update animation based on phase type
        const phaseType = currentPattern.phases[targetPhaseIndex].type;
        if (phaseType === 'inhale') {
          setAnimationProgress(phaseProgress); // 0 to 1 (expand)
          setHoldCountdown(null); // Clear countdown
        } else if (phaseType === 'exhale') {
          setAnimationProgress(1 - phaseProgress); // 1 to 0 (contract)
          setHoldCountdown(null); // Clear countdown
        } else if (phaseType === 'hold') {
          // Hold at current position - don't change animationProgress
          // Calculate countdown for hold phases: Hold, 3, 2, 1
          const timeRemainingInPhase = currentPattern.phases[targetPhaseIndex].duration - phaseElapsedTime;
          
          if (phaseElapsedTime < 1) {
            // First second: show "Hold"
            setHoldCountdown("Hold");
          } else {
            // Remaining seconds: show countdown 3,2,1
            const countdown = Math.max(1, Math.ceil(timeRemainingInPhase));
            setHoldCountdown(countdown);
          }
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
            className="absolute rounded-full border"
            style={{
              width: '300px',
              height: '300px',
              backgroundColor: '#232323',
              borderColor: '#404040',
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
              {currentPhase.type === 'hold' && holdCountdown !== null ? holdCountdown : currentPhase.text}
            </span>
          </div>
        </div>

        {/* Controls (shown on touch) */}
        {showControls && (
          <>
            {isRunning ? (
              /* Running State - Pause Button */
              <button
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10"
                style={{
                  width: '56px',
                  height: '56px',
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
              /* Paused State - Centered Play Button with Stop Button to Left */
              <>
                {/* Play Button - Centered above timer */}
                <button
                  className="absolute bottom-32 left-1/2 transform -translate-x-1/2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#E5E5E5',
                    border: 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePause();
                  }}
                >
                  <img src="/images/play.svg" alt="Play" width="32" height="32" />
                </button>

                {/* Stop Button - Offset to the left */}
                <button
                  className="absolute bottom-32 left-1/2 transform -translate-x-1/2 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderColor: '#404040',
                    backgroundColor: '#171717',
                    marginLeft: '-80px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStop();
                  }}
                >
                  <img src="/images/stop.svg" alt="Stop" width="24" height="24" />
                </button>
              </>
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
    const handleClose = () => {
      setCurrentScreen('start');
    };

    const handlePatternSelect = (patternKey) => {
      setSelectedPattern(patternKey);
    };

    return (
      <div 
        className="relative w-screen max-w-sm mx-auto md:border-x md:border-app-btn-stroke"
        style={{ 
          height: 'calc(var(--vh, 1vh) * 100)',
          backgroundColor: '#141414'
        }}
      >
        
        {/* Close Button - Fixed position */}
        <button
          className="absolute z-10 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            top: '24px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderColor: '#404040',
            backgroundColor: 'transparent'
          }}
          onClick={handleClose}
        >
          <img src="/images/close.svg" alt="Close" width="24" height="24" />
        </button>

        {/* Scrollable Content */}
        <div 
          className="overflow-y-auto"
          style={{ 
            height: 'calc(var(--vh, 1vh) * 100)',
            paddingTop: '105px',
            paddingBottom: '24px',
            paddingLeft: '24px',
            paddingRight: '24px'
          }}
        >
          
          {/* Breathing Exercise Cards */}
          <div style={{ width: '342px' }}>
            {Object.entries(breathingPatterns).map(([key, pattern], index) => (
              <div
                key={key}
                className="rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-98"
                style={{
                  padding: '12px',
                  marginBottom: index === Object.keys(breathingPatterns).length - 1 ? '0' : '18px',
                  backgroundColor: selectedPattern === key ? '#171717' : 'transparent',
                  borderColor: selectedPattern === key ? '#f5f5f5' : '#404040',
                  minHeight: selectedPattern === key && key === 'naturalTaoist' ? '117px' : 'auto'
                }}
                onClick={() => handlePatternSelect(key)}
              >
                <h3 
                  className="font-headline font-semibold"
                  style={{ 
                    fontSize: '18px', 
                    color: '#f5f5f5',
                    marginBottom: '4px'
                  }}
                >
                  {pattern.name}
                </h3>
                <p 
                  className="font-body"
                  style={{ 
                    fontSize: '14px', 
                    color: '#a3a3a3',
                    lineHeight: '20px',
                    marginBottom: '4px'
                  }}
                >
                  {pattern.subtitle}
                </p>
                <p 
                  className="font-body"
                  style={{ 
                    fontSize: '14px', 
                    color: '#a3a3a3',
                    lineHeight: '20px'
                  }}
                >
                  {pattern.description}
                </p>
              </div>
            ))}
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
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 text-center">
        <h1 className="font-headline font-semibold text-lg leading-none text-app-headline m-0">
          {breathingPatterns[selectedPattern].name}
        </h1>
        <p className="font-body text-sm leading-5 text-app-body mt-2 whitespace-nowrap">
          {breathingPatterns[selectedPattern].subtitle}
        </p>
        <p className="font-body text-sm leading-5 text-app-body mt-2 px-4">
          {breathingPatterns[selectedPattern].description}
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
