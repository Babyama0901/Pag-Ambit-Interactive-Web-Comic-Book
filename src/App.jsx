import React, { useState, useEffect } from 'react';
import Book from './components/Book';

function App() {
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    const handleDragStart = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Prevent F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return;
      }

      // Prevent Inspect Element: Ctrl/Cmd + Shift + I/J/C
      if (isCtrlOrCmd && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return;
      }

      // Prevent View Source: Ctrl/Cmd + U
      if (isCtrlOrCmd && e.keyCode === 85) {
        e.preventDefault();
        return;
      }

      // Prevent Save/Print: Ctrl/Cmd + S/P
      if (isCtrlOrCmd && (e.keyCode === 83 || e.keyCode === 80)) {
        e.preventDefault();
        return;
      }

      // Prevent Copy/Cut/Select All: Ctrl/Cmd + C/X/A
      if (isCtrlOrCmd && (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 65)) {
        e.preventDefault();
        return;
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
