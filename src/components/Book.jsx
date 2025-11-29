import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Controls from './Controls';
import Modal from './Modal';

// MediaPage Component (handles both Images and Videos)
const MediaPage = ({ src, alt, pageNum, speechBubbleSrc }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isVideo = src && src.toLowerCase().endsWith('.mp4');

  return (
    <div
      className="relative w-full h-full group overflow-hidden bg-white flex items-center justify-center p-0"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
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

      {/* Speech Bubble Overlay - Only show for images or if requested */}
      {!isVideo && speechBubbleSrc && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ease-in-out
            ${showOverlay ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <img
            src={`${import.meta.env.BASE_URL}${speechBubbleSrc}`}
            alt="Dialogue"
            className="w-full h-full object-contain"
          />
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
  const [zoom, setZoom] = useState(1.0);

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
          newHeight = (newWidth * 1.5);

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
  const handleSearch = () => setActiveDialog('search');
  const handleDownload = () => setActiveDialog('save');
  const handleShare = () => setActiveDialog('share');
  const handleTableOfContents = () => setActiveDialog('contents');
  const toggleNightMode = () => setIsNightMode(!isNightMode);
  const handlePrint = () => setActiveDialog('print');

  const handleZoomChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setZoom(newValue);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="relative z-10 flex items-center justify-center">
      <div
        className="transition-transform duration-300 ease-in-out"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out'
        }}
      >
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
          {/* Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white">
              <MediaPage
                src={`${import.meta.env.BASE_URL}${page.src || ''}`}
                alt={`Page ${index + 1}`}
                pageNum={index + 1}
                speechBubbleSrc={page.speechBubbleSrc}
              />
            </div>
          ))}

          {/* Back Cover */}
          <div className="page cover bg-white">
            <MediaPage
              src={`${import.meta.env.BASE_URL}Layout/BACK BOOK COVER.png`}
              alt="Back Cover"
              pageNum={pages.length + 1}
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
        onJumpToPage={handleJumpToPage}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
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

      <Modal
        isOpen={activeDialog === 'search'}
        onClose={() => setActiveDialog(null)}
        title="Search"
      >
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in book..."
              className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <svg className="w-5 h-5 text-white/40 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-white/50 text-sm text-center">Search functionality coming soon!</p>
        </div>
      </Modal>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}Page Turn Sound Effect.mp3`} preload="auto" />
    </div>
  );
}

export default Book;