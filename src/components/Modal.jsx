import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Small delay to allow render before animating in
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsVisible(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
          relative w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 
          rounded-[2rem] shadow-2xl overflow-hidden transform transition-all duration-300
          ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
