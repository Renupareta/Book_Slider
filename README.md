# Modern Ebook Flipbook Reader (Next.js Version)

A modern, highly polished Ebook Flipbook Reader built with **Next.js App Router**, **JavaScript**, **Tailwind CSS v4**, and **react-pageflip**.

## Features
- **Real Book Physics**: Cover pages show as single, centered pages. Outer/interior pages open into side-by-side spreads and flip with physical shadows.
- **Double-Page Sizing**: Responsive double-page spread on desktop, supporting intuitive arrow keys navigation.
- **Interactive Controls**: Table of Contents navigation, bookmark page state management, zoom control, search highlights, and client-side page indicators.
- **No TypeScript**: Written entirely in modern JavaScript/ES6.

## Folder Structure
```text
book-flip-reader/
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
├── README.md
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   └── ebook/
│   │       ├── BookReader.jsx
│   │       ├── BookPage.jsx
│   │       ├── NavButton.jsx
│   │       └── BottomToolbar.jsx
│   └── data/
│       └── bookPages.js
```

## Running the Project

To run this project locally, simply execute:

```bash
cd book-flip-reader
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application in your browser.
