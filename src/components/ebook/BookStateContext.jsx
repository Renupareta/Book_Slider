/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

import cricketPreset from '../../data/bookPages.json';
import zenPreset from '../../data/alternateBookPages.json';

const BookStateContext = createContext(null);

const getSlides = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.slides)) return data.slides;
  return [];
};

const getBookLayout = (data) => {
  return data?.bookLayout || 'portrait';
};

export const BookStateProvider = ({ children }) => {
  const [pages, setPages] = useState(getSlides(cricketPreset));
  const [bookLayout, setBookLayout] = useState(getBookLayout(cricketPreset));
  const [activePreset, setActivePreset] = useState('cricket');
  const [currentPage, setCurrentPageState] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPages, setBookmarkedPages] = useState([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);

  const pageFlipRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bookmarked_pages');
        if (saved) {
          setBookmarkedPages(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load bookmarks', e);
      }
    }
  }, []);

  const setPageFlipRef = (ref) => {
    pageFlipRef.current = ref;
  };

  const bookmarkPage = (pageId) => {
    setBookmarkedPages((prev) => {
      const updated = prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId];

      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmarked_pages', JSON.stringify(updated));
      }

      return updated;
    });
  };

  const nextPage = () => {
    if (pageFlipRef.current?.current) {
      pageFlipRef.current.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (pageFlipRef.current?.current) {
      pageFlipRef.current.current.pageFlip().flipPrev();
    }
  };

  const setPage = (pageNumber) => {
    if (pageFlipRef.current?.current) {
      pageFlipRef.current.current.pageFlip().flip(pageNumber - 1);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const setCurrentPage = (pageNumber) => {
    setCurrentPageState(pageNumber);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 180));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 75));
  };

  const resetBook = () => {
    if (pageFlipRef.current?.current) {
      try {
        pageFlipRef.current.current.pageFlip().flip(0);
      } catch (e) {
        console.warn('Flip reset failed', e);
      }
    }

    setCurrentPageState(1);
    setZoomLevel(100);
    setSearchQuery('');
  };

  const resetToPreset = (presetName) => {
    if (presetName === 'cricket') {
      setPages(getSlides(cricketPreset));
      setBookLayout(getBookLayout(cricketPreset));
      setActivePreset('cricket');
    }

    if (presetName === 'zen') {
      setPages(getSlides(zenPreset));
      setBookLayout(getBookLayout(zenPreset));
      setActivePreset('zen');
    }

    resetBook();
  };

  const applyCustomJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const slides = getSlides(parsed);

      if (!Array.isArray(slides) || slides.length === 0) {
        throw new Error('JSON me slides array hona chahiye: { "slides": [...] }');
      }

      const validated = slides.map((item, idx) => ({
        ...item,
        id: item.id || String(idx + 1),
        elements: Array.isArray(item.elements) ? item.elements : [],
      }));

      setPages(validated);
      setBookLayout(getBookLayout(parsed));
      setActivePreset('custom');
      resetBook();

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <BookStateContext.Provider
      value={{
        pages,
        totalPages: pages.length,
        bookLayout,
        setBookLayout,
        currentPage,
        zoomLevel,
        searchQuery,
        bookmarkedPages,
        feedbackOpen,
        jsonEditorOpen,
        activePreset,
        pageFlipRef,
        setPageFlipRef,
        setCurrentPage,
        nextPage,
        prevPage,
        setPage,
        bookmarkPage,
        setZoomLevel,
        zoomIn,
        zoomOut,
        setSearchQuery,
        setFeedbackOpen,
        setJsonEditorOpen,
        resetBook,
        resetToPreset,
        applyCustomJSON,
        cricketPreset,
        zenPreset,
        setPages,
      }}
    >
      {children}
    </BookStateContext.Provider>
  );
};

export const useBook = () => {
  const context = useContext(BookStateContext);

  if (!context) {
    throw new Error('useBook must be used within a BookStateProvider');
  }

  return context;
};