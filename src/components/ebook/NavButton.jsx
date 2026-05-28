/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBook } from './BookStateContext';

export const NavButton = () => {
  const { currentPage, totalPages, prevPage, nextPage } = useBook();

  const isAtStart = currentPage === 1;
  const isAtEnd = currentPage === totalPages;

  return (
    <>
      {/* Left Navigation page-flip trigger */}
      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 transition-all pointer-events-auto">
        <button
          id="prev-page-button"
          type="button"
          onClick={prevPage}
          disabled={isAtStart}
          aria-label="Previous Page"
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg border-0 cursor-pointer transition-all duration-305 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-95 ${
            isAtStart
              ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed opacity-30 shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-xl'
          }`}
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Right Navigation page-flip trigger */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 transition-all pointer-events-auto">
        <button
          id="next-page-button"
          type="button"
          onClick={nextPage}
          disabled={isAtEnd}
          aria-label="Next Page"
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg border-0 cursor-pointer transition-all duration-305 focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-95 ${
            isAtEnd
              ? 'bg-slate-200/50 text-slate-400 cursor-not-allowed opacity-30 shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-xl'
          }`}
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
};

export default NavButton;
