import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';

// ImageWithOverlay Component
const ImageWithOverlay = ({ src, alt, pageNum }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div
      className="relative w-full h-full group cursor-pointer overflow-hidden"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${showOverlay ? 'scale-110' : 'scale-100'}`}
        onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
      />

      {/* Comic Speech Bubble Overlay */}
      <div
        className={`absolute top-10 left-1/2 -translate-x-1/2 w-64 z-20 pointer-events-none
                    transition-all duration-500 cubic-bezier(0.68, -0.55, 0.265, 1.55)
                    ${showOverlay
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-0 translate-y-10'
          }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          transformOrigin: 'bottom center'
        }}
      >
        <div className="relative bg-white border-4 border-black rounded-[2rem] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
          {/* Tail of the bubble */}
          <div className="absolute -bottom-6 left-8 w-0 h-0 
                           border-l-[20px] border-l-transparent
                           border-r-[0px] border-r-transparent
                           border-t-[30px] border-t-black
                           transform rotate-12">
          </div>
          <div className="absolute -bottom-[18px] left-[36px] w-0 h-0 
                           border-l-[14px] border-l-transparent
                           border-r-[0px] border-r-transparent
                           border-t-[24px] border-t-white
                           transform rotate-12">
          </div>

          <div className="text-center relative z-10">
            <h3 className="font-black text-2xl mb-2 text-black uppercase tracking-widest transform -rotate-2">
              Page {pageNum}
            </h3>
            <p className="font-bold text-black text-sm leading-tight transform rotate-1">
              "Wait until you see what happens in this panel!"
            </p>
          </div>

          {/* Decorative lines for 'action' effect */}
          <div className="absolute -top-4 -right-4 text-4xl text-black font-black rotate-12 animate-pulse">
            !
          </div>
        </div>
      </div>
    </div>
  );
};

function Book() {
  const audioRef = useRef(null);
  const bookRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 40;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

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

  const handleSearch = () => {
    const query = prompt('🔍 Search the book:');
    if (query) {
      alert(`Searching for "${query}"...\nThis feature will be fully implemented soon!`);
      // TODO: Implement search functionality
    }
  };

  const handleTableOfContents = () => {
    alert('📑 Table of Contents:\n\nCover - Page 0\nChapter 1 - Page 1\nChapter 2 - Page 10\nChapter 3 - Page 20\n\n(Jump to page feature coming soon!)');
    // TODO: Implement table of contents with page jumping
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const handlePrint = () => {
    alert(`🖨️ Printing page ${currentPage + 1}...\nPrint dialog will open soon!`);
    // TODO: Implement print functionality
    // window.print();
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

  const handleHighlight = () => {
    alert('✨ Highlighting feature coming soon!');
  };

  const handleNotes = () => {
    alert('📝 Notes feature coming soon!');
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full flex flex-col items-center justify-center transition-colors duration-500 ${isNightMode ? 'bg-slate-950/50' : ''} overflow-hidden`}>

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
        >
          {/* Front Cover */}
          <div className="page cover bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white flex flex-col items-center justify-center p-8 border-r-4 border-purple-950 relative overflow-hidden"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite'
            }}>
            {/* Animated background overlay */}
            <div className="absolute inset-0 opacity-30" style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
              animation: 'float 6s ease-in-out infinite'
            }}></div>

            <div className="text-center space-y-6 relative z-10">
              {/* Animated icon with floating and glow */}
              <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner"
                style={{
                  animation: 'float 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite'
                }}>
                <span className="text-4xl" style={{ animation: 'scaleIn 1s ease-out' }}>📚</span>
              </div>

              {/* Animated title */}
              <div style={{ animation: 'fadeInDown 1.2s ease-out 0.3s both' }}>
                <h1 className="text-5xl font-black tracking-tighter mb-2 font-serif bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% auto',
                    animation: 'gradientShift 4s linear infinite, fadeInDown 1.2s ease-out 0.3s both'
                  }}>
                  PAGAMBIT
                </h1>
                <p className="text-purple-200 text-sm tracking-[0.2em] uppercase" style={{ animation: 'fadeInUp 1.2s ease-out 0.5s both' }}>
                  Interactive Comic
                </p>
              </div>

              {/* Animated footer */}
              <div className="pt-12" style={{ animation: 'fadeInUp 1.2s ease-out 0.7s both' }}>
                <p className="text-xs text-purple-300/60">Mel Creatives Presents</p>
              </div>
            </div>
          </div>

          {/* Page 1 */}
          <div className="page bg-white p-0 overflow-hidden">
            <ImageWithOverlay
              src="/SCENE 13 - PANEL 1.png"
              alt="Page 1"
              pageNum={1}
            />
          </div>

          {/* Generated Pages */}
          {Array.from({ length: 38 }, (_, i) => i + 2).map((pageNum) => (
            <div key={pageNum} className="page bg-white p-0 overflow-hidden border-l border-slate-100">
              <ImageWithOverlay
                src={`https://placehold.co/450x636/f8f9fa/6b21a8?text=Page+${pageNum}`}
                alt={`Page ${pageNum}`}
                pageNum={pageNum}
              />
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 text-white flex flex-col items-center justify-center p-8 border-l-4 border-purple-950 relative overflow-hidden"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite reverse'
            }}>
            {/* Animated background overlay */}
            <div className="absolute inset-0 opacity-30" style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
              animation: 'float 6s ease-in-out infinite reverse'
            }}></div>

            <div className="text-center space-y-6 relative z-10">
              {/* Animated icon with floating and glow */}
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner"
                style={{
                  animation: 'float 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite'
                }}>
                <span className="text-3xl" style={{ animation: 'scaleIn 1s ease-out' }}>🏁</span>
              </div>

              {/* Animated title */}
              <div style={{ animation: 'fadeInDown 1.2s ease-out 0.3s both' }}>
                <h1 className="text-3xl font-black tracking-tighter mb-2 font-serif bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% auto',
                    animation: 'gradientShift 4s linear infinite, fadeInDown 1.2s ease-out 0.3s both'
                  }}>
                  THE END
                </h1>
                <p className="text-purple-200 text-xs tracking-[0.2em] uppercase" style={{ animation: 'fadeInUp 1.2s ease-out 0.5s both' }}>
                  Thanks for reading
                </p>
              </div>

              {/* Animated footer */}
              <div className="pt-8" style={{ animation: 'fadeInUp 1.2s ease-out 0.7s both' }}>
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
        isNightMode={isNightMode}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullScreen}
        onBookmark={handleBookmark}
        onDownload={handleDownload}
        onShare={handleShare}
        onHighlight={handleHighlight}
        onNotes={handleNotes}
        onSearch={handleSearch}
        onTableOfContents={handleTableOfContents}
        onToggleNightMode={toggleNightMode}
        onPrint={handlePrint}
        onJumpToCover={handleJumpToCover}
        onJumpToEnd={handleJumpToEnd}
      />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/Page Turn Sound Effect.mp3" preload="auto" />
    </div>
  );
}

export default Book;