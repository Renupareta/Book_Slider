/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { BookStateProvider } from '../components/ebook/BookStateContext';
import { BookReader } from '../components/ebook/BookReader';
import { NavButton } from '../components/ebook/NavButton';
import { BottomToolbar } from '../components/ebook/BottomToolbar';
import { JsonEditorPanel } from '../components/ebook/JsonEditorPanel';

export default function Home() {
  return (
    <BookStateProvider>
      <div className="relative min-h-screen w-full flex flex-col justify-between py-6 overflow-x-hidden pt-4 md:pt-6">
        {/* Subtle decorative radial gradient glow backing the reader */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />

        {/* Dynamic Center Book reader Stage */}
        <main className="flex-1 flex items-center justify-center w-full z-10 px-2 lg:px-4">
          <BookReader />
        </main>

        {/* Tactile Flanking Navigation Overlays */}
        <NavButton />

        {/* Smart Quick Control / Interactive Toolbar Footer */}
        <BottomToolbar />

        {/* Dynamic, Live JSON Editor & Presets Panel Drawer */}
        <JsonEditorPanel />
      </div>
    </BookStateProvider>
  );
}
