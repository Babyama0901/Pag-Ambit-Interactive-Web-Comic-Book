/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
    Volume2,
    VolumeX,
    ChevronLeft,
    ChevronRight,
    Maximize,
    Minimize,
    Bookmark,
    Download,
    Share2,
    Search,
    List,
    Moon,
    Sun,
    Printer,
    SkipBack,
    SkipForward,
    MoreHorizontal,
    X
} from 'lucide-react';

const Controls = ({
    currentPage,
    totalPages,
    isMuted,
    isFullscreen,
    isNightMode = false,
    onPrevPage,
    onNextPage,
    onToggleMute,
    onToggleFullscreen,
    onBookmark,
    onDownload,
    onShare,
    onSearch,
    onTableOfContents,
    onToggleNightMode,
    onPrint,
    onJumpToCover,
    onJumpToEnd
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const progress = (currentPage / totalPages) * 100;

    return (
        <>
            {/* Floating Dynamic Island Control Bar */}
            <div className="relative mt-8 z-50 flex flex-col items-center gap-4 w-full max-w-3xl px-4 pointer-events-none">

                {/* Main Control Pill - iOS 26 Glass Effect */}
                <div className="pointer-events-auto relative group">
                    {/* Adaptive Glass Background - Brightened for visibility */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[40px] backdrop-saturate-150 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:bg-white/15 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] group-hover:border-white/30" />

                    {/* Inner Glow/Reflection */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative p-2 flex items-center gap-2">

                        {/* Left: Playback/Nav */}
                        <div className="flex items-center gap-1 pl-2">
                            <IOSButton
                                onClick={onPrevPage}
                                icon={ChevronLeft}
                                label="Previous"
                                className="w-12 h-12 !rounded-full"
                            />

                            <div className="flex flex-col items-center justify-center w-24 px-2">
                                <span className="text-white font-semibold text-lg leading-none tracking-tight font-display text-shadow-sm">
                                    {currentPage + 1}
                                </span>
                                <span className="text-white/50 text-[10px] font-medium uppercase tracking-widest mt-0.5">
                                    of {totalPages}
                                </span>
                            </div>

                            <IOSButton
                                onClick={onNextPage}
                                icon={ChevronRight}
                                label="Next"
                                className="w-12 h-12 !rounded-full"
                            />
                        </div>

                        <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

                        {/* Center: Progress Scrubber */}
                        <div className="flex-1 min-w-[120px] group/scrubber cursor-pointer relative py-4">
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300 group-hover/scrubber:shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {/* Hover Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl text-white text-xs font-medium py-1.5 px-3 rounded-full opacity-0 group-hover/scrubber:opacity-100 transition-all duration-300 translate-y-2 group-hover/scrubber:translate-y-0 border border-white/10 shadow-lg pointer-events-none">
                                {Math.round(progress)}%
                            </div>
                        </div>

                        <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

                        {/* Right: Quick Actions */}
                        <div className="flex items-center gap-1 pr-1">
                            <IOSButton
                                onClick={onToggleMute}
                                icon={isMuted ? VolumeX : Volume2}
                                active={isMuted}
                                label="Mute"
                            />
                            <IOSButton
                                onClick={onToggleFullscreen}
                                icon={isFullscreen ? Minimize : Maximize}
                                active={isFullscreen}
                                label="Fullscreen"
                            />
                            <IOSButton
                                onClick={() => setShowMenu(!showMenu)}
                                icon={showMenu ? X : MoreHorizontal}
                                active={showMenu}
                                className={`transition-transform duration-300 ${showMenu ? 'rotate-90 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}`}
                                label="Menu"
                            />
                        </div>
                    </div>
                </div>

                {/* Expanded Menu (iOS Sheet Style) */}
                <div className={`
                    pointer-events-auto w-full max-w-sm relative overflow-hidden transition-all duration-500 origin-bottom z-40
                    ${showMenu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none absolute bottom-0'}
                `}>
                    {/* Glass Background for Menu */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[50px] backdrop-saturate-150 rounded-[2rem] border border-white/10 shadow-2xl" />

                    <div className="relative p-4 space-y-4">
                        <div className="grid grid-cols-4 gap-3">
                            <MenuButton icon={Search} label="Search" onClick={onSearch} />
                            <MenuButton icon={List} label="Contents" onClick={onTableOfContents} />
                            <MenuButton icon={Bookmark} label="Bookmark" onClick={onBookmark} />
                            <MenuButton icon={isNightMode ? Sun : Moon} label={isNightMode ? "Day" : "Night"} onClick={onToggleNightMode} active={isNightMode} />

                            <MenuButton icon={SkipBack} label="Start" onClick={onJumpToCover} />
                            <MenuButton icon={SkipForward} label="End" onClick={onJumpToEnd} />
                            <MenuButton icon={Printer} label="Print" onClick={onPrint} />
                            <MenuButton icon={Download} label="Save" onClick={onDownload} />
                        </div>

                        <button
                            onClick={onShare}
                            className="w-full bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all rounded-2xl p-3.5 flex items-center justify-center gap-2 text-white font-medium border border-white/5 group"
                        >
                            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Share Book</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const IOSButton = ({ icon: Icon, onClick, label, active, className = "" }) => (
    <button
        onClick={onClick}
        className={`
            relative group p-3 rounded-2xl transition-all duration-300 active:scale-90 overflow-hidden
            ${active ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'text-white hover:bg-white/10'}
            ${className}
        `}
        title={label}
    >
        {/* Button Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Icon size={20} strokeWidth={2} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
    </button>
);

const MenuButton = ({ icon: Icon, label, onClick, active }) => (
    <button
        onClick={onClick}
        className={`
            flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 active:scale-90 relative overflow-hidden group
            ${active ? 'bg-indigo-500/30 text-indigo-200 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'}
        `}
    >
        <div className={`p-2 rounded-full transition-all duration-300 ${active ? 'bg-indigo-500/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
);

export default Controls;
