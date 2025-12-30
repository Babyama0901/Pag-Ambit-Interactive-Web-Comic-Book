import React, { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';
import { MessageCircle, ToggleLeft, ToggleRight } from 'lucide-react';

// Custom Hook for Long Press (Not used but kept for utility)
const useLongPress = (callback = () => { }, ms = 500) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
};

// MediaPage Component (handles both Images and Videos)
const MediaPage = ({ src, alt, pageNum, hasSpeechBubble, speechText, speechBubbleSrc, isSpeechBubbleVisible, toggleSpeechBubbles }) => {
  const isVideo = src && src.toLowerCase().endsWith('.mp4');

  return (
    <div
      className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0"
    >
      {isVideo ? (
        <video
          src={src}
          className="w-full h-full object-contain shadow-sm"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain shadow-sm"
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
        />
      )}

      {/* Interaction Button - Only show if there's a bubble */}
      {!isVideo && (hasSpeechBubble || speechBubbleSrc) && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          onClick={(e) => e.stopPropagation()} // Prevent click from flipping page
        >
          <button
            onClick={toggleSpeechBubbles}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isSpeechBubbleVisible ? 'bg-purple-600 text-white' : 'bg-white/80 text-purple-600 hover:bg-white hover:scale-110'}`}
            title="Toggle Dialogue"
          >
            <MessageCircle size={24} fill={isSpeechBubbleVisible ? "currentColor" : "none"} />
          </button>
        </div>
      )}

      {/* Speech Bubble Overlay */}
      {!isVideo && (hasSpeechBubble || speechBubbleSrc) && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isSpeechBubbleVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {speechBubbleSrc ? (
            <img
              src={speechBubbleSrc}
              alt="Speech Bubble"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />
          ) : (
            // Fallback content if only text is provided
            <div className="bg-white p-4 rounded shadow-lg">
              {speechText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function Book() {
  const audioRef = useRef(null);
  const bookRef = useRef(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  // Global visibility state for speech bubbles
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const toggleSpeechBubbles = useCallback(() => {
    setIsSpeechBubbleVisible(prev => {
      const newState = !prev;
      setStatusMessage(newState ? "Speech bubbles visible" : "Speech bubbles hidden");
      return newState;
    });
  }, []);

  // Auto-hide status message after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const pages = [
    { src: 'Layout/SCENE 1 - PAGE 1.png', alt: 'Scene 1 Page 1' },
    { src: 'Layout/SCENE 1 - PAGE 2.png', alt: 'Scene 1 Page 2' },
    { src: 'Layout/SCENE 1 - PAGE 3.png', alt: 'Scene 1 Page 3' },
    { src: 'Layout/SCENE 2 - PAGE 4.png', alt: 'Scene 2 Page 4', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 2 - PAGE 4 - DIALOGUE.png' },
    { src: 'Layout/SCENE 2 - PAGE 5.png', alt: 'Scene 2 Page 5' },
    { src: 'Layout/SCENE 2 - PAGE 6.png', alt: 'Scene 2 Page 6', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 2 - PAGE 6 - DIALOGUE.png' },
    { src: 'Layout/SCENE 2 - PAGE 7.png', alt: 'Scene 2 Page 7', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 2 - PAGE 7 - DIALOGUE.png' },
    { src: 'Layout/SCENE 2 - PAGE 8.png', alt: 'Scene 2 Page 8', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 2 - PAGE 8 - DIALOGUE.png' },
    { src: 'Layout/SCENE 3 - PAGE 9.png', alt: 'Scene 3 Page 9', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 3 - PAGE 9 - DIALOGUE.png' },
    { src: 'Layout/SCENE 3 - PAGE 10.png', alt: 'Scene 3 Page 10' },
    { src: 'Layout/SCENE 3 - PAGE 11.png', alt: 'Scene 3 Page 11' },
    { src: 'Layout/SCENE 3 - PAGE 12.png', alt: 'Scene 3 Page 12' },
    { src: 'Layout/SCENE 4 - PAGE 13.png', alt: 'Scene 4 Page 13', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 4 - PAGE 13 - DIALOGUE.png' },
    { src: 'Layout/SCENE 4 - PAGE 14.png', alt: 'Scene 4 Page 14' },
    { src: 'Layout/SCENE 4 - PAGE 15.png', alt: 'Scene 4 Page 15' },
    { src: 'Layout/SCENE 4 - PAGE 16.png', alt: 'Scene 4 Page 16' },
    { src: 'Layout/SCENE 5 - PAGE 17.png', alt: 'Scene 5 Page 17' },
    { src: 'Layout/SCENE 5 - PAGE 18.png', alt: 'Scene 5 Page 18' },
    { src: 'Layout/SCENE 5 - PAGE 19.png', alt: 'Scene 5 Page 19', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 5 - PAGE 19 - DIALOGUE.png' },
    { src: 'Layout/SCENE 5 - PAGE 20.png', alt: 'Scene 5 Page 20' },
    { src: 'Layout/SCENE 5 - PAGE 21.png', alt: 'Scene 5 Page 21' },
    { src: 'Layout/SCENE 5 - PAGE 22.png', alt: 'Scene 5 Page 22' },
    { src: 'Layout/SCENE 6 - PAGE 23.png', alt: 'Scene 6 Page 23', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 23 - DIALOGUE.png' },
    { src: 'Layout/SCENE 6 - PAGE 24.png', alt: 'Scene 6 Page 24', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 24 - DIALOGUE.png' },
    { src: 'Layout/SCENE 7 - PAGE 25.png', alt: 'Scene 7 Page 25', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 7 - PAGE 25 - DIALOGUE.png' },
    { src: 'Layout/SCENE 7 - PAGE 26.png', alt: 'Scene 7 Page 26' },
    { src: 'Layout/SCENE 8 - PAGE 27.png', alt: 'Scene 8 Page 27', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 8 - PAGE 27 - DIALOGUE.png' },
    { src: 'Layout/SCENE 8 - PAGE 28.png', alt: 'Scene 8 Page 28', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 8 - PAGE 28 - DIALOGUE.png' },
    { src: 'Layout/SCENE 9 - PAGE 29.png', alt: 'Scene 9 Page 29', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 9 - PAGE 29 - DIALOGUE.png' },
    { src: 'Layout/SCENE 9 - PAGE 30.png', alt: 'Scene 9 Page 30' },
    { src: 'Layout/SCENE 10 - PAGE 31.png', alt: 'Scene 10 Page 31' },
    { src: 'Layout/SCENE 11 - PAGE 32.png', alt: 'Scene 11 Page 32', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 32 - DIALOGUE.png' },
    { src: 'Layout/SCENE 11 - PAGE 33.png', alt: 'Scene 11 Page 33', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 33 - DIALOGUE.png' },
    { src: 'Layout/SCENE 11 - PAGE 34.png', alt: 'Scene 11 Page 34' },
    { src: 'Layout/SCENE 12 - PAGE 35.png', alt: 'Scene 12 Page 35', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 12 - PAGE 35 - DIALOGUE.png' },
    { src: 'Layout/SCENE 12 - PAGE 36.png', alt: 'Scene 12 Page 36' },
    { src: 'Layout/SCENE 12 - PAGE 37.png', alt: 'Scene 12 Page 37', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 12 - PAGE 37 - DIALOGUE.png' },
    { src: 'Layout/SCENE 13 - PAGE 38.png', alt: 'Scene 13 Page 38' },
    { src: 'Layout/SCENE 13 - PAGE 39.png', alt: 'Scene 13 Page 39' },
    { src: 'Layout/SCENE 14 - PAGE 40.png', alt: 'Scene 14 Page 40', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 40 - DIALOGUE.png' },
    { src: 'Layout/SCENE 14 - PAGE 41.png', alt: 'Scene 14 Page 41', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 41 - DIALOGUE.png' },
    { src: 'Layout/SCENE 14 - PAGE 42.png', alt: 'Scene 14 Page 42', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 42 - DIALOGUE.png' },
    { src: 'Layout/SCENE 15 - PAGE 43.png', alt: 'Scene 15 Page 43' },
    { src: 'Layout/SCENE 15 - PAGE 44.png', alt: 'Scene 15 Page 44' },
    { src: 'Layout/SCENE 16 - PAGE 45.png', alt: 'Scene 16 Page 45' },
    { src: 'Layout/SCENE 16 - PAGE 46.png', alt: 'Scene 16 Page 46' },
    { src: 'Layout/SCENE 17 - PAGE 47.png', alt: 'Scene 17 Page 47', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 17 - PAGE 47 - DIALOGUE.png' },
    { src: 'Layout/SCENE 17 - PAGE 48.png', alt: 'Scene 17 Page 48', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 17 - PAGE 48 - DIAGLOGUE.png' },
    { src: 'Layout/SCENE 18 - PAGE 49.png', alt: 'Scene 18 Page 49' },
    { src: 'Layout/SCENE 18 - PAGE 50.png', alt: 'Scene 18 Page 50', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 18 - PAGE 50 - DIAGLOGUE.png' },
    { src: 'Layout/SCENE 18 - PAGE 51.png', alt: 'Scene 18 Page 51', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 18 - PAGE 51 - DIALOGUE.png' },
    { src: 'Layout/SCENE 19 - PAGE 52.png', alt: 'Scene 19 Page 52' },
    { src: 'Layout/SCENE 20 - PAGE 53.png', alt: 'Scene 20 Page 53', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 20 - PAGE 53 - DIALOGUE.png' },
    { src: 'Layout/SCENE 20 - PAGE 54.png', alt: 'Scene 20 Page 54', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 20 - PAGE 54 - DIALOGUE.png' },
    { src: 'Layout/SCENE 20 - PAGE 55.png', alt: 'Scene 20 Page 55', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 20 - PAGE 55 - DIALOGUE.png' },
    { src: 'Layout/SCENE 21 - PAGE 56.png', alt: 'Scene 21 Page 56' },
    { src: 'Layout/SCENE 21 - PAGE 57.png', alt: 'Scene 21 Page 57', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 21 - PAGE 57 - DIALOGUE.png' },
    { src: 'Layout/SCENE 21 - PAGE 58.png', alt: 'Scene 21 Page 58' },
    { src: 'Layout/SCENE 22 - PAGE 59.png', alt: 'Scene 22 Page 59', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 22 - PAGE 59 - DIALOGUE-1.png' },
    { src: 'Layout/SCENE 22 - PAGE 60.png', alt: 'Scene 22 Page 60' },
    { src: 'Layout/SCENE 22 - PAGE 61.png', alt: 'Scene 22 Page 61', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 22 - PAGE 61 - DIALOGUE.png' },
    { src: 'Layout/SCENE 23 - PAGE 62.png', alt: 'Scene 23 Page 62', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 23 - PAGE 62 - DIALOGUE.png' },
    { src: 'Layout/SCENE 23 - PAGE 63.png', alt: 'Scene 23 Page 63', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 23 - PAGE 63 - DIALOGUE.png' },
    { src: 'Layout/SCENE 23 - PAGE 64.png', alt: 'Scene 23 Page 64' },
    { src: 'Layout/SCENE 24 - PAGE 65.png', alt: 'Scene 24 Page 65' },
    { src: 'Layout/SCENE 24 - PAGE 66.png', alt: 'Scene 24 Page 66' },
    { src: 'Layout/SCENE 24 - PAGE 67.png', alt: 'Scene 24 Page 67' },
    { src: 'Layout/SCENE 25 - PAGE 68.png', alt: 'Scene 25 Page 68', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 25 - PAGE 68 - DIALOGUE.png' },
    { src: 'Layout/SCENE 25 - PAGE 69.png', alt: 'Scene 25 Page 69', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 25 - PAGE 69 - DIALOGUE.png' },
    { src: 'Layout/SCENE 25 - PAGE 70.png', alt: 'Scene 25 Page 70' },
    { src: 'Layout/SCENE 26 - PAGE 71.png', alt: 'Scene 26 Page 71', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 26 - PAGE 71 - DIALOGUE.png' },
    { src: 'Layout/SCENE 26 - PAGE 72.png', alt: 'Scene 26 Page 72', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 26 - PAGE 72 - DIALOGUE.png' },
    { src: 'Layout/SCENE 26 - PAGE 73.png', alt: 'Scene 26 Page 73' },
    { src: 'Layout/SCENE 27 - PAGE 74.png', alt: 'Scene 27 Page 74', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 27 - PAGE 74 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 75.png', alt: 'Scene 27 Page 75' },
    { src: 'Layout/SCENE 27 - PAGE 76.png', alt: 'Scene 27 Page 76' },
    { src: 'Layout/SCENE 28 - PAGE 77.png', alt: 'Scene 28 Page 77', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 28 - PAGE 77 - DIALOGUE.png' },
    { src: 'Layout/SCENE 28 - PAGE 78.png', alt: 'Scene 28 Page 78', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 28 - PAGE 78 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 79.png', alt: 'Scene 29 Page 79', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 79 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 80.png', alt: 'Scene 29 Page 80', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 80 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 81.png', alt: 'Scene 29 Page 81' },
    { src: 'Layout/SCENE 29 - PAGE 82.png', alt: 'Scene 29 Page 82' },
    { src: 'Layout/SCENE 30 - PAGE 83.png', alt: 'Scene 30 Page 83', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 83 - DIALOGUE.png' },
    { src: 'Layout/SCENE 30 - PAGE 84.png', alt: 'Scene 30 Page 84', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 84 - DIALOGUE.png' },
    { src: 'Layout/SCENE 30 - PAGE 85.png', alt: 'Scene 30 Page 85', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 85 - DIALOGUE.png' },
    { src: 'Layout/SCENE 30 - PAGE 86.png', alt: 'Scene 30 Page 86', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 86 - DIALOGUE.png' },
    { src: 'Layout/SCENE 31 - PAGE 87.png', alt: 'Scene 31 Page 87', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 31 - PAGE 87 - DIALOGUE.png' },
    { src: 'Layout/SCENE 31 - PAGE 88.png', alt: 'Scene 31 Page 88', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 31 - PAGE 88 - DIALOGUE.png' },
    { src: 'Layout/SCENE 31 - PAGE 89.png', alt: 'Scene 31 Page 89' },
    { src: 'Layout/SCENE 32 - PAGE 90.png', alt: 'Scene 32 Page 90', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 32 - PAGE 90 - DIALOGUE.png' },
    { src: 'Layout/SCENE 33 - PAGE 91.png', alt: 'Scene 33 Page 91' },
    { src: 'Layout/SCENE 33 - PAGE 92.png', alt: 'Scene 33 Page 92', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 33 - PAGE 92 - DIALOGUE.png' },
    { src: 'Layout/SCENE 33 - PAGE 93.png', alt: 'Scene 33 Page 93' }
  ];

  useEffect(() => {
    setTotalPages(pages.length + 2);
  }, []);

  // Audio unlock logic
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

  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        let newWidth = clientWidth;
        let newHeight = clientHeight;
        const maxWidth = 1000;
        const maxHeight = 800;
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          newWidth = Math.min(clientWidth - 20, 500);
          const availableWidth = Math.min(clientWidth, maxWidth);
          const availableHeight = Math.min(clientHeight, maxHeight);
          const targetRatio = 4 / 3;
          const containerRatio = availableWidth / availableHeight;

          if (containerRatio > targetRatio) {
            newHeight = availableHeight * 0.9;
            newWidth = newHeight * targetRatio;
          } else {
            newWidth = availableWidth * 0.95;
            newHeight = newWidth / targetRatio;
          }
        } else {
          const availableWidth = Math.min(clientWidth, 1200);
          const availableHeight = Math.min(clientHeight, 900);
          const targetRatio = 4 / 3;
          const containerRatio = availableWidth / availableHeight;

          if (containerRatio > targetRatio) {
            newHeight = availableHeight * 0.85;
            newWidth = newHeight * targetRatio;
          } else {
            newWidth = availableWidth * 0.85;
            newHeight = newWidth / targetRatio;
          }
        }
        setDimensions({ width: Math.floor(newWidth / 2), height: Math.floor(newHeight) });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const nextPage = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prevPage = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  // Keyboard navigation for page flipping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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

  const handleBookmark = () => {
    localStorage.setItem('bookmarkedPage', currentPage);
    alert(`Bookmarked page ${currentPage + 1}`);
  };

  const handleDownload = () => {
    alert('Download feature coming soon!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  const handleSearch = () => {
    const query = prompt('🔍 Search the book:');
    if (query) {
      alert(`Searching for "${query}"...\nThis feature will be fully implemented soon!`);
    }
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const handlePrint = () => {
    alert(`🖨️ Printing page ${currentPage + 1}...\nPrint dialog will open soon!`);
  };

  const handleJumpToCover = () => {
    bookRef.current?.pageFlip()?.flip(0);
    setCurrentPage(0);
  };

  const handleJumpToEnd = () => {
    const lastPage = totalPages - 1;
    bookRef.current?.pageFlip()?.flip(lastPage);
    setCurrentPage(lastPage);
  };

  const handleJumpToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      bookRef.current?.pageFlip()?.flip(pageIndex);
      setCurrentPage(pageIndex);
    }
  };

  const handleHighlight = () => {
    alert('✨ Highlighting feature coming soon!');
  };

  const handleNotes = () => {
    alert('📝 Notes feature coming soon!');
  };

  return (
    <div ref={containerRef} className={`relative w-full h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isNightMode ? 'bg-slate-950/50' : ''} overflow-hidden`}>

      {/* Top Bar for Switch and Message */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-start pointer-events-none">
        {/* Left spacer */}
        <div className="w-32"></div>

        {/* Center Feedback Message */}
        <div className="pointer-events-auto">
          {statusMessage && (
            <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-2 whitespace-nowrap shadow-lg">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Right Toggle Switch */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-full text-white shadow-lg w-32 justify-center">
          <span className="text-xs font-bold uppercase tracking-wider">Dialogues</span>
          <button
            onClick={toggleSpeechBubbles}
            className="focus:outline-none flex items-center"
            title="Toggle All Dialogues"
          >
            {isSpeechBubbleVisible ? (
              <ToggleRight size={32} className="text-green-400" />
            ) : (
              <ToggleLeft size={32} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="relative z-10 flex items-center justify-center">
        <HTMLFlipBook
          width={450}
          height={636}
          size="fixed"
          minWidth={318}
          maxWidth={595}
          minHeight={450}
          maxHeight={842}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
          flippingTime={1000}
          autoSize={false}
          drawShadow={true}
          useMouseEvents={true}
        >
          {/* Front Cover */}
          <div className="page cover bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white flex flex-col items-center justify-center p-0 border-r-4 border-purple-950 relative overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}Layout/FRONT BOOK COVER.png`}
              alt="Front Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white">
              <MediaPage
                src={`${import.meta.env.BASE_URL}${page.src || ''}`}
                alt={`Page ${index + 1}`}
                pageNum={index + 1}
                hasSpeechBubble={page.hasSpeechBubble}
                speechText={page.speechText}
                speechBubbleSrc={page.speechBubbleSrc ? `${import.meta.env.BASE_URL}${page.speechBubbleSrc}` : null}
                isSpeechBubbleVisible={isSpeechBubbleVisible}
                toggleSpeechBubbles={toggleSpeechBubbles}
              />
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 text-white flex flex-col items-center justify-center p-0 border-l-4 border-purple-950 relative overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}Layout/BACK BOOK COVER.png`}
              alt="Back Cover"
              className="w-full h-full object-cover"
            />
          </div>
        </HTMLFlipBook>

        {/* Controls */}
        <Controls
          currentPage={currentPage}
          totalPages={totalPages}
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
          onHighlight={handleHighlight}
          onNotes={handleNotes}
          onSearch={handleSearch}
          onTableOfContents={() => alert('Table of Contents has been removed.')}
          onToggleNightMode={toggleNightMode}
          onPrint={() => setActiveDialog('print')}
          onJumpToCover={handleJumpToCover}
          onJumpToEnd={handleJumpToEnd}
          onJumpToPage={handleJumpToPage}
        />

        {/* Dialogs */}
        <Modal
          isOpen={activeDialog === 'bookmarks'}
          onClose={() => setActiveDialog(null)}
          title="Bookmarks"
        >
          <div className="space-y-4">
            <button
              onClick={() => {
                localStorage.setItem('bookmarkedPage', currentPage);
                alert('Page saved!');
                setActiveDialog(null);
              }}
              className="w-full p-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center gap-2 font-medium transition-all"
            >
              <span>+ Add Current Page ({currentPage + 1})</span>
            </button>

            <div className="space-y-2">
              <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider ml-1">Saved Bookmarks</h3>
              {localStorage.getItem('bookmarkedPage') ? (
                <button
                  onClick={() => {
                    const page = parseInt(localStorage.getItem('bookmarkedPage'));
                    bookRef.current?.pageFlip()?.flip(page);
                    setCurrentPage(page);
                    setActiveDialog(null);
                  }}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between group transition-all"
                >
                  <span className="text-white font-medium">Bookmark 1</span>
                  <span className="text-white/40 text-sm">Page {parseInt(localStorage.getItem('bookmarkedPage')) + 1}</span>
                </button>
              ) : (
                <div className="text-center py-8 text-white/30 italic">No bookmarks yet</div>
              )}
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={activeDialog === 'print'}
          onClose={() => setActiveDialog(null)}
          title="Print"
        >
          <div className="text-center space-y-6">
            <div className="w-24 h-32 mx-auto bg-white rounded shadow-lg flex items-center justify-center text-black/20 font-bold text-4xl">
              {currentPage + 1}
            </div>
            <p className="text-white/70">Ready to print page {currentPage + 1}?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveDialog(null)}
                className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveDialog(null);
                }}
                className="flex-1 p-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all"
              >
                Print Now
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={activeDialog === 'share'}
          onClose={() => setActiveDialog(null)}
          title="Share Book"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white/60 text-xs mb-2 uppercase tracking-wider">Book Link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black/30 p-2 rounded text-indigo-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {window.location.href}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Copied!');
                  }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded text-white transition-all"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] font-medium transition-all">
                Twitter
              </button>
              <button className="p-3 rounded-xl bg-[#4267B2]/20 hover:bg-[#4267B2]/30 text-[#4267B2] font-medium transition-all">
                Facebook
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={activeDialog === 'save'}
          onClose={() => setActiveDialog(null)}
          title="Save / Download"
        >
          <div className="space-y-3">
            <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 group transition-all">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                PDF
              </div>
              <div className="text-left">
                <div className="text-white font-medium">Download as PDF</div>
                <div className="text-white/40 text-xs">High quality format</div>
              </div>
            </button>

            <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 group transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                IMG
              </div>
              <div className="text-left">
                <div className="text-white font-medium">Save Current Page</div>
                <div className="text-white/40 text-xs">PNG Image</div>
              </div>
            </button>
          </div>
        </Modal>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}Page Turn Sound Effect.mp3`} preload="auto" />
      </div >
    </div >
  );
}

export default Book;
