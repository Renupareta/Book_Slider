'use client';

import React, { forwardRef } from 'react';

const BOOK_LAYOUTS = {
  portrait: { width: 350, height: 434 },
  landscape: { width: 690, height: 434 },
  square: { width: 434, height: 434 },
};

const BookPage = forwardRef(({ page, layout }, ref) => {
  const currentLayout = BOOK_LAYOUTS[layout] || BOOK_LAYOUTS.portrait;
const pageWidth = page?.width || 350;
const pageHeight = page?.height || 434;
  const pageBg =
    page?.background ||
    page?.backgroundColor ||
    page?.bg ||
    '#ffffff';

  return (
   <div
  ref={ref}
  className="book-page"
  style={{
    width: `${pageWidth}px`,
    height: `${pageHeight}px`,
    minWidth: `${pageWidth}px`,
    minHeight: `${pageHeight}px`,
    maxWidth: `${pageWidth}px`,
    maxHeight: `${pageHeight}px`,
    position: 'relative',
    overflow: 'hidden',
  }}
>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: pageBg,
          zIndex: 0,
        }}
      />

      {page?.elements?.map((element, index) => {
        const d = element?.data || {};

        if (d.type === 'text') {
          return (
            <div
              key={element.id || index}
              style={{
                position: 'absolute',
              left: `${d.x || 0}px`,
top: `${d.y || 0}px`,
width: `${d.width || 100}px`,
height: d.height ? `${d.height}px` : 'auto',
fontSize: `${d.fontSize || 16}px`,
                color: d.textColor || d.color || '#111111',
                fontWeight: d.fontWeight || 400,
                fontFamily: d.fontFamily || 'Arial',
                lineHeight: d.lineHeight || 1.2,
                textAlign: d.textAlign || d.align || 'left',
                opacity: d.opacity ?? 1,
                zIndex: d.zIndex || 1,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
              }}
            >
              {d.text || ''}
            </div>
          );
        }

        if (d.type === 'image') {
          return (
            <img
              key={element.id || index}
              src={d.src}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
               left: `${d.x || 0}px`,
top: `${d.y || 0}px`,
width: `${d.width || 100}px`,
height: `${d.height || 100}px`,
                objectFit: d.objectFit || d.fit || 'cover',
                opacity: d.opacity ?? 1,
                zIndex: d.zIndex || 1,
                borderRadius: `${Number(d.borderRadius || 0)}px`,
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
});

BookPage.displayName = 'BookPage';

export default BookPage;