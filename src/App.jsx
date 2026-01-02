import React, { useState, useEffect } from 'react';
import Book from './components/Book';
import Modal from './components/Modal';
import { Lock } from 'lucide-react';

function App() {
  const [zoom, setZoom] = useState(1.0);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');

  const triggerSecurityAlert = (message) => {
    setSecurityMessage(message);
    setShowSecurityDialog(true);
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerSecurityAlert('This content is protected provided by Pag-Ambit.');
    };

    const handleDragStart = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Prevent F12
      if (e.keyCode === 123) {
        e.preventDefault();
        triggerSecurityAlert('Developer tools are disabled.');
        return;
      }

      // Prevent Inspect Element: Ctrl/Cmd + Shift + I/J/C
      if (isCtrlOrCmd && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        triggerSecurityAlert('Developer tools are disabled.');
        return;
      }

      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        // Note: Accessing clipboard/screenshots programmatically is restricted, 
        // but we can try to intercept the key event if possible.
        // Often PrintScreen isn't fully preventable, but we can show the dialog.
        // No preventDefault() for standard OS screenshot, but we can try.
        e.preventDefault();
        triggerSecurityAlert('Screenshots are not allowed.');
      }

      // Prevent View Source: Ctrl/Cmd + U
      if (isCtrlOrCmd && e.keyCode === 85) {
        e.preventDefault();
        triggerSecurityAlert('Viewing source is disabled.');
        return;
      }

      // Prevent Save/Print: Ctrl/Cmd + S/P
      if (isCtrlOrCmd && (e.keyCode === 83 || e.keyCode === 80)) {
        e.preventDefault();
        triggerSecurityAlert('Saving or printing is disabled.');
        return;
      }

      // Prevent Copy/Cut/Select All: Ctrl/Cmd + C/X/A
      if (isCtrlOrCmd && (e.keyCode === 67 || e.keyCode === 88 || e.keyCode === 65)) {
        e.preventDefault();
        triggerSecurityAlert('Content copying is disabled.');
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

      <Modal
        isOpen={showSecurityDialog}
        onClose={() => setShowSecurityDialog(false)}
        title="Content Protected"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-4 bg-purple-600/20 rounded-full">
            <Lock className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-white/90 text-lg font-medium leading-relaxed">
            {securityMessage}
          </p>
          <p className="text-white/50 text-sm">
            © 2024 Pag-Ambit. All rights reserved.
          </p>
          <button
            onClick={() => setShowSecurityDialog(false)}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors font-medium"
          >
            Understood
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
