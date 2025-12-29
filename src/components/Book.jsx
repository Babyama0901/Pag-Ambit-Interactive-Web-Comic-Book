import React, { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';

// MediaPage Component
const MediaPage = ({ src, alt, pageNum, speechBubbleSrc, forceShow, onEnableGlobal, animatedClips }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  // Toggle visibility on click
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent page flip
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }

    if (isLocked) {
      // If locked, unlock and hide
      setIsLocked(false);
      setShowOverlay(false);
      if (onEnableGlobal) onEnableGlobal(false);
    } else {
      // Toggle
      setShowOverlay(!showOverlay);
    }
  };

  const handlePressStart = () => {
    longPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setIsLocked(true);
      setShowOverlay(true);
      if (onEnableGlobal) onEnableGlobal(true);
      // Optional: Visual feedback for lock
    }, 800); // 800ms for long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  return (
    <div className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0">
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center select-none">
        <img
          src={`${import.meta.env.BASE_URL}Watermark.png`}
          alt="Watermark"
          className="w-[80%] h-auto object-contain opacity-20"
        />
      </div>

      <div className={`relative w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Base Image (Index 0) */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-fill absolute inset-0 z-0"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
        />

        {/* Animated Clips (Index 1) */}
        {animatedClips && animatedClips.map((clip, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none z-10"
            style={{
              left: `${clip.x}px`,
              top: `${clip.y}px`,
              width: `${clip.width}px`,
              height: `${clip.height}px`,
            }}
          >
            <video
              src={`${import.meta.env.BASE_URL}${clip.src}`}
              className="w-full h-full object-fill"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        ))}

        {/* Speech Bubbles (Index 2) */}
        {speechBubbleSrc && (
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${showOverlay || forceShow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={handleButtonClick}
          >
            <img
              src={`${import.meta.env.BASE_URL}${speechBubbleSrc}`}
              alt={`Speech Bubble for Page ${pageNum}`}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Helper button to show speech bubble hint if hidden */}
        {!showOverlay && !isLocked && speechBubbleSrc && (
          <div
            className="absolute top-4 right-4 z-30 opacity-50 hover:opacity-100 cursor-pointer animate-pulse"
            onClick={handleButtonClick}
          >
            <span className="text-2xl drop-shadow-md">💬</span>
          </div>
        )}
      </div>
    </div>
  );
};

function Book() {
  const audioRef = useRef(null);
  const sfxRef = useRef(null); // Separate ref for sound effects
  const bookRef = useRef(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 595, height: 842 }); // Default A4 ratio

  const pages = [
    { src: 'Layout/FRONT BOOK COVER.png', alt: 'Front Cover' },
    {
      src: 'Layout/SCENE 1 - PAGE 1.png',
      alt: 'Scene 1 Page 1',
      animatedClips: [
        { src: 'Animated Clips/SCENE 1 - PAGE 1.mp4', width: 595, height: 842, x: 16, y: 20, sound: 'Sound Effects/Digital Alarm Clock Sound.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 1 - PAGE 2.png',
      alt: 'Scene 1 Page 2',
      animatedClips: [
        { src: 'Animated Clips/SCENE 1 - PAGE 2.mp4', width: 595, height: 842, x: 650, y: 20, sound: 'Sound Effects/Digital Alarm Clock Sound.mp3' }
      ]
    },
    { src: 'Layout/SCENE 1 - PAGE 3.png', alt: 'Scene 1 Page 3' },
    { src: 'Layout/SCENE 1 - PAGE 4.png', alt: 'Scene 1 Page 4' },
    { src: 'Layout/SCENE 1 - PAGE 5.png', alt: 'Scene 1 Page 5' },
    { src: 'Layout/SCENE 2 - PAGE 6.png', alt: 'Scene 2 Page 6' },
    { src: 'Layout/SCENE 2 - PAGE 7.png', alt: 'Scene 2 Page 7' },
    { src: 'Layout/SCENE 2 - PAGE 8.png', alt: 'Scene 2 Page 8' },
    { src: 'Layout/SCENE 2 - PAGE 9.png', alt: 'Scene 2 Page 9' },
    { src: 'Layout/SCENE 2 - PAGE 10.png', alt: 'Scene 2 Page 10' },
    { src: 'Layout/SCENE 3 - PAGE 11.png', alt: 'Scene 3 Page 11' },
    { src: 'Layout/SCENE 3 - PAGE 12.png', alt: 'Scene 3 Page 12' },
    { src: 'Layout/SCENE 4 - PAGE 13.png', alt: 'Scene 4 Page 13' },
    { src: 'Layout/SCENE 4 - PAGE 14.png', alt: 'Scene 4 Page 14' },
    { src: 'Layout/SCENE 4 - PAGE 15.png', alt: 'Scene 4 Page 15' },
    {
      src: 'Layout/SCENE 4 - PAGE 16.png',
      alt: 'Scene 4 Page 16',
      animatedClips: [
        { src: 'Animated Clips/SCENE 4 - PAGE 16.mp4', width: 385, height: 416, x: 105, y: 220, sound: 'Sound Effects/ASMR sketching.mp3' }
      ]
    },
    { src: 'Layout/SCENE 5 - PAGE 17.png', alt: 'Scene 5 Page 17', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 5 - PAGE 17 - DIALOGUE.png' },
    { src: 'Layout/SCENE 5 - PAGE 18.png', alt: 'Scene 5 Page 18' },
    { src: 'Layout/SCENE 5 - PAGE 19.png', alt: 'Scene 5 Page 19', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 5 - PAGE 19 - DIALOGUE.png' },
    { src: 'Layout/SCENE 6 - PAGE 20.png', alt: 'Scene 6 Page 20' },
    { src: 'Layout/SCENE 6 - PAGE 21.png', alt: 'Scene 6 Page 21', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 21 - DIALOGUE.png' },
    { src: 'Layout/SCENE 6 - PAGE 22.png', alt: 'Scene 6 Page 22' },
    { src: 'Layout/SCENE 6 - PAGE 23.png', alt: 'Scene 6 Page 23', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 23 - DIALOGUE.png' },
    { src: 'Layout/SCENE 7 - PAGE 24.png', alt: 'Scene 7 Page 24' },
    {
      src: 'Layout/SCENE 7 - PAGE 25.png',
      alt: 'Scene 7 Page 25',
      animatedClips: [
        { src: 'Animated Clips/SCENE 7 - PAGE 25.mp4', width: 290, height: 338, x: 30, y: 64, sound: 'Sound Effects/Girl Crying sound effect.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 7 - PAGE 26.png',
      alt: 'Scene 7 Page 26',
      animatedClips: [
        { src: 'Animated Clips/SCENE 7 - PAGE 26.mp4', width: 580, height: 277, x: 8, y: 357, sound: 'Sound Effects/Running footsteps.mp3' }
      ]
    },
    { src: 'Layout/SCENE 8 - PAGE 27.png', alt: 'Scene 8 Page 27', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 8 - PAGE 27 - DIALOGUE.png' },
    { src: 'Layout/SCENE 8 - PAGE 28.png', alt: 'Scene 8 Page 28' },
    {
      src: 'Layout/SCENE 9 - PAGE 29.png',
      alt: 'Scene 9 Page 29',
      speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 9 - PAGE 29 - DIALOGUE.png',
      animatedClips: [
        { src: 'Animated Clips/SCENE 9 - PAGE 29.mp4', width: 525, height: 300, x: 35, y: 130, sound: 'Sound Effects/Girl Crying sound effect.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 9 - PAGE 30.png',
      alt: 'Scene 9 Page 30',
      speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 9 - PAGE 30 - DIALOGUE.png',
      animatedClips: [
        { src: 'Animated Clips/SCENE 9 - PAGE 30.mp4', width: 354, height: 170, x: 222, y: 336, sound: 'Sound Effects/iPhone Message Notification.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 10 - PAGE 31.png',
      alt: 'Scene 10 Page 31',
      animatedClips: [
        { src: 'Animated Clips/SCENE 10 - PAGE 31.mp4', width: 485, height: 223, x: 55, y: 489, sound: 'Sound Effects/Cooking sound effect.mp3' }
      ]
    },
    { src: 'Layout/SCENE 10 - PAGE 32.png', alt: 'Scene 10 Page 32' },
    { src: 'Layout/SCENE 11 - PAGE 33.png', alt: 'Scene 11 Page 33', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 33 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 11 - PAGE 34.png',
      alt: 'Scene 11 Page 34',
      speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 34 - DIALOGUE.png',
      animatedClips: [
        { src: 'Animated Clips/SCENE 11 - PAGE 34.mp4', width: 278, height: 414, x: 22, y: 336, sound: 'Sound Effects/Scratching head sound effect.mp3' }
      ]
    },
    { src: 'Layout/SCENE 12 - PAGE 35.png', alt: 'Scene 12 Page 35' },
    { src: 'Layout/SCENE 12 - PAGE 36.png', alt: 'Scene 12 Page 36' },
    { src: 'Layout/SCENE 13 - PAGE 37.png', alt: 'Scene 13 Page 37' },
    { src: 'Layout/SCENE 13 - PAGE 38.png', alt: 'Scene 13 Page 38' },
    { src: 'Layout/SCENE 14 - PAGE 39.png', alt: 'Scene 14 Page 39', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 39 - DIALOGUE.png' },
    { src: 'Layout/SCENE 14 - PAGE 40.png', alt: 'Scene 14 Page 40' },
    { src: 'Layout/SCENE 15 - PAGE 41.png', alt: 'Scene 15 Page 41', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 15 - PAGE 41 - DIALOGUE.png' },
    { src: 'Layout/SCENE 15 - PAGE 42.png', alt: 'Scene 15 Page 42' },
    { src: 'Layout/SCENE 16 - PAGE 43.png', alt: 'Scene 16 Page 43' },
    { src: 'Layout/SCENE 16 - PAGE 44.png', alt: 'Scene 16 Page 44', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 16 - PAGE 44 - DIALOGUE.png' },
    { src: 'Layout/SCENE 17 - PAGE 45.png', alt: 'Scene 17 Page 45' },
    { src: 'Layout/SCENE 17 - PAGE 46.png', alt: 'Scene 17 Page 46', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 17 - PAGE 46 - DIALOGUE.png' },
    { src: 'Layout/SCENE 18 - PAGE 47.png', alt: 'Scene 18 Page 47' },
    { src: 'Layout/SCENE 18 - PAGE 48.png', alt: 'Scene 18 Page 48', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 18 - PAGE 48 - DIALOGUE.png' },
    { src: 'Layout/SCENE 19 - PAGE 49.png', alt: 'Scene 19 Page 49' },
    { src: 'Layout/SCENE 19 - PAGE 50.png', alt: 'Scene 19 Page 50', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 19 - PAGE 50 - DIALOGUE.png' },
    { src: 'Layout/SCENE 20 - PAGE 51.png', alt: 'Scene 20 Page 51', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 20 - PAGE 51 - DIALOGUE.png' },
    { src: 'Layout/SCENE 20 - PAGE 52.png', alt: 'Scene 20 Page 52' },
    { src: 'Layout/SCENE 20 - PAGE 53.png', alt: 'Scene 20 Page 53' },
    { src: 'Layout/SCENE 21 - PAGE 54.png', alt: 'Scene 21 Page 54' },
    { src: 'Layout/SCENE 21 - PAGE 55.png', alt: 'Scene 21 Page 55' },
    { src: 'Layout/SCENE 22 - PAGE 56.png', alt: 'Scene 22 Page 56' },
    { src: 'Layout/SCENE 22 - PAGE 57.png', alt: 'Scene 22 Page 57' },
    { src: 'Layout/SCENE 22 - PAGE 58.png', alt: 'Scene 22 Page 58', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 22 - PAGE 58 - DIALOGUE.png' },
    { src: 'Layout/SCENE 22 - PAGE 59.png', alt: 'Scene 22 Page 59', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 22 - PAGE 59 - DIALOGUE.png' },
    { src: 'Layout/SCENE 22 - PAGE 60.png', alt: 'Scene 22 Page 60' },
    { src: 'Layout/SCENE 23 - PAGE 61.png', alt: 'Scene 23 Page 61', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 23 - PAGE 61 - DIALOGUE.png' },
    { src: 'Layout/SCENE 23 - PAGE 62.png', alt: 'Scene 23 Page 62', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 23 - PAGE 62 - DIALOGUE.png' },
    { src: 'Layout/SCENE 24 - PAGE 63.png', alt: 'Scene 24 Page 63', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 24 - PAGE 63 - DIALOGUE.png' },
    { src: 'Layout/SCENE 24 - PAGE 64.png', alt: 'Scene 24 Page 64', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 24 - PAGE 64 - DIALOGUE.png' },
    { src: 'Layout/SCENE 25 - PAGE 65.png', alt: 'Scene 25 Page 65' },
    { src: 'Layout/SCENE 25 - PAGE 66.png', alt: 'Scene 25 Page 66' },
    { src: 'Layout/SCENE 26 - PAGE 67.png', alt: 'Scene 26 Page 67' },
    { src: 'Layout/SCENE 26 - PAGE 68.png', alt: 'Scene 26 Page 68' },
    { src: 'Layout/SCENE 26 - PAGE 69.png', alt: 'Scene 26 Page 69', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 26 - PAGE 69 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 70.png', alt: 'Scene 27 Page 70' },
    { src: 'Layout/SCENE 27 - PAGE 71.png', alt: 'Scene 27 Page 71', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 27 - PAGE 71 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 72.png', alt: 'Scene 27 Page 72', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 27 - PAGE 72 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 73.png', alt: 'Scene 27 Page 73' },
    { src: 'Layout/SCENE 27 - PAGE 74.png', alt: 'Scene 27 Page 74', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 27 - PAGE 74 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 75.png', alt: 'Scene 27 Page 75' },
    { src: 'Layout/SCENE 28 - PAGE 76.png', alt: 'Scene 28 Page 76' },
    { src: 'Layout/SCENE 28 - PAGE 77.png', alt: 'Scene 28 Page 77' },
    { src: 'Layout/SCENE 28 - PAGE 78.png', alt: 'Scene 28 Page 78', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 28 - PAGE 78 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 79.png', alt: 'Scene 29 Page 79' },
    { src: 'Layout/SCENE 29 - PAGE 80.png', alt: 'Scene 29 Page 80', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 80 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 81.png', alt: 'Scene 29 Page 81' },
    { src: 'Layout/SCENE 29 - PAGE 82.png', alt: 'Scene 29 Page 82', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 82 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 30 - PAGE 83.png',
      alt: 'Scene 30 Page 83',
      animatedClips: [
        { src: 'Animated Clips/SCENE 30 - PAGE 83.mp4', width: 507, height: 267, x: 44, y: 288, sound: 'Sound Effects/Knocking on the door.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 30 - PAGE 84.png',
      alt: 'Scene 30 Page 84',
      animatedClips: [
        { src: 'Animated Clips/SCENE 30 - PAGE 84.mp4', width: 505, height: 264, x: 45, y: 289, sound: 'Sound Effects/Knocking on the door.mp3' }
      ]
    },
    { src: 'Layout/SCENE 30 - PAGE 85.png', alt: 'Scene 30 Page 85', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 85 - DIALOGUE.png' },
    { src: 'Layout/SCENE 30 - PAGE 86.png', alt: 'Scene 30 Page 86', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 86 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 31 - PAGE 87.png',
      alt: 'Scene 31 Page 87',
      animatedClips: [
        { src: 'Animated Clips/SCENE 31 - PAGE 87.mp4', width: 550, height: 294, x: 23, y: 274, sound: 'Sound Effects/Girl Crying sound effect.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 31 - PAGE 88.png',
      alt: 'Scene 31 Page 88',
      animatedClips: [
        { src: 'Animated Clips/SCENE 31 - PAGE 88.mp4', width: 410, height: 217, x: 150, y: 451, sound: 'Sound Effects/Girl Crying sound effect.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 31 - PAGE 89.png',
      alt: 'Scene 31 Page 89',
      speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 31 - PAGE 89 - DIALOGUE.png',
      animatedClips: [
        { src: 'Animated Clips/SCENE 31 - PAGE 89.mp4', width: 500, height: 268, x: 48, y: 287, sound: 'Sound Effects/Woman crying and sobbing sound effect.mp3' }
      ]
    },
    {
      src: 'Layout/SCENE 32 - PAGE 90.png',
      alt: 'Scene 32 Page 90',
      speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 32 - PAGE 90 - DIALOGUE.png',
      animatedClips: [
        { src: 'Animated Clips/SCENE 32 - PAGE 90.mp4', width: 296, height: 327, x: 300, y: 453, sound: 'Sound Effects/Woman crying and sobbing sound effect.mp3' }
      ]
    },
    { src: 'Layout/SCENE 33 - PAGE 91.png', alt: 'Scene 33 Page 91' },
    { src: 'Layout/SCENE 33 - PAGE 92.png', alt: 'Scene 33 Page 92', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 33 - PAGE 92 - DIALOGUE.png' },
    { src: 'Layout/SCENE 33 - PAGE 93.png', alt: 'Scene 33 Page 93' }
  ];

  useEffect(() => {
    setTotalPages(pages.length + 2);
  }, [pages.length]);

  // Sound Effect Logic
  const playSfx = useCallback((soundFile) => {
    if (!soundFile || isMuted) return;

    // Check if the sound file exists (optional, browser handles 404)
    // Create new audio or use ref
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current.currentTime = 0;
    }

    const audio = new Audio(`${import.meta.env.BASE_URL}${soundFile}`);
    audio.loop = true;
    audio.volume = 0.5; // Adjust volume as needed

    // Attempt play
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented
        console.log("Audio play prevented:", error);
      });
    }

    sfxRef.current = audio;

  }, [isMuted]);

  const stopSfx = useCallback(() => {
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current.currentTime = 0;
      sfxRef.current = null;
    }
  }, []);

  // Update sound when page changes
  useEffect(() => {
    // Find current page data
    // Note: pageFlip uses 0 for Cover, so Index 0 in pages array is actually Page 1 in FlipBook logic if we consider Cover as Page 0.
    // Wait, let's check the mapping.
    // The pages array starts with FRONT BOOK COVER.
    // <HTMLFlipBook ...>
    //   <div className="page cover ...">...</div> (This is implied Page 0 by react-pageflip index if it's the first child?)
    //   No, react-pageflip counts children.
    //   Child 0: Front Cover (Custom div)
    //   Child 1..N: pages array items.
    //   Child N+1: Back Cover (Custom div)

    // So currentPage 0 = Cover
    // currentPage 1 = pages[0] (Simulated TOC in my previous code? No, let's look at the mapping below)

    // MAPPING IN JSX:
    // Child 0: Custom Front Cover
    // Children 1..N: pages.map(...) 
    // Child N+1: Custom Back Cover

    // pages[0] is FRONT BOOK COVER in the array, but in the map it is rendered as a page.
    // AHH, the backups showed:
    // pages = [ {type: 'toc'}, {type: 'video'...} ] 
    // BUT my new pages array has 'Layout/FRONT BOOK COVER.png' as index 0.

    // Only "animatedClips" prop matters.
    // If currentPage is 0 (Custom Cover), stop SFX.
    // If currentPage is > 0 and < pages.length + 1
    //   The relevant page data is pages[currentPage - 1]

    stopSfx();

    if (currentPage > 0 && currentPage <= pages.length) {
      const pageData = pages[currentPage - 1];
      // Check for animatedClips sound
      if (pageData.animatedClips && pageData.animatedClips.length > 0) {
        // Play sound of first clip if available? Or all?
        // Assuming one sound per page for now based on request structure (sound is per clip but usually synonymous for the scene)
        const clipWithSound = pageData.animatedClips.find(clip => clip.sound);
        if (clipWithSound) {
          playSfx(clipWithSound.sound);
        }
      }
    }

  }, [currentPage, playSfx, stopSfx]);


  // Audio unlock logic (for background music or initial interaction)
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => { });
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        document.removeEventListener('click', unlockAudio);
      }
    };
    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;

        // Mobile Check
        const isMobile = window.innerWidth < 768;

        // Force A4 Aspect Ratio: 1 : 1.414 (e.g. 595 x 842)
        // For spread (2 pages): 1.414 : 1 (e.g. 1190 x 842)

        // Base dimensions for single page
        const baseA4Width = 595;
        const baseA4Height = 842;
        const a4Ratio = baseA4Width / baseA4Height; // ~0.707

        // Available space
        const w = clientWidth;
        const h = clientHeight;

        // If mobile, we usually show single page or fit tightly.
        // If desktop, we show spread.

        let targetWidth, targetHeight;

        if (isMobile) {
          // Single page logic roughly
          // Fit height
          if (w / h > a4Ratio) {
            targetHeight = h;
            targetWidth = targetHeight * a4Ratio;
          } else {
            targetWidth = w;
            targetHeight = targetWidth / a4Ratio;
          }
        } else {
          // Spread logic (2x width)
          // Aspect ratio of spread is 2 * a4Ratio = 1.414
          const spreadRatio = a4Ratio * 2;

          if (w / h > spreadRatio) {
            targetHeight = h * 0.95; // 5% margin
            targetWidth = targetHeight * spreadRatio;
          } else {
            targetWidth = w * 0.95;
            targetHeight = targetWidth / spreadRatio;
          }
        }

        // React-pageflip takes width/height PER PAGE
        setDimensions({
          width: Math.floor(targetWidth / (isMobile ? 1 : 2)),
          height: Math.floor(targetHeight)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleFlip = (e) => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
    if (e && typeof e.data === 'number') {
      setCurrentPage(e.data);
    }
  };

  const nextPage = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prevPage = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    if (sfxRef.current) {
      sfxRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const handleJumpToCover = () => {
    bookRef.current?.pageFlip()?.flip(0);
    setCurrentPage(0);
  };

  const handleJumpToEnd = () => {
    const lastPage = bookRef.current?.pageFlip()?.getPageCount() - 1;
    bookRef.current?.pageFlip()?.flip(lastPage);
    setCurrentPage(lastPage);
  };

  const handleJumpToPage = (pageIndex) => {
    bookRef.current?.pageFlip()?.flip(pageIndex);
    setCurrentPage(pageIndex);
  };

  return (
    <div ref={containerRef} className={`relative w-full h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isNightMode ? 'bg-slate-950/50' : ''} overflow-hidden`}>

      {/* Book Container */}
      <div className="relative z-10 flex items-center justify-center">
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={200}
          maxWidth={1000}
          minHeight={300}
          maxHeight={1200}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
          flippingTime={1000}
          autoSize={false} // Important for fixed A4 size
          drawShadow={true}
          useMouseEvents={true}
        >
          {/* Front Cover */}
          <div className="page cover bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white flex flex-col items-center justify-center p-8 border-r-4 border-purple-950 relative overflow-hidden">
            {/* Decorative Cover Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-6xl font-black mb-4">PAGAMBIT</h1>
              <p className="text-xl tracking-widest uppercase">The Interactive Comic</p>
            </div>
          </div>

          {/* Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white">
              <MediaPage
                src={`${import.meta.env.BASE_URL}${page.src || ''}`}
                alt={`Page ${index + 1}`}
                pageNum={index + 1}
                speechBubbleSrc={page.speechBubbleSrc}
                animatedClips={page.animatedClips}
              />
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 text-white flex flex-col items-center justify-center p-8 border-l-4 border-purple-950 relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-black mb-4">THE END</h1>
              <p>Thanks for reading</p>
            </div>
          </div>
        </HTMLFlipBook>

        {/* Controls */}
        <Controls
          currentPage={currentPage}
          totalPages={pages.length + 2} // +2 for covers
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          isNightMode={isNightMode}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullScreen}
          onBookmark={() => setActiveDialog('bookmarks')}
          onDownload={() => setActiveDialog('save')}
          onShare={() => setActiveDialog('share')}
          onToggleNightMode={toggleNightMode}
          onJumpToCover={handleJumpToCover}
          onJumpToEnd={handleJumpToEnd}
          onJumpToPage={handleJumpToPage}
        />

        {/* Dialogs - Reduced for brevity, add back if needed or use previous component structure */}
        <Modal
          isOpen={activeDialog === 'share'}
          onClose={() => setActiveDialog(null)}
          title="Share Book"
        >
          <div className="p-4"><p className="text-white">Share functionality here</p></div>
        </Modal>

        {/* Hidden Audio Element for Page Flip */}
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}Page Turn Sound Effect.mp3`} preload="auto" />
      </div >
    </div >
  );
}

export default Book;
