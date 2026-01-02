import React, { useState } from 'react';
import Modal from './Modal';

const Controls = ({
    currentPage,
    totalPages,
    volume,
    isFullscreen,
    onPrevPage,
    onNextPage,
    onVolumeChange,
    onToggleFullscreen,
    onBookmark,
    onShare,
    onNotes,
    onTableOfContents,
    zoom = 1,
    onZoomChange,
    onZoomIn,
    onZoomOut,
    onToggleMobile,
    isMobileView,
    isMobileDevice // New prop from Book.jsx
}) => {
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
            {/* Help Dialog */}
            <Modal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                title="How to Use"
            >
                <div className="space-y-6 text-white/80">
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="p-1 rounded bg-indigo-500/20 text-indigo-300">
                                <Icon path="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" className="w-5 h-5" />
                            </span>
                            Navigation
                        </h3>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                            <li><strong>Flip Pages:</strong>Click or drag the page corners.</li>
                            <li><strong>Keyboard:</strong> Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">→</kbd> arrow keys.</li>
                            <li><strong>Mobile:</strong> Tap sides or swipe to turn.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="p-1 rounded bg-purple-500/20 text-purple-300">
                                <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" className="w-5 h-5" />
                            </span>
                            Features
                        </h3>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                            <li><strong>Controls:</strong> Automatic zoom, full-screen mode, and mobile view optimizer.</li>
                            <li><strong>Share:</strong> Quickly copy the book link to share with friends.</li>
                            <li><strong>Security:</strong> Screenshot and download protection is active.</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setShowHelp(false)}
                        className="w-full py-3 mt-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        Start Reading
                    </button>
                </div>
            </Modal>
            {/* Manual Toggle Container */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end
                    transition-transform duration-500 ease-in-out
                    ${(isVisible) ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}
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


                    {/* Main Control Bar - Compact */}
                    <div className="bg-black/80 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl px-5 py-2.5 flex items-center justify-evenly gap-6 sm:gap-8 transition-all duration-300 hover:bg-black/90 hover:scale-[1.01]">

                        {/* Navigation Group */}
                        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/5">
                            <ControlButton
                                onClick={onPrevPage}
                                icon={isMobileDevice ? "M5 15l7-7 7 7" : "M15 19l-7-7 7-7"}
                                label={isMobileDevice ? "Scroll Up" : "Previous"}
                            />
                            <div className="w-px h-5 bg-white/20 mx-1"></div>
                            <ControlButton
                                onClick={onNextPage}
                                icon={isMobileDevice ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                                label={isMobileDevice ? "Scroll Down" : "Next"}
                            />
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

                                {/* Volume Slider */}
                                <div className="flex items-center gap-2 px-2 group">
                                    <button
                                        onClick={() => onVolumeChange({ target: { value: volume === 0 ? 0.5 : 0 } })}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        <Icon path={volume === 0 ? "M5.586 5.586a2 2 0 002.828 0L16 13.172V17l-4.586-4.586-2.828 2.828A2 2 0 015.586 12.414l2.828-2.828-2.828-2.828z M12 8.828L16 4.828V8.828z" : "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"} className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={volume}
                                        onChange={onVolumeChange}
                                        className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300 opacity-70 group-hover:opacity-100 transition-opacity"
                                        title={`Volume: ${Math.round(volume * 100)}%`}
                                    />
                                </div>

                                <ControlButton
                                    onClick={onToggleMobile}
                                    icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    active={isMobileView}
                                    className={isMobileView ? "bg-indigo-500/20 text-indigo-300" : ""}
                                    label={isMobileView ? "Spread View" : "Single Page"}
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
                                onClick={onShare}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                title="Share"
                            >
                                <Icon path="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
