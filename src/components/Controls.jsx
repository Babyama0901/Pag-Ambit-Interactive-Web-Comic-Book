import React, { useState } from 'react';
import Modal from './Modal';
import { BookOpen, Command, Smartphone, Settings, Share2, Shield, MousePointer2 } from 'lucide-react';

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
    isMobileDevice
}) => {
    const [showHelp, setShowHelp] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    // Helper for icons (keeping existing SVGs for control bar consistency, using Lucide for Modal)
    const Icon = ({ path, className = "w-5 h-5" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
        </svg>
    );

    const progress = Math.round(((currentPage + 1) / totalPages) * 100);

    return (
        <>
            <Modal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                title="Welcome to Pag-Ambit"
            >
                <div className="space-y-8 text-white/90">
                    <p className="text-white/60 text-lg leading-relaxed">
                        Experience the interactive comic book with gesture controls and immersive features.
                    </p>

                    <div className="grid gap-6">
                        <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-3">
                                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                                    <BookOpen size={20} />
                                </div>
                                Navigation
                            </h3>
                            <ul className="space-y-3 text-sm text-white/70">
                                <li className="flex items-start gap-3">
                                    <MousePointer2 size={16} className="mt-0.5 shrink-0 opacity-50" />
                                    <span>Click or drag page corners to flip</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Command size={16} className="mt-0.5 shrink-0 opacity-50" />
                                    <span>Use arrow keys <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">→</kbd></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Smartphone size={16} className="mt-0.5 shrink-0 opacity-50" />
                                    <span>Tap sides or swipe on touch devices</span>
                                </li>
                            </ul>
                        </div>

                        <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-3">
                                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                                    <Settings size={20} />
                                </div>
                                Features
                            </h3>
                            <ul className="space-y-3 text-sm text-white/70">
                                <li className="flex items-start gap-3">
                                    <div className="w-4 h-4 mt-0.5 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                                    </div>
                                    <span>Smart Zoom & Fullscreen Mode</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Share2 size={16} className="mt-0.5 shrink-0 opacity-50" />
                                    <span>One-click sharing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Shield size={16} className="mt-0.5 shrink-0 opacity-50" />
                                    <span>Content protection enabled</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowHelp(false)}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                        h-10 px-12 rounded-t-xl pointer-events-auto
                        glass-panel border-b-0
                        text-white/50 hover:text-white
                        flex items-center justify-center -mb-px relative z-10
                        transition-all hover:bg-white/10
                    "
                    aria-label={isVisible ? "Hide Controls" : "Show Controls"}
                >
                    <div className={`w-12 h-1 bg-white/20 rounded-full transition-all duration-300 ${isVisible ? 'bg-white/40' : ''}`} />
                </button>

                {/* Control Bar Container */}
                <div className="w-auto max-w-5xl pb-6 px-4 pointer-events-auto relative z-20">
                    <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-evenly gap-6 sm:gap-8 transition-all duration-300">

                        {/* Navigation Group */}
                        <div className="flex items-center gap-2">
                            <ControlButton
                                onClick={onPrevPage}
                                icon={isMobileDevice ? "M5 15l7-7 7 7" : "M15 19l-7-7 7-7"}
                                label={isMobileDevice ? "Scroll Up" : "Previous"}
                                className="glass-button hover:bg-white/10"
                            />
                            <div className="w-px h-6 bg-white/10 mx-2"></div>
                            <ControlButton
                                onClick={onNextPage}
                                icon={isMobileDevice ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                                label={isMobileDevice ? "Scroll Down" : "Next"}
                                className="glass-button hover:bg-white/10"
                            />
                        </div>

                        {/* Progress Group */}
                        <div className="flex flex-col items-center justify-center px-4 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-medium text-sm tracking-wide">Page {currentPage + 1}</span>
                                <span className="text-white/30 text-xs font-medium">/ {totalPages}</span>
                            </div>

                            <div className="w-32 sm:w-56 h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                                    style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                                />
                            </div>
                        </div>

                        {/* Actions Group */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 hidden sm:flex">

                                <ControlButton
                                    onClick={onToggleMobile}
                                    icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    active={isMobileView}
                                    className={isMobileView ? "bg-indigo-500/80 text-white shadow-lg shadow-indigo-500/20" : "glass-button"}
                                    label={isMobileView ? "Spread View" : "Single Page"}
                                />
                                <ControlButton
                                    onClick={onToggleFullscreen}
                                    icon={isFullscreen ? "M6 18L18 6M6 6l12 12" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"}
                                    active={isFullscreen}
                                    className={isFullscreen ? "bg-white text-black" : "glass-button"}
                                    label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                />

                                <div className="w-px h-6 bg-white/10 mx-1"></div>

                                <ControlButton
                                    onClick={() => setShowHelp(true)}
                                    icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    className="glass-button"
                                    label="Help"
                                />
                            </div>

                            {/* Zoom Group */}
                            <div className="flex items-center gap-2 pl-2 border-l border-white/10 hidden md:flex">
                                <button onClick={onZoomOut} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                    <Icon path="M20 12H4" className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-mono text-white/70 w-8 text-center">{Math.round(zoom * 100)}%</span>
                                <button onClick={onZoomIn} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                    <Icon path="M12 4v16m8-8H4" className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={onShare}
                                className="ml-2 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all"
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
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${className} ${!className.includes('bg-') && !className.includes('text-') ? 'text-white/70 hover:text-white' : ''}`}
        title={label}
    >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
    </button>
);

export default Controls;
