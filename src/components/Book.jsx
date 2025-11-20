import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';

function Book() {
  const audioRef = useRef(null);
  const bookRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 40;
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        // Calculate dimensions maintaining aspect ratio or fitting container
        // For mobile (single page view usually preferred but library handles 2-page spread)
        // We'll try to fit within the container with some padding

        let newWidth = clientWidth;
        let newHeight = clientHeight;

        // Max dimensions constraint
        const maxWidth = 1000;
        const maxHeight = 800;

        // Aspect ratio target (e.g., 2:3 per page, so 4:3 for spread)
        // Let's just maximize available space while keeping reasonable limits

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          // On mobile, we might want a single page view or just smaller double page
          // For now, let's scale the double page view to fit width
          newWidth = Math.min(clientWidth - 20, 500); // Padding
          newHeight = (newWidth * 1.5); // 2:3 aspect ratio roughly per page? No, spread is wider.
          // If spread is 2 pages. 
          // If we assume standard book ratio.
          // Let's stick to the library's responsive features if possible, but 'stretch' mode is often easier.
          // However, 'stretch' mode in react-pageflip can be tricky. 
          // Let's try explicit dimension calculation first for control.

          // Actually, let's try to make it responsive by setting width/height based on container
          // But we need to be careful about the aspect ratio.

          // Let's set a base size and let CSS transform handle the scaling if needed, 
          // OR pass dynamic props.

          // Simpler approach: Use 'stretch' size type if it works well, otherwise calc.
          // The plan mentioned 'stretch'. Let's try calculating to be safe as 'stretch' can distort.

          const availableWidth = Math.min(clientWidth, maxWidth);
          const availableHeight = Math.min(clientHeight, maxHeight);

          // Target aspect ratio for SPREAD (2 pages)
          // Page is 300-500w, 400-700h. 
          // Let's say single page is 1:1.5 (e.g. 400x600). Spread is 2:1.5 (800x600) = 4:3.

          const targetRatio = 4 / 3;
          const containerRatio = availableWidth / availableHeight;

          if (containerRatio > targetRatio) {
            // Container is wider than book
            newHeight = availableHeight * 0.9;
            newWidth = newHeight * targetRatio;
          } else {
            // Container is taller than book
            newWidth = availableWidth * 0.95;
            newHeight = newWidth / targetRatio;
          }
        } else {
          // Desktop logic similar but larger bounds
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

        setDimensions({ width: Math.floor(newWidth / 2), height: Math.floor(newHeight) }); // Width is per page
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
    // Placeholder for download logic
    alert('Download feature coming soon!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">

      {/* Book Container */}
      <div className="relative z-10 flex items-center justify-center">
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={200}
          maxWidth={600}
          minHeight={300}
          maxHeight={800}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          usePortrait={false}
          className="shadow-2xl"
          ref={bookRef}
          onFlip={handleFlip}
        >
          {/* Cover Page */}
          <div className="page cover bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-8 border-r-4 border-purple-950">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <span className="text-4xl">📚</span>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter mb-2 font-serif">PAGAMBIT</h1>
                <p className="text-purple-200 text-sm tracking-[0.2em] uppercase">Interactive Comic</p>
              </div>
              <div className="pt-12">
                <p className="text-xs text-purple-300/60">Mel Creatives Presents</p>
              </div>
            </div>
          </div>

          {/* Page 1 */}
          <div className="page bg-white p-0 overflow-hidden">
            <div className="w-full h-full relative">
              <img
                src="/SCENE 13 - PANEL 1.png"
                alt="Page 1"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/400x600/png?text=Page+1' }}
              />
              <span className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">1</span>
            </div>
          </div>

          {/* Generated Pages */}
          {Array.from({ length: 38 }, (_, i) => i + 2).map((pageNum) => (
            <div key={pageNum} className="page bg-white p-0 overflow-hidden border-l border-slate-100">
              <div className="w-full h-full relative flex items-center justify-center bg-slate-50">
                <div className="text-slate-300 text-4xl font-bold opacity-20">Page {pageNum}</div>
                <span className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">{pageNum}</span>
              </div>
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-8 border-l-4 border-purple-950">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <span className="text-3xl">🏁</span>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter mb-2 font-serif">THE END</h1>
                <p className="text-purple-200 text-xs tracking-[0.2em] uppercase">Thanks for reading</p>
              </div>
              <div className="pt-8">
                <p className="text-[10px] text-purple-300/60">© 2024 Mel Creatives</p>
              </div>
            </div>
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
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/Page Turn Sound Effect.mp3" preload="auto" />
    </div>
  );
}

export default Book;