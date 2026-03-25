/**
 * PDF Viewer Component with zoom and pan capabilities
 */

import React, { useState, useRef } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  gaName?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, gaName }) => {
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2 || e.ctrlKey) {
      // Right click or Ctrl+click for panning
      setIsPanning(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, Math.min(prev + delta, 3)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 text-sm font-medium"
            title="Zoom Out"
          >
            −
          </button>
          <span className="text-sm font-medium text-gray-700 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 text-sm font-medium"
            title="Zoom In"
          >
            +
          </button>
        </div>

        <div className="border-l border-gray-300 h-6" />

        <button
          onClick={handleResetZoom}
          className="px-3 py-2 hover:bg-gray-100 rounded border border-gray-300 text-sm font-medium"
          title="Reset View"
        >
          Reset
        </button>

        {gaName && (
          <div className="ml-auto">
            <span className="text-sm text-gray-600">
              📄 {gaName}
            </span>
          </div>
        )}
      </div>

      {/* PDF Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          userSelect: 'none',
        }}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <iframe
            src={pdfUrl}
            className="w-screen h-screen pointer-events-none"
            title="GA PDF Viewer"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        <p>💡 Use Ctrl+Scroll to zoom | Right-click + drag to pan | Press [Space] + drag to pan</p>
      </div>
    </div>
  );
};
