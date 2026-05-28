/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Share2, 
  LayoutGrid, 
  BookOpen, 
  Check,
  FileCode
} from 'lucide-react';
import { useBook } from './BookStateContext';

export const BottomToolbar = () => {
  const { 
    currentPage, 
    totalPages, 
    zoomLevel, 
    setZoomLevel, 
    resetBook,
    setPage,
    zoomIn,
    zoomOut,
    jsonEditorOpen,
    setJsonEditorOpen
  } = useBook();

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state in case it changes natively via ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const getPageCounterText = () => {
    if (currentPage === 1) {
      return 'Cover Page (1)';
    }
    const endRange = Math.min(currentPage + 1, totalPages);
    if (currentPage >= totalPages) {
      return `Back Cover (${totalPages})`;
    }
    return `Pages ${currentPage}-${endRange} of ${totalPages}`;
  };

  const handleShareClick = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }).catch((e) => {
        console.error('Share link copy failed', e);
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-13 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between px-4 md:px-10 z-40 select-none">
      
      {/* Left Segment: Reset and Page Indicator */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Reset / Reload Button */}
        <button
          id="toolbar-refresh-button"
          type="button"
          onClick={resetBook}
          title="Reset to Cover Page"
          className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full border-0 transition-colors pointer-events-auto cursor-pointer focus:outline-none"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Quick Spread selector jump - Jump to Table of Contents (Page 2) */}
        <button
          id="toolbar-toc-jump-button"
          type="button"
          onClick={() => setPage(2)}
          title="Jump to Index/TOC"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-full pointer-events-auto cursor-pointer transition-colors font-medium animate-fade-in"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
          <span>Index</span>
        </button>

        {/* Page Counter text & status badge */}
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-slate-700">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="font-mono font-bold text-xs tracking-tight">
            {getPageCounterText()}
          </span>
        </div>
      </div>

      {/* Middle Segment: Brand Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center select-none pointer-events-none">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm mr-2 shadow-sm">C</div>
        <span className="font-black text-slate-900 tracking-tighter text-lg uppercase italic">
          CricketFinance
        </span>
      </div>

      {/* Right Segment: Zoom, Fullscreen, and Share */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 shadow-sm">
          <button
            id="zoom-out-button"
            type="button"
            onClick={zoomOut}
            disabled={zoomLevel <= 75}
            title="Zoom Out"
            className={`p-1.5 border-0 bg-transparent rounded-full cursor-pointer transition-colors ${
              zoomLevel <= 75 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          
          <span className="text-[11px] font-mono font-bold text-slate-700 min-w-10 text-center">
            {zoomLevel}%
          </span>

          <button
            id="zoom-in-button"
            type="button"
            onClick={zoomIn}
            disabled={zoomLevel >= 180}
            title="Zoom In"
            className={`p-1.5 border-0 bg-transparent rounded-full cursor-pointer transition-colors ${
              zoomLevel >= 180 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Interactive JSON Layout Config Button */}
        <button
          id="toggle-json-config-drawer"
          type="button"
          onClick={() => setJsonEditorOpen(!jsonEditorOpen)}
          title="Customize page content with JSON"
          className={`p-2.5 rounded-full border-0 transition-all pointer-events-auto cursor-pointer focus:outline-none flex items-center justify-center ${
            jsonEditorOpen 
              ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' 
              : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100/50'
          }`}
        >
          <FileCode className="w-5 h-5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="toggle-fullscreen-button"
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full border-0 transition-colors pointer-events-auto cursor-pointer focus:outline-none"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-blue-600" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>

        {/* Share/Link copier with live confirmation feedback */}
        <div className="relative">
          <button
            id="toolbar-share-button"
            type="button"
            onClick={handleShareClick}
            title="Copy URL to clipboard"
            className="flex items-center gap-1 px-3 py-2 md:px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full border-0 transition-all shadow-md cursor-pointer active:scale-95 pointer-events-auto"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Success toast overlay */}
          {copied && (
            <div className="absolute bottom-12 right-0 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded shadow-xl font-mono whitespace-nowrap animate-fade-in z-50">
              Link cloned directly to clipboard!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BottomToolbar;
