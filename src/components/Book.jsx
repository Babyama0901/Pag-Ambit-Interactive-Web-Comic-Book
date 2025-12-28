import React, { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';

// MediaPage Component (handles both Images and Videos)
// MediaPage Component (handles both Images and Videos)
const MediaPage = ({ src, alt, pageNum, speechBubbleSrc, forceShow, onEnableGlobal }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isVideo = src && src.toLowerCase().endsWith('.mp4');
  const pressTimer = useRef(null);

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowOverlay(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
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
      <div className={`w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {isVideo ? (
          <video
            src={src}
            className="w-full h-full object-fill"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-fill"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
          />
        )}
      </div>

      {/* Hover Trigger Button - Center of page */}
      {!isVideo && speechBubbleSrc && (
        <button
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white/80 transition-all duration-300 shadow-2xl hover:scale-110 
          ${(showOverlay || forceShow) ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => {
            setShowOverlay(false);
            handlePressEnd();
          }}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressEnd}
          onClick={(e) => {
            e.stopPropagation();
            if (showOverlay) setShowOverlay(false);
          }}
          aria-label="Show Dialogue"
          title="Hover to read, Long Press (0.5s) to view on mobile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Speech Bubble Overlay */}
      {
        !isVideo && speechBubbleSrc && (
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-auto transition-all duration-500 ease-in-out
            ${(showOverlay || forceShow) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowOverlay(false);
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${speechBubbleSrc}`}
              alt="Dialogue"
              className="w-full h-full object-contain"
            />
          </div>
        )
      }
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
  const [zoom, setZoom] = useState(1.0);
  const [showReturnPrompt, setShowReturnPrompt] = useState(false);
  const [showGlobalDialogues, setShowGlobalDialogues] = useState(false);

  const pages = [
    { src: 'Layout/FRONT BOOK COVER.png', alt: 'Front Cover' },
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
    setTotalPages(pages.length);
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
  const [forceMobile, setForceMobile] = useState(false);
  const containerRef = useRef(null);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      let newWidth = clientWidth;
      let newHeight = clientHeight;

      // Check if mobile (screen size OR forced toggle)
      const mobileCheck = window.innerWidth < 1100 || forceMobile;
      setIsMobile(mobileCheck);

      if (mobileCheck) {
        // Mobile/Tablet: Layout for single page
        // Default Dimensions: 425 x 642
        const targetWidth = 425;
        const targetHeight = 642;
        const mobileRatio = targetHeight / targetWidth;

        // Responsive calculation: Fit within screen minus margin (e.g. 20px)
        // Cap at targetWidth (425) for default mobile sizing
        newWidth = Math.min(clientWidth - 20, targetWidth);
        newHeight = newWidth * mobileRatio;

        // Constrain by height if needed
        if (newHeight > clientHeight - 40) {
          newHeight = clientHeight - 40;
          newWidth = newHeight / mobileRatio;
        }

        setDimensions({ width: Math.floor(newWidth), height: Math.floor(newHeight) });

      } else {
        // Desktop: Layout for 2-page spread
        const availableWidth = Math.min(clientWidth, 1200);
        const availableHeight = Math.min(clientHeight, 900);
        const targetRatio = 4 / 3; // Aspect ratio for the SPREAD (2 pages)
        const containerRatio = availableWidth / availableHeight;

        if (containerRatio > targetRatio) {
          newHeight = availableHeight * 0.85;
          newWidth = newHeight * targetRatio;
        } else {
          newWidth = availableWidth * 0.85;
          newHeight = newWidth / targetRatio;
        }
        setDimensions({ width: Math.floor(newWidth / 2), height: Math.floor(newHeight) });
      }
    }
  }, [forceMobile]); // Re-run when forceMobile changes

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

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
      // Check if last page (using totalPages or just checking index)
      // Note: react-pageflip uses index, totalPages is usually pages.length + covers
      // Based on pages array: 
      // Front Cover (0) + 33 Scenes (multiple pages) + Back Cover
      // Total pages around 94.
      // e.data is current spread index or page index depending on mode.

      // If we are at the end (e.data is near totalPages)
      // Let's use a simpler check: if e.data >= total pages - 2

      // For simple detection, just check if we are at the last index
      if (bookRef.current && bookRef.current.pageFlip()) {
        const count = bookRef.current.pageFlip().getPageCount();
        if (e.data >= count - 1) { // 0-indexed
          setShowReturnPrompt(true);
        }
      }
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

  const handleBookmark = () => setActiveDialog('bookmarks');

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

  const handleNotes = () => setActiveDialog('notes');
  const handleHighlight = () => setActiveDialog('highlight');
  const handleShare = () => setActiveDialog('share');
  const handleTableOfContents = () => setActiveDialog('contents');

  const handleZoomChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setZoom(newValue);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center py-8">
      {/* Top Toggle Switch */}


      <div
        className="transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out'
        }}
      >
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
          mobileScrollSupport={false}
          usePortrait={isMobile}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
          flippingTime={1000}
          autoSize={false}
          drawShadow={true}
          useMouseEvents={true}
        >
          {/* Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white">
              <MediaPage
                src={`${import.meta.env.BASE_URL}${page.src || ''}`}
                alt={`Page ${index + 1}`}
                pageNum={index + 1}
                speechBubbleSrc={page.speechBubbleSrc}
                forceShow={showGlobalDialogues}
                onEnableGlobal={() => setShowGlobalDialogues(true)}
              />
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-white">
            <MediaPage
              src={`${import.meta.env.BASE_URL}Layout/BACK BOOK COVER.png`}
              alt="Back Cover"
              pageNum={pages.length + 1}
              forceShow={showGlobalDialogues}
              onEnableGlobal={() => setShowGlobalDialogues(true)}
            />
          </div>
        </HTMLFlipBook>
      </div>

      {/* Controls */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullScreen}
        onBookmark={handleBookmark}
        onShare={handleShare}
        onHighlight={handleHighlight}
        onNotes={handleNotes}
        onTableOfContents={handleTableOfContents}
        onJumpToCover={handleJumpToCover}
        onJumpToEnd={handleJumpToEnd}
        onJumpToPage={handleJumpToPage}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleMobile={() => setForceMobile(!forceMobile)}
        isMobileView={isMobile}
      />

      {/* Last Page Return Prompt */}
      <Modal
        isOpen={showReturnPrompt}
        onClose={() => setShowReturnPrompt(false)}
        title="End of Book"
      >
        <div className="text-center p-6 space-y-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mb-4 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">You've reached the end!</h3>
          <p className="text-slate-600 font-medium">Would you like to return to the beginning of the story?</p>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => {
                handleJumpToCover();
                setShowReturnPrompt(false);
              }}
              className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Return to Start
            </button>
            <button
              onClick={() => setShowReturnPrompt(false)}
              className="w-full py-3 px-6 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-bold transition-colors"
            >
              Stay Here
            </button>
          </div>
        </div>
      </Modal>

      {/* Dialogs */}
      <Modal
        isOpen={activeDialog === 'contents'}
        onClose={() => setActiveDialog(null)}
        title="Table of Contents"
      >
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {[
            { title: "Front Cover", page: 0 },
            { title: "Scene 1", page: 1 },
            { title: "Scene 2", page: 4 },
            { title: "Scene 3", page: 9 },
            { title: "Scene 4", page: 13 },
            { title: "Scene 5", page: 17 },
            { title: "Scene 6", page: 23 },
            { title: "Scene 7", page: 25 },
            { title: "Scene 8", page: 27 },
            { title: "Scene 9", page: 29 },
            { title: "Scene 10", page: 31 },
            { title: "Scene 11", page: 32 },
            { title: "Scene 12", page: 35 },
            { title: "Scene 13", page: 38 },
            { title: "Scene 14", page: 40 },
            { title: "Scene 15", page: 43 },
            { title: "Scene 16", page: 45 },
            { title: "Scene 17", page: 47 },
            { title: "Scene 18", page: 49 },
            { title: "Scene 19", page: 52 },
            { title: "Scene 20", page: 53 },
            { title: "Scene 21", page: 56 },
            { title: "Scene 22", page: 59 },
            { title: "Scene 23", page: 62 },
            { title: "Scene 24", page: 65 },
            { title: "Scene 25", page: 68 },
            { title: "Scene 26", page: 71 },
            { title: "Scene 27", page: 74 },
            { title: "Scene 28", page: 77 },
            { title: "Scene 29", page: 79 },
            { title: "Scene 30", page: 83 },
            { title: "Scene 31", page: 87 },
            { title: "Scene 32", page: 90 },
            { title: "Scene 33", page: 91 }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => {
                bookRef.current?.pageFlip()?.flip(item.page);
                setCurrentPage(item.page);
                setActiveDialog(null);
              }}
              className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between group transition-all"
            >
              <span className="text-white font-medium">{item.title}</span>
              <span className="text-white/40 text-sm group-hover:text-white/60">Page {item.page + 1}</span>
            </button>
          ))}
        </div>
      </Modal>

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

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
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
        isOpen={activeDialog === 'notes'}
        onClose={() => setActiveDialog(null)}
        title="Notes"
      >
        <div className="space-y-4">
          <p className="text-white/70 text-sm mb-4">Choose where to take your notes:</p>

          <a
            href="https://keep.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl">
              📝
            </div>
            <div className="text-left flex-1">
              <div className="text-white font-medium">Google Keep</div>
              <div className="text-white/40 text-xs">Quick and simple note-taking</div>
            </div>
            <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href="https://www.icloud.com/notes"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-2xl">
              🍎
            </div>
            <div className="text-left flex-1">
              <div className="text-white font-medium">Apple Notes</div>
              <div className="text-white/40 text-xs">iOS/macOS native notes app</div>
            </div>
            <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <a
            href="https://www.notion.so/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl">
              ⚡
            </div>
            <div className="text-left flex-1">
              <div className="text-white font-medium">Notion</div>
              <div className="text-white/40 text-xs">All-in-one workspace</div>
            </div>
            <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </Modal>

      <Modal
        isOpen={activeDialog === 'highlight'}
        onClose={() => setActiveDialog(null)}
        title="Highlight"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 text-4xl">
            🖍️
          </div>
          <p className="text-white/70">Highlighting feature coming soon!</p>
          <p className="text-white/50 text-sm">You'll be able to highlight important text and save your highlights.</p>
        </div>
      </Modal>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}Page Turn Sound Effect.mp3`} preload="auto" />
    </div>
  );
}

export default Book;