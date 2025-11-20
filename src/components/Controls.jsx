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
    Settings
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
    const [showSettings, setShowSettings] = useState(false);
    const progress = Math.round(((currentPage) / totalPages) * 100);
    const progressWidth = (currentPage / totalPages) * 100;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 group">
            {/* Progress Bar */}
            <div className="relative h-1 bg-gray-800/60 cursor-pointer hover:h-1.5 transition-all">
                <div
                    className="absolute top-0 left-0 h-full bg-red-600 transition-all"
                    style={{ width: `${progressWidth}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            {/* Controls Panel - YouTube Style */}
            <div className="bg-gradient-to-t from-black/90 via-black/75 to-transparent px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">

                    {/* Left Controls */}
                    <div className="flex items-center gap-2">
                        {/* Navigation */}
                        <button
                            onClick={onPrevPage}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title="Previous Page (Arrow Left)"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            onClick={onNextPage}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title="Next Page (Arrow Right)"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Volume */}
                        <button
                            onClick={onToggleMute}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* Page Counter */}
                        <div className="text-white text-sm font-medium ml-1">
                            <span className="tabular-nums">{currentPage + 1}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-400 tabular-nums">{totalPages}</span>
                        </div>
                    </div>

                    {/* Center - Title/Info */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <span className="text-white text-sm font-medium">Pagambit - Interactive Comic Book</span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-1 relative">
                        {/* Quick Jump */}
                        <button
                            onClick={onJumpToCover}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title="Jump to Cover"
                        >
                            <SkipBack size={20} />
                        </button>

                        <button
                            onClick={onJumpToEnd}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title="Jump to End"
                        >
                            <SkipForward size={20} />
                        </button>

                        {/* Settings Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                                title="Settings"
                            >
                                <Settings size={20} />
                            </button>

                            {/* Settings Dropdown */}
                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 py-2 text-sm">
                                    <SettingsItem icon={Search} label="Search" onClick={() => { onSearch(); setShowSettings(false); }} />
                                    <SettingsItem icon={List} label="Table of Contents" onClick={() => { onTableOfContents(); setShowSettings(false); }} />
                                    <div className="border-t border-gray-700 my-1"></div>
                                    <SettingsItem icon={Bookmark} label="Bookmark Page" onClick={() => { onBookmark(); setShowSettings(false); }} />
                                    <SettingsItem icon={Printer} label="Print Current Page" onClick={() => { onPrint(); setShowSettings(false); }} />
                                    <SettingsItem icon={Download} label="Download Book" onClick={() => { onDownload(); setShowSettings(false); }} />
                                    <SettingsItem icon={Share2} label="Share Link" onClick={() => { onShare(); setShowSettings(false); }} />
                                </div>
                            )}
                        </div>

                        {/* Night Mode */}
                        <button
                            onClick={onToggleNightMode}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title={isNightMode ? "Day Mode" : "Night Mode"}
                        >
                            {isNightMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={onToggleFullscreen}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
                        >
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>

                {/* Progress Text */}
                <div className="absolute top-2 left-4 text-xs text-white/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {progress}% Complete
                </div>
            </div>
        </div>
    );
};

const SettingsItem = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
);

export default Controls;
