import React, { useState } from 'react';

const Controls = ({
    currentPage,
    totalPages,
    isMuted,
    isFullscreen,
    onPrevPage,
    onNextPage,
    onToggleMute,
    onToggleFullscreen,
    onBookmark,
    onShare,
    onHighlight,
    onNotes,
    onTableOfContents,
    zoom = 1,
    onZoomChange,
    onZoomIn,
    onZoomOut
}) => {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showHelp, setShowHelp] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    // Helper for icons
    const Icon = ({ path, className = "w-5 h-5" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
        </svg>
    );

    // Calculate progress percentage
    const progress = Math.round(((currentPage + 1) / totalPages) * 100);

    return (
        <>
            {/* Help Dialog - Moved outside to escape stacking context of transformed parent */}
            {showHelp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setShowHelp(false)}>
                    {/* Backdrop with blur */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                    {/* Dialog Content */}
                    <div
                        className="relative bg-white/90 backdrop-blur-2xl text-slate-900 rounded-[2.5rem] p-8 max-w-lg w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative background gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors group"
                            >
                                <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>
                        </div>

                        {/* Header */}
                        <div className="relative z-10 mb-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                <span className="text-3xl">💡</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">How to Navigate</h2>
                            <p className="text-slate-500 font-medium">Master the controls for the best experience</p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-5 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                    <Icon path="M15 19l-7-7 7-7" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">Flip Pages</p>
                                    <p className="text-sm text-slate-500 font-medium">Click arrows, drag corners, or use keys</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                                    <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">Controls</p>
                                    <p className="text-sm text-slate-500 font-medium">Click bottom arrow to Show/Hide menu</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                    <Icon path="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">Read Dialogues</p>
                                    <p className="text-sm text-slate-500 font-medium">Hover to read. Long-press (1.5s) to lock.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setShowHelp(false)}
                            className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20 relative z-10"
                        >
                            Start Reading
                        </button>
                    </div>
                </div>
            )}

            {/* Manual Toggle Container */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end
                    transition-transform duration-500 ease-in-out
                    ${(isVisible || showMoreMenu) ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}
                    pointer-events-none md:pointer-events-none
                `}
            >
                {/* Toggle Button - Visible Handle */}
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="
                        h-12 px-8 rounded-t-2xl pointer-events-auto
                        bg-black/60 backdrop-blur-md border-t border-x border-white/10
                        text-white/70 hover:text-white hover:bg-black/80
                        flex items-center justify-center -mb-px relative z-10
                        shadow-[0_-5px_15px_rgba(0,0,0,0.2)] transition-all
                    "
                    aria-label={isVisible ? "Hide Controls" : "Show Controls"}
                >
                    <Icon
                        path={isVisible ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
                        className={`w-6 h-6 transition-transform duration-300 ${isVisible ? '' : '-translate-y-0.5'}`}
                    />
                </button>

                {/* Control Bar Container */}
                <div className="w-auto max-w-5xl pb-6 px-4 pointer-events-auto relative z-20">
                    {/* More Menu Popup */}
                    {showMoreMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-4 mx-4 p-6 bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-300 origin-bottom">
                            <div className="grid grid-cols-4 gap-4 sm:gap-6">
                                <MenuButton icon="M4 6h16M4 12h16M4 18h16" label="Contents" onClick={onTableOfContents} />
                                <MenuButton icon="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" label="Bookmark" onClick={onBookmark} />

                                <MenuButton icon="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" label="Share" onClick={onShare} />

                                <MenuButton icon="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" label="Notes" onClick={onNotes} />
                            </div>
                        </div>
                    )}

                    {/* Main Control Bar - Compact */}
                    <div className="bg-black/80 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl px-5 py-2.5 flex items-center justify-evenly gap-6 sm:gap-8 transition-all duration-300 hover:bg-black/90 hover:scale-[1.01]">

                        {/* Navigation Group */}
                        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/5">
                            <ControlButton onClick={onPrevPage} icon="M15 19l-7-7 7-7" label="Previous" />
                            <div className="w-px h-5 bg-white/20 mx-1"></div>
                            <ControlButton onClick={onNextPage} icon="M9 5l7 7-7 7" label="Next" />
                        </div>

                        {/* Progress Group */}
                        <div className="flex flex-col items-center justify-center px-2 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-bold text-xs tracking-wide">Page {currentPage + 1}</span>
                                <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">/ {totalPages}</span>
                            </div>

                            <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions Group */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/5 hidden sm:flex">
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
                                <ControlButton
                                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfYRcTWuNWiLPIFYqDup_AFKk48XFBGkSWXTGrUS93fB3zlPg/viewform?usp=dialog', '_blank')}
                                    icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    label="Survey"
                                />
                            </div>

                            {/* Zoom Group - Compact */}
                            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/5 hidden md:flex">
                                <button onClick={onZoomOut} className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all" title="Zoom Out">
                                    <Icon path="M20 12H4" className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-2 w-24 px-2">
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={onZoomChange}
                                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300"
                                    />
                                </div>

                                <button onClick={onZoomIn} className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all" title="Zoom In">
                                    <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => onZoomChange({ target: { value: 1.0 } })}
                                    className="text-[10px] font-bold text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-all"
                                    title="Reset Zoom"
                                >
                                    {Math.round(zoom * 100)}%
                                </button>
                            </div>

                            <button
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${showMoreMenu ? 'bg-white text-black rotate-90' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                                title="More Options"
                            >
                                <Icon path="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

const ControlButton = ({ onClick, icon, label, active = false, className = "" }) => (
    <button
        onClick={onClick}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${active && !className.includes('bg-') ? 'bg-white text-black shadow-lg scale-105' : ''} ${!active && !className ? 'text-white hover:bg-white/20 hover:scale-110' : ''} ${className}`}
        title={label}
    >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
