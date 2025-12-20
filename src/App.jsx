import React, { useState, useEffect } from 'react';
import Book from './components/Book';

function App() {
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    const handleDragStart = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
      // Prevent Ctrl+S (Save), Ctrl+P (Print)
      if ((e.ctrlKey && e.keyCode === 83) || (e.ctrlKey && e.keyCode === 80)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleZoomChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setZoom(newValue);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
      <div className="app-background" />
      <div className="z-10 w-full h-full flex items-center justify-center p-4">
        <Book
          zoom={zoom}
          onZoomChange={handleZoomChange}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      </div>
    </div>
  );
}

export default App;
