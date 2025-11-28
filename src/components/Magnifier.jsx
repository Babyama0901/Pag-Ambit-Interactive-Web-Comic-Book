import React from 'react';

const Magnifier = ({ active, position, currentPageSrc }) => {
    if (!active || !currentPageSrc) return null;

    return (
        <div
            className="fixed pointer-events-none z-[60]"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Magnifier Frame */}
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                {/* Zoomed Content */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${currentPageSrc})`,
                        backgroundSize: '250%',
                        backgroundPosition: `${(position.x / window.innerWidth) * 100}% ${(position.y / window.innerHeight) * 100}%`,
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                {/* Inner ring */}
                <div className="absolute inset-2 rounded-full border-2 border-white/30 pointer-events-none" />
                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-px bg-white/40" />
                    <div className="absolute w-px h-full bg-white/40" />
                </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 blur-xl -z-10" />
        </div>
    );
};

export default Magnifier;
