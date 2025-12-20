import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';

// MediaPage Component (handles both Images and Videos)
const MediaPage = ({ src, alt, pageNum, hasSpeechBubble, speechText }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const isVideo = src && src.toLowerCase().endsWith('.mp4');

  return (
    <div
      className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
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
          
          onError={(e) => { e.target.src = 'https://placehold.co/450x636/e9d5ff/6b21a8?text=Page+' + pageNum }}
        />
      )}

      {/* Speech Bubble Overlay - Only show for images or if requested */}
      {!isVideo && hasSpeechBubble && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
        >
          <div className={`relative bg-white border-4 border-black rounded-[50%] p-8 w-64 h-48 flex flex-col items-center justify-center shadow-[8px_8px_0px_rgba(0,0,0,0.2)]
                          transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] origin-bottom-left
                          ${showOverlay ? 'opacity-100 scale-100 translate-y-0 rotate-0' : 'opacity-0 scale-0 translate-y-20 -rotate-12'}`}
            style={{
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' // Organic speech bubble shape
            }}
          >
            {/* Bubble Tail */}
            <div className="absolute -bottom-6 left-10 w-0 h-0 
                            border-l-[20px] border-l-transparent
                            border-r-[0px] border-r-transparent
                            border-t-[40px] border-t-black
                            transform -rotate-12">
            </div>
            <div className="absolute -bottom-[18px] left-[44px] w-0 h-0 
                            border-l-[16px] border-l-transparent
                            border-r-[0px] border-r-transparent
                            border-t-[32px] border-t-white
                            transform -rotate-12">
            </div>

            {/* Content */}
            <div className="text-center z-10">
              <h3 className="font-black text-2xl mb-2 tracking-tighter transform -rotate-2">
                {speechText || "OPEN OVERLAY!"}
              </h3>
            </div>

            {/* Decorative lines */}
            <div className="absolute top-4 right-6 w-4 h-1 bg-black rounded-full transform rotate-12 opacity-20"></div>
            <div className="absolute bottom-6 left-6 w-2 h-2 bg-black rounded-full opacity-20"></div>
          </div>
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

  const pages = [
    { type: 'toc' },
    { type: 'blank' },
    { src: 'Layout/SCENE 1 - PAGE 1.png', alt: 'Scene 1 Page 1' },
    { src: 'Layout/SCENE 1 - PAGE 2.png', alt: 'Scene 1 Page 2' },
    { src: 'Layout/SCENE 1 - PAGE 3.png', alt: 'Scene 1 Page 3' },
    { src: 'Layout/SCENE 2 - PAGE 4.png', alt: 'Scene 2 Page 4' },
    { src: 'Layout/SCENE 2 - PAGE 5.png', alt: 'Scene 2 Page 5' },
    { src: 'Layout/SCENE 2 - PAGE 6.png', alt: 'Scene 2 Page 6' },
    { src: 'Layout/SCENE 2 - PAGE 7.png', alt: 'Scene 2 Page 7' },
    { src: 'Layout/SCENE 2 - PAGE 8.png', alt: 'Scene 2 Page 8' },
    { src: 'Layout/SCENE 3 - PAGE 9.png', alt: 'Scene 3 Page 9' },
    { src: 'Layout/SCENE 3 - PAGE 10.png', alt: 'Scene 3 Page 10' },
    { src: 'Layout/SCENE 3 - PAGE 11.png', alt: 'Scene 3 Page 11' },
    { src: 'Layout/SCENE 3 - PAGE 12.png', alt: 'Scene 3 Page 12' },
    { src: 'Layout/SCENE 4 - PAGE 13.png', alt: 'Scene 4 Page 13' },
    { src: 'Layout/SCENE 4 - PAGE 14.png', alt: 'Scene 4 Page 14' },
    { src: 'Layout/SCENE 4 - PAGE 15.png', alt: 'Scene 4 Page 15' },
    { src: 'Layout/SCENE 4 - PAGE 16.png', alt: 'Scene 4 Page 16' },
    { src: 'Layout/SCENE 5 - PAGE 17.png', alt: 'Scene 5 Page 17' },
    { src: 'Layout/SCENE 5 - PAGE 18.png', alt: 'Scene 5 Page 18' },
    { src: 'Layout/SCENE 5 - PAGE 19.png', alt: 'Scene 5 Page 19' },
    { src: 'Layout/SCENE 5 - PAGE 20.png', alt: 'Scene 5 Page 20' },
    { src: 'Layout/SCENE 5 - PAGE 21.png', alt: 'Scene 5 Page 21' },
    { src: 'Layout/SCENE 6 - PAGE 22.png', alt: 'Scene 6 Page 22' },
    { src: 'Layout/SCENE 6 - PAGE 23.png', alt: 'Scene 6 Page 23' },
    { src: 'Layout/SCENE 7 - PAGE 24.png', alt: 'Scene 7 Page 24' },
    { src: 'Layout/SCENE 7 - PAGE 25.png', alt: 'Scene 7 Page 25' },
    { src: 'Layout/SCENE 8 - PAGE 26.png', alt: 'Scene 8 Page 26' },
    { src: 'Layout/SCENE 8 - PAGE 27.png', alt: 'Scene 8 Page 27' },
    { src: 'Layout/SCENE 9 - PAGE 28.png', alt: 'Scene 9 Page 28' },
    { src: 'Layout/SCENE 9 - PAGE 29.png', alt: 'Scene 9 Page 29' },
    { src: 'Layout/SCENE 10 - PAGE 30.png', alt: 'Scene 10 Page 30' },
    { src: 'Layout/SCENE 11 - PAGE 31.png', alt: 'Scene 11 Page 31' },
    { src: 'Layout/SCENE 11 - PAGE 32.png', alt: 'Scene 11 Page 32' },
    { src: 'Layout/SCENE 11 - PAGE 33.png', alt: 'Scene 11 Page 33' },
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
                  <span className="tracking-[0.2em]">PAGAMBIT</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white">
              {page.type === 'toc' ? (
                <div className="w-full h-full p-10 flex flex-col bg-[#fdfbf7]">
                  {/* Decorative Header */}
                  <div className="relative mb-12 text-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-32 h-32 rounded-full border-4 border-black"></div>
                    </div>
                    <h2 className="relative text-4xl font-serif font-black tracking-widest uppercase text-slate-900 z-10">
                      Contents
                    </h2>
                    <div className="w-16 h-1 bg-purple-600 mx-auto mt-4 rounded-full"></div>
                  </div>

                  {/* TOC List */}
                  <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar px-4">
                    {[
                      { title: "Prologue", subtitle: "The Beginning", page: 1 },
                      { title: "Chapter I", subtitle: "The Awakening", page: 2 },
                      { title: "Chapter II", subtitle: "The Journey", page: 3 },
                      { title: "Epilogue", subtitle: "The End", page: 4 }
                    ].map((item, i) => (
                      <div key={i}
                        className="group relative flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-100"
                        onClick={() => bookRef.current?.pageFlip()?.flip(item.page + 1)}>

                        {/* Number */}
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-black text-slate-200 group-hover:text-purple-200 transition-colors font-serif">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-purple-900 text-lg tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest group-hover:text-purple-400">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Page Number */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center text-slate-400 group-hover:text-purple-600 font-bold text-sm transition-colors">
                          {item.page}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center border-t border-slate-200 pt-6">
                    <p className="text-slate-400 text-xs tracking-[0.2em] uppercase">
                      Interactive Comic
                    </p>
                  </div>
                </div>
              ) : (
                <MediaPage
                  src={`${import.meta.env.BASE_URL}${page.src || ''}`}
                  alt={`Page ${index + 1}`}
                  pageNum={index + 1}
                  hasSpeechBubble={page.hasSpeechBubble}
                  speechText={page.speechText}
                />
              )}
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
          onTableOfContents={() => setActiveDialog('contents')}
          onToggleNightMode={toggleNightMode}
          onPrint={() => setActiveDialog('print')}
          onJumpToCover={handleJumpToCover}
          onJumpToEnd={handleJumpToEnd}
          onJumpToPage={handleJumpToPage}
        />

        {/* Dialogs */}
        <Modal
          isOpen={activeDialog === 'contents'}
          onClose={() => setActiveDialog(null)}
          title="Table of Contents"
        >
          <div className="space-y-2">
            {[
              { title: "Cover", page: 0 },
              { title: "Scene 1", page: 1 },
              { title: "Scene 5", page: 4 },
              { title: "Scene 6", page: 10 },
              { title: "Scene 7", page: 16 },
              { title: "Scene 8", page: 20 }
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