import React, { useRef, useState, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';
import { MessageCircle, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';



// MediaPage Component (handles both Images and Videos)
const MediaPage = ({ src, alt, pageNum, hasSpeechBubble, speechText, speechBubbleSrc, isSpeechBubbleVisible, isMobile, videoOverlay, audioSrc, isActive, volume }) => {
  const isVideo = src && src.toLowerCase().endsWith('.mp4');
  const [isHovered, setIsHovered] = useState(false);
  const [isBubbleImageLoaded, setIsBubbleImageLoaded] = useState(false);

  // Mobile: Bubbles visible by default, hidden explicitly
  const [isMobileHidden, setIsMobileHidden] = useState(false);

  // Determine visibility
  // Mobile: Visible unless hidden. Desktop: Global Toggle OR Hover.
  const shouldShow = isMobile
    ? !isMobileHidden
    : (isSpeechBubbleVisible || isHovered);

  // Reset loading state when src changes
  useEffect(() => {
    setIsBubbleImageLoaded(false);
    setIsMobileHidden(false); // Reset mobile hidden state on page change
  }, [speechBubbleSrc]);

  const handleMobileClick = (e) => {
    e.stopPropagation();
    if (isMobile) {
      setIsMobileHidden(!isMobileHidden);
    }
  };

  // Helper to convert pixels to percentage strings based on A4 (595x842)
  const toPctX = (val) => `${(val / 595) * 100}%`;
  const toPctY = (val) => `${(val / 842) * 100}%`;

  // Audio Logic
  const audioRef = useRef(null);

  // Apply volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Mobile Active Page Handler
  useEffect(() => {
    if (isMobile && audioRef.current) {
      if (isActive) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Mobile Audio play failed:", e));
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isMobile, isActive]);

  return (
    <div
      className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMobileClick}
    >
      {isVideo ? (
        <video
          src={src}
          className="w-full h-full object-cover shadow-sm"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover shadow-sm"
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
          />
          {videoOverlay && (
            <div
              className="absolute z-20 pointer-events-none overflow-hidden"
              style={{
                left: toPctX(videoOverlay.x),
                top: toPctY(videoOverlay.y),
                width: toPctX(videoOverlay.width),
                height: toPctY(videoOverlay.height),
              }}
            >
              <video
                src={encodeURI(`${import.meta.env.BASE_URL}${videoOverlay.src}`)}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                style={{ transform: videoOverlay.scale ? `scale(${videoOverlay.scale})` : 'scale(1)' }}
              />
            </div>
          )}
        </>
      )
      }

      {/* Interaction Button - Only show if there's a bubble AND NOT MOBILE */}
      {
        !isVideo && (hasSpeechBubble || speechBubbleSrc) && !isMobile && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            onClick={(e) => e.stopPropagation()} // Prevent click from flipping page
          >
            <button
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={() => !isMobile && setIsHovered(false)}
              onClick={handleMobileClick}
              className={`p-3 rounded-full shadow-lg transition-opacity duration-300 hover:opacity-0 ${shouldShow ? 'bg-purple-600 text-white' : 'bg-white/80 text-purple-600'}`}
            >
              <MessageCircle size={24} fill={shouldShow ? "currentColor" : "none"} />
            </button>
          </div>
        )
      }

      {/* Speech Bubble Overlay */}
      {
        !isVideo && (hasSpeechBubble || speechBubbleSrc) && (
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}
          >
            {speechBubbleSrc ? (
              <>
                {/* Spinner while loading */}
                {/* Spinner while loading - REMOVED */}
                <img
                  src={encodeURI(speechBubbleSrc)}
                  alt="Speech Bubble"
                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-20 transition-opacity duration-300 ${isBubbleImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsBubbleImageLoaded(true)}
                  onError={() => {
                    console.error("Failed to load speech bubble:", speechBubbleSrc);
                    setIsBubbleImageLoaded(true); // Force show (broken image icon) so it's not invisible
                  }}
                />
              </>
            ) : (
              // Fallback content if only text is provided
              <div className={`bg-white p-4 rounded shadow-lg transition-opacity duration-300 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}>
                {speechText}
              </div>
            )}
          </div>
        )
      }

      {/* Page Audio */}
      {
        audioSrc && (
          <audio
            ref={audioRef}
            src={`${import.meta.env.BASE_URL}${audioSrc}`}
            loop
            muted={false} // Ensure it's not muted by default, though browser policies might affect autoplay. Since it's on hover (interaction), it should work.
          />
        )
      }
    </div >
  );
};



// Mobile Scroll Component (Webtoon style)
const MobileScrollMode = ({ pages, activePage, onPageChange, volume, isSpeechBubbleVisible }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            onPageChange(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const pageElements = document.querySelectorAll('.mobile-page');
    pageElements.forEach((el) => observer.observe(el));

    return () => pageElements.forEach((el) => observer.unobserve(el));
  }, [pages]); // Re-run if pages change

  const allContent = [
    { src: 'Layout/FRONT BOOK COVER.png', alt: 'Front Cover', isCover: true, index: 0 },
    ...pages.map((p, i) => ({ ...p, index: i + 1 })),
    { src: 'Layout/BACK BOOK COVER.png', alt: 'Back Cover', isCover: true, index: pages.length + 1 }
  ];

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-slate-900 overflow-y-auto overscroll-y-contain"> {/* Fixed height for scroll */}
      {allContent.map((item) => (
        <div
          key={item.index}
          data-index={item.index}
          className="mobile-page w-full relative mb-1 shadow-lg"
        >
          {item.isCover ? (
            <img
              src={`${import.meta.env.BASE_URL}${item.src}`}
              alt={item.alt}
              className="w-full h-auto object-cover block"
            />
          ) : (
            <div className="w-full relative">
              <MediaPage
                src={`${import.meta.env.BASE_URL}${item.src || ''}`}
                alt={item.alt}
                pageNum={item.index}
                hasSpeechBubble={item.hasSpeechBubble}
                speechText={item.speechText}
                speechBubbleSrc={item.speechBubbleSrc ? `${import.meta.env.BASE_URL}${item.speechBubbleSrc}` : null}
                isSpeechBubbleVisible={isSpeechBubbleVisible}
                isMobile={true}
                videoOverlay={item.videoOverlay}
                audioSrc={item.audioSrc}
                isActive={activePage === item.index}
                volume={volume}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


function Book() {
  const audioRef = useRef(null);
  const bookRef = useRef(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  // Mobile Detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global visibility state for speech bubbles
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false); // Controls opacity animation

  // Simulate global loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobalLoading(false);
    }, 2000); // 2 seconds loading screen
    return () => clearTimeout(timer);
  }, []);

  const toggleSpeechBubbles = useCallback(() => {
    setIsSpeechBubbleVisible(prev => {
      const newState = !prev;
      setStatusMessage(newState ? "Speech bubbles visible" : "Speech bubbles hidden");
      setIsMessageVisible(true);

      // Start fade out after 2.5 seconds
      setTimeout(() => {
        setIsMessageVisible(false);
      }, 2500);

      return newState;
    });
  }, []);

  // ... (Pages array remains the same as previous step, ensuring complete content)
  const pages = [
    {
      src: 'Layout/SCENE 1 - PAGE 1.png', alt: 'Scene 1 Page 1'
    },
    {
      src: 'Layout/SCENE 1 - PAGE 2.png', alt: 'Scene 1 Page 2',
      videoOverlay: { src: 'Animated Clips/SCENE 1 - PAGE 2.mp4', x: -519, y: 140, width: 1035, height: 547 },
      audioSrc: 'Sound Effect Library/digital-alarm-clock-tone-362040.mp3'
    },
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
    {
      src: 'Layout/SCENE 4 - PAGE 16.png', alt: 'Scene 4 Page 16',
      videoOverlay: { src: 'Animated Clips/SCENE 4 - PAGE 6.mp4', x: 105, y: 220, width: 385, height: 416 },
      audioSrc: 'Sound Effect Library/night-ambience-17064.mp3'
    },
    { src: 'Layout/SCENE 5 - PAGE 17.png', alt: 'Scene 5 Page 17' },
    { src: 'Layout/SCENE 5 - PAGE 18.png', alt: 'Scene 5 Page 18' },
    { src: 'Layout/SCENE 5 - PAGE 19.png', alt: 'Scene 5 Page 19', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 5 - PAGE 19 - DIALOGUE.png' },
    { src: 'Layout/SCENE 5 - PAGE 20.png', alt: 'Scene 5 Page 20' },
    { src: 'Layout/SCENE 5 - PAGE 21.png', alt: 'Scene 5 Page 21' },
    { src: 'Layout/SCENE 5 - PAGE 22.png', alt: 'Scene 5 Page 22' },
    { src: 'Layout/SCENE 6 - PAGE 23.png', alt: 'Scene 6 Page 23', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 23 - DIALOGUE.png' },
    { src: 'Layout/SCENE 6 - PAGE 24.png', alt: 'Scene 6 Page 24', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 6 - PAGE 24 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 7 - PAGE 25.png', alt: 'Scene 7 Page 25', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 7 - PAGE 25 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 7 - PAGE 25.mp4', x: 30, y: 64, width: 290, height: 338 },
      audioSrc: 'Sound Effect Library/drawing-sound-405119.mp3'
    },
    {
      src: 'Layout/SCENE 7 - PAGE 26.png', alt: 'Scene 7 Page 26',
      videoOverlay: { src: 'Animated Clips/SCENE 7 - PAGE 26.mp4', x: 8, y: 357, width: 580, height: 277 },
      audioSrc: 'Sound Effect Library/woman-crying-softly-268484.mp3'
    },
    { src: 'Layout/SCENE 8 - PAGE 27.png', alt: 'Scene 8 Page 27', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 8 - PAGE 27 - DIALOGUE.png' },
    { src: 'Layout/SCENE 8 - PAGE 28.png', alt: 'Scene 8 Page 28', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 8 - PAGE 28 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 9 - PAGE 29.png', alt: 'Scene 9 Page 29', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 9 - PAGE 29 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 9 - PAGE 29.mp4', x: 33, y: 60, width: 525, height: 300 },
      audioSrc: 'Sound Effect Library/footsteps-dance-studio-70985.mp3'
    },
    {
      src: 'Layout/SCENE 9 - PAGE 30.png', alt: 'Scene 9 Page 30',
      videoOverlay: { src: 'Animated Clips/SCENE 9 - PAGE 30.mp4', x: 222, y: 336, width: 354, height: 170 },
      audioSrc: 'Sound Effect Library/footsteps-running-on-the-floor-81283.mp3'
    },
    {
      src: 'Layout/SCENE 10 - PAGE 31.png', alt: 'Scene 10 Page 31',
      videoOverlay: { src: 'Animated Clips/SCENE 10 - PAGE 31.mp4', x: 55, y: 489, width: 485, height: 223 },
      audioSrc: 'Sound Effect Library/new-notification-09-352705.mp3'
    },
    { src: 'Layout/SCENE 11 - PAGE 32.png', alt: 'Scene 11 Page 32', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 32 - DIALOGUE.png' },
    { src: 'Layout/SCENE 11 - PAGE 33.png', alt: 'Scene 11 Page 33', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 11 - PAGE 33 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 11 - PAGE 34.png', alt: 'Scene 11 Page 34',
      videoOverlay: { src: 'Animated Clips/SCENE 11 - PAGE 34.mp4', x: 22, y: 336, width: 278, height: 414 },
      audioSrc: 'Sound Effect Library/footsteps-running-on-the-floor-81283.mp3'
    },
    {
      src: 'Layout/SCENE 12 - PAGE 35.png', alt: 'Scene 12 Page 35', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 12 - PAGE 35 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 12 - PAGE 35.mp4', x: 59, y: 219, width: 477, height: 333 },
      audioSrc: 'Sound Effect Library/suburban-alley-traffic-ambience-359577.mp3'
    },
    { src: 'Layout/SCENE 12 - PAGE 36.png', alt: 'Scene 12 Page 36' },
    {
      src: 'Layout/SCENE 12 - PAGE 37.png', alt: 'Scene 12 Page 37', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 12 - PAGE 37 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 12 - PAGE 37.mp4', x: 33, y: 172, width: 514, height: 310 },
      audioSrc: 'Sound Effect Library/suburban-alley-traffic-ambience-359577.mp3'
    },
    {
      src: 'Layout/SCENE 13 - PAGE 38.png', alt: 'Scene 13 Page 38',
      videoOverlay: { src: 'Animated Clips/SCENE 13 - PAGE 38.mp4', x: 42, y: 204, width: 511, height: 332 }, // TODO: Adjust coordinates based on reference
      audioSrc: 'Sound Effect Library/traffic-commotion-with-siren-and-car-horns-urban-street-noise-457233.mp3'
    },
    {
      src: 'Layout/SCENE 13 - PAGE 39.png', alt: 'Scene 13 Page 39',
      audioSrc: 'Sound Effect Library/traffic-commotion-with-siren-and-car-horns-urban-street-noise-457233.mp3'
    },
    { src: 'Layout/SCENE 14 - PAGE 40.png', alt: 'Scene 14 Page 40', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 40 - DIALOGUE.png' },
    { src: 'Layout/SCENE 14 - PAGE 41.png', alt: 'Scene 14 Page 41', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 41 - DIALOGUE.png' },
    { src: 'Layout/SCENE 14 - PAGE 42.png', alt: 'Scene 14 Page 42', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 14 - PAGE 42 - DIALOGUE.png' },
    { src: 'Layout/SCENE 15 - PAGE 43.png', alt: 'Scene 15 Page 43' },
    { src: 'Layout/SCENE 15 - PAGE 44.png', alt: 'Scene 15 Page 44' },
    { src: 'Layout/SCENE 16 - PAGE 45.png', alt: 'Scene 16 Page 45' },
    {
      src: 'Layout/SCENE 16 - PAGE 46.png', alt: 'Scene 16 Page 46',
      videoOverlay: { src: 'Animated Clips/SCENE 16 - PAGE 46.mp4', x: 35, y: 37, width: 273, height: 385 },
      audioSrc: 'Sound Effect Library/panting-7108.mp3'
    },
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
    {
      src: 'Layout/SCENE 26 - PAGE 73.png', alt: 'Scene 26 Page 73',
      videoOverlay: { src: 'Animated Clips/SCENE 26 - PAGE 73.mp4', x: 60, y: 291, width: 475, height: 260 },
      audioSrc: 'Sound Effect Library/footsteps-running-on-the-floor-81283.mp3'
    },
    { src: 'Layout/SCENE 27 - PAGE 74.png', alt: 'Scene 27 Page 74', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 27 - PAGE 74 - DIALOGUE.png' },
    { src: 'Layout/SCENE 27 - PAGE 75.png', alt: 'Scene 27 Page 75' },
    { src: 'Layout/SCENE 27 - PAGE 76.png', alt: 'Scene 27 Page 76' },
    { src: 'Layout/SCENE 28 - PAGE 77.png', alt: 'Scene 28 Page 77', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 28 - PAGE 77 - DIALOGUE.png' },
    { src: 'Layout/SCENE 28 - PAGE 78.png', alt: 'Scene 28 Page 78', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 28 - PAGE 78 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 79.png', alt: 'Scene 29 Page 79', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 79 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 80.png', alt: 'Scene 29 Page 80', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 29 - PAGE 80 - DIALOGUE.png' },
    { src: 'Layout/SCENE 29 - PAGE 81.png', alt: 'Scene 29 Page 81' },
    { src: 'Layout/SCENE 29 - PAGE 82.png', alt: 'Scene 29 Page 82' },
    {
      src: 'Layout/SCENE 30 - PAGE 83.png', alt: 'Scene 30 Page 83', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 83 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 30 - PAGE 83.mp4', x: 44, y: 288, width: 507, height: 267 },
      audioSrc: 'Sound Effect Library/cooking-sound-442650.mp3'
    },
    {
      src: 'Layout/SCENE 30 - PAGE 84.png', alt: 'Scene 30 Page 84', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 84 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 30 - PAGE 84.mp4', x: 45, y: 289, width: 505, height: 264 },
      audioSrc: 'Sound Effect Library/dishes-clearing-73302.mp3'
    },
    { src: 'Layout/SCENE 30 - PAGE 85.png', alt: 'Scene 30 Page 85', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 85 - DIALOGUE.png' },
    { src: 'Layout/SCENE 30 - PAGE 86.png', alt: 'Scene 30 Page 86', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 30 - PAGE 86 - DIALOGUE.png' },
    {
      src: 'Layout/SCENE 31 - PAGE 87.png', alt: 'Scene 31 Page 87', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 31 - PAGE 87 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 31 - PAGE 87.mp4', x: 23, y: 274, width: 550, height: 294, scale: 1.1 },
      audioSrc: 'Sound Effect Library/knocking-on-door-6022.mp3'
    },
    {
      src: 'Layout/SCENE 31 - PAGE 88.png', alt: 'Scene 31 Page 88', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 31 - PAGE 88 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 31 - PAGE 88.mp4', x: 150, y: 451, width: 410, height: 217, scale: 1.1 },
      audioSrc: 'Sound Effect Library/woman-scream-sound-hd-379381.mp3'
    },
    {
      src: 'Layout/SCENE 31 - PAGE 89.png', alt: 'Scene 31 Page 89',
      videoOverlay: { src: 'Animated Clips/SCENE 31 - PAGE 89.mp4', x: 48, y: 287, width: 500, height: 268, scale: 1.1 }
    },
    {
      src: 'Layout/SCENE 32 - PAGE 90.png', alt: 'Scene 32 Page 90', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 32 - PAGE 90 - DIALOGUE.png',
      videoOverlay: { src: 'Animated Clips/SCENE 32 - PAGE 90.mp4', x: 300, y: 453, width: 296, height: 327, scale: 1.1 },
      audioSrc: 'Sound Effect Library/woman-sobbing-372482.mp3'
    },
    { src: 'Layout/SCENE 33 - PAGE 91.png', alt: 'Scene 33 Page 91' },
    { src: 'Layout/SCENE 33 - PAGE 92.png', alt: 'Scene 33 Page 92', speechBubbleSrc: 'Speech Bubbles Dialogues/SCENE 33 - PAGE 92 - DIALOGUE.png' },
    { src: 'Layout/SCENE 33 - PAGE 93.png', alt: 'Scene 33 Page 93' }
  ];

  useEffect(() => {
    setTotalPages(pages.length + 2);
  }, [pages.length]);

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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => { });
    }
    if (e && typeof e.data === 'number') {
      setCurrentPage(e.data);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
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



  const handleSearch = () => {
    const query = prompt('🔍 Search the book:');
    if (query) {
      alert(`Searching for "${query}"...\nThis feature will be fully implemented soon!`);
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
    <div className={`relative w-full h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isNightMode ? 'bg-slate-950/50' : ''} overflow-hidden`}>

      {/* Global Loading Overlay */}
      {isGlobalLoading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 animate-out fade-out">
          <Loader2 className="animate-spin text-purple-500 mb-4" size={64} />
          <h2 className="text-white text-xl font-medium tracking-widest animate-pulse">LOADING</h2>
        </div>
      )}

      {/* Top Bar for Switch and Message - Only show on Desktop */}
      {!isMobile && (
        <div className="absolute top-0 left-0 w-full z-50 p-4 pointer-events-none">
          {/* Centered Toggle Switch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-full text-white shadow-lg justify-center z-50">
            <span className="text-xs font-bold uppercase tracking-wider pl-2">Dialogues</span>
            <button
              onClick={toggleSpeechBubbles}
              className="focus:outline-none flex items-center pr-1"
              title="Toggle All Dialogues"
            >
              {isSpeechBubbleVisible ? (
                <ToggleRight size={32} className="text-green-400" />
              ) : (
                <ToggleLeft size={32} className="text-gray-400" />
              )}
            </button>
          </div>

          {/* Feedback Message (Bottom Center with Fade) */}
          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 ${isMessageVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm whitespace-nowrap shadow-lg">
              {statusMessage}
            </div>
          </div>
        </div>
      )}

      {/* Book Container - Configured for Mobile Scroll or Desktop Flip */}
      <div className="relative z-10 flex items-center justify-center w-full">
        {isMobile ? (
          <MobileScrollMode
            pages={pages}
            activePage={currentPage}
            onPageChange={setCurrentPage}
            volume={volume}
            isSpeechBubbleVisible={isSpeechBubbleVisible} // Though mobile toggles individually, passing this doesn't hurt
          />
        ) : (
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
            usePortrait={true}
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
                  isMobile={isMobile}
                  videoOverlay={page.videoOverlay}
                  audioSrc={page.audioSrc}
                  isActive={currentPage === index + 1}
                  volume={volume}
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
        )}

        {/* Controls */}
        <Controls
          currentPage={currentPage}
          totalPages={totalPages}
          volume={volume}
          isFullscreen={isFullscreen}
          isNightMode={isNightMode}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onVolumeChange={handleVolumeChange}
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
