'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useBook } from './BookStateContext';
import BookPage from './BookPage';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
});

export function BookReader() {
  const {
    pages,
    zoomLevel,
    nextPage,
    prevPage,
    setPageFlipRef,
    setCurrentPage,
  } = useBook();

  const bookRef = useRef(null);

  const firstPage = pages?.[0];

  const width = firstPage?.width || 350;
  const height = firstPage?.height || 434;

  useEffect(() => {
    if (bookRef.current) {
      setPageFlipRef(bookRef);
    }

    return () => {
      setPageFlipRef(null);
    };
  }, [setPageFlipRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextPage, prevPage]);

  if (!pages || pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold">No Pages Found</div>
      </div>
    );
  }

 return (
  <div
    className="w-full flex items-center justify-center overflow-hidden bg-[#ece8ff]"
    style={{
      height: 'calc(100vh - 60px)',
    }}
  >
    <div
      style={{
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease',
        maxWidth: '100vw',
        maxHeight: '100%',
      }}
    >
      <HTMLFlipBook
        key={`${width}-${height}-${pages.length}`}
        ref={bookRef}
        width={width}
        height={height}
        minWidth={width}
        maxWidth={width}
        minHeight={height}
        maxHeight={height}
        size="fixed"
        showCover={true}
        usePortrait={false}
        drawShadow={true}
        flippingTime={900}
        useMouseEvents={true}
        mobileScrollSupport={false}
        maxShadowOpacity={0.5}
        startPage={0}
        onFlip={(e) => setCurrentPage(e.data + 1)}
      >
        {pages.map((page, index) => (
          <BookPage
            key={page.id || index}
            page={page}
          />
        ))}
      </HTMLFlipBook>
    </div>
  </div>
);
}

export default BookReader;