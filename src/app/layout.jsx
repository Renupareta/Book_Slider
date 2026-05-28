/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import '../app/globals.css';

export const metadata = {
  title: 'Cricket & Finance Magazine Reader',
  description: 'A beautiful double-page modern flipbook publication reader.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts link pre-connect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen bg-[#E6E6FA] selection:bg-blue-200">
        {children}
      </body>
    </html>
  );
}
