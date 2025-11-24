import React, { useState } from 'react';

const Controls = ({
    currentPage,
    totalPages,
    isMuted,
    isFullscreen,
    isNightMode,
    onPrevPage,
    onNextPage,
    onToggleMute,
    onToggleFullscreen,
    onBookmark,
    onDownload,
    onShare,
    onHighlight,
    onNotes,
    onSearch,
    onTableOfContents,
    onToggleNightMode,
    onPrint,
    onJumpToCover,
    onJumpToEnd,
    onJumpToPage
}) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Helper for icons
    const Icon = ({ path, className = "w-5 h-5" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
        </svg>
    );

    // Calculate progress percentage
    const progress = Math.round(((currentPage + 1) / totalPages) * 100);

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-all duration-300">

            {/* Help Dialog */}
            {showHelp && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setShowHelp(false)}>
                    <div className="bg-white/90 backdrop-blur-xl text-black rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/20 relative transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                            </button>
                        </div>

                        <h2 className="text-3xl font-black mb-2 tracking-tight">How to Read</h2>
                        <p className="text-gray-500 mb-6 font-medium">Quick tips for the best experience</p>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">👈</span>
                                <div>
                                    <p className="font-bold text-lg">Flip Pages</p>
                                    <p className="text-sm text-gray-500">Use arrows or drag page corners</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">📊</span>
                                <div>
                                    <p className="font-bold text-lg">Track Progress</p>
                                    <p className="text-sm text-gray-500">See your completion status below</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                                <span className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl">✨</span>
                                <div>
                                    <p className="font-bold text-lg">Explore</p>
                                    <p className="text-sm text-gray-500">Click icons for more tools</p>
                                </div>
                            </li>
                        </ul>
                        <button onClick={() => setShowHelp(false)} className="mt-8 w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                            Got it, let's read!
                        </button>
                    </div>
                </div>
            )}

            {/* More Menu Popup */}
            {showMoreMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-4 mx-4 p-6 bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-300 origin-bottom">
                    <div className="grid grid-cols-4 gap-4 sm:gap-6">
                        <MenuButton icon="M4 6h16M4 12h16M4 18h16" label="Contents" onClick={onTableOfContents} />
                        <MenuButton icon="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" label="Bookmark" onClick={onBookmark} />
                        <MenuButton icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" label="Search" onClick={onSearch} />
                        <MenuButton icon="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" label="Share" onClick={onShare} />

                        <MenuButton icon="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" label={isNightMode ? "Day Mode" : "Night Mode"} onClick={onToggleNightMode} active={isNightMode} />
                        <MenuButton icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" label="Download" onClick={onDownload} />
                        <MenuButton icon="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2.4-9h6m-1 6v6m-4-6v6m2-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 14h16" label="Print" onClick={onPrint} />
                        <MenuButton icon="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" label="Notes" onClick={onNotes} />
                    </div>
                </div>
            )}

            {/* Main Control Bar */}
            <div className="bg-black/70 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-3 flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300 hover:bg-black/80 hover:shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:scale-[1.01]">

                {/* Navigation Group */}
                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/5">
                    <ControlButton onClick={onPrevPage} icon="M15 19l-7-7 7-7" label="Previous" />
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <ControlButton onClick={onNextPage} icon="M9 5l7 7-7 7" label="Next" />
                </div>

                {/* Progress Group */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 w-full justify-center">
                        <span className="text-white font-bold text-sm tracking-wide">Page {currentPage + 1}</span>
                        <span className="text-white/30 text-xs font-medium uppercase tracking-wider">of {totalPages}</span>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative max-w-[120px] sm:max-w-[160px]">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-1.5 text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase">
                        {progress}% Done
                    </div>
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/5 hidden sm:flex">
                        <ControlButton
                            onClick={onToggleMute}
                            icon={isMuted ? "M5.586 5.586a2 2 0 002.828 0L16 13.172V17l-4.586-4.586-2.828 2.828A2 2 0 015.586 12.414l2.828-2.828-2.828-2.828z M12 8.828L16 4.828V8.828z" : "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"}
                            active={!isMuted}
                            className={!isMuted ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:bg-indigo-500/30" : "text-white/40 hover:text-white"}
                            label={isMuted ? "Unmute" : "Mute"}
                        />
                        <ControlButton
                            onClick={onToggleFullscreen}
                            icon={isFullscreen ? "M6 18L18 6M6 6l12 12" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"}
                            active={isFullscreen}
                            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        />
                        <ControlButton
                            onClick={() => setShowHelp(true)}
                            icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            label="Help"
                        />
                    </div>

                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${showMoreMenu ? 'bg-white text-black rotate-90 scale-110' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/10'}`}
                        title="More Options"
                    >
                        <Icon path="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </button>
                </div>

            </div>
        </div>
    );
};

const ControlButton = ({ onClick, icon, label, active = false, className = "" }) => (
    <button
        onClick={onClick}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${active && !className.includes('bg-') ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' : ''} ${!active && !className ? 'text-white hover:bg-white/10 hover:scale-110' : ''} ${className}`}
        title={label}
    >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
    </button>
);

const MenuButton = ({ icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all duration-200 group ${active ? 'bg-white text-black shadow-lg scale-105' : 'hover:bg-white/5 text-white/70 hover:text-white hover:scale-105'}`}
        title={label}
    >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-black/5' : 'bg-white/5 group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
        </div>
        <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
    </button>
);

export default Controls;
