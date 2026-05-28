/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Settings, 
  Sparkles, 
  HelpCircle, 
  Check, 
  Download, 
  Upload, 
  BookOpen, 
  RefreshCw, 
  Info,
  Copy
} from 'lucide-react';
import { useBook } from './BookStateContext';

const EMPTY_TEMPLATE = [
  {
    "id": 1,
    "type": "front-cover",
    "title": "MY CUSTOM BOOK",
    "subtitle": "Chapter One",
    "category": "CREATIVE PORTFOLIO",
    "author": "Your Name",
    "date": "May 2026",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    "quote": "This is a custom cover page.",
    "content": "You can change this text in the editor on the right as JSON, or upload your own file!",
    "footerNote": "Volume I • Edition 1"
  },
  {
    "id": 2,
    "type": "normal-page",
    "title": "Welcome Page",
    "subtitle": "How to edit",
    "category": "GUIDE",
    "sections": [
      {
        "title": "Direct Edits",
        "content": "Simply modify any fields on the right, then press 'Apply JSON' to instantly see the gorgeous page flip update on the stage!"
      },
      {
        "title": "Add More Pages",
        "content": "You can append as many page objects to the root JSON array as you like. We support standard normal-pages, spreads, and back covers."
      }
    ],
    "footerNote": "Custom Book • Page 2"
  },
  {
    "id": 3,
    "type": "back-cover",
    "title": "The End",
    "category": "CONCLUSION",
    "quote": "Created via Live JSON config loading.",
    "content": "All physical margins, back covers, and middle pages are re-rendered automatically to preserve fluid spreads.",
    "footerNote": "Made with Next.js & Tailwind"
  }
];

export const JsonEditorPanel = () => {
  const { 
    pages, 
    jsonEditorOpen, 
    setJsonEditorOpen, 
    activePreset, 
    resetToPreset, 
    applyCustomJSON,
    setPages,
    resetBook
  } = useBook();

  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sync editor text with context pages when preset changes or on mount
  useEffect(() => {
    if (pages) {
      setJsonText(JSON.stringify(pages, null, 2));
      setErrorMsg('');
    }
  }, [pages, activePreset]);

  if (!jsonEditorOpen) return null;

  const handleApply = () => {
    setErrorMsg('');
    setSuccessMsg('');
    const resp = applyCustomJSON(jsonText);
    if (resp.success) {
      setSuccessMsg('JSON parsed & applied successfully! Flip through the pages to see your work.');
      setTimeout(() => setSuccessMsg(''), 4500);
    } else {
      setErrorMsg(resp.error || 'Failed to parse JSON. Please check syntax.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    try {
      // Validate schema first
      JSON.parse(jsonText);
      const blob = new Blob([jsonText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-flipbook-config-${activePreset}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg('Cannot download invalid JSON! Resolve errors first.');
    }
  };

  // Drag-and-drop and click listeners
  const processUploadedFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setErrorMsg('Invalid file type! Please upload a valid .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        // Validate
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('Content must be a JSON array of page items.');
        }
        setJsonText(JSON.stringify(parsed, null, 2));
        setErrorMsg('');
        setSuccessMsg('Loaded file into editor! Click "Apply JSON" to see it live.');
      } catch (err) {
        setErrorMsg(`JSON Parse Error in uploaded file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processUploadedFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processUploadedFile(files[0]);
    }
  };

  const formatText = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setErrorMsg('');
    } catch (e) {
      setErrorMsg('Malformed JSON. Fix syntax before formatting.');
    }
  };

  const loadFreshTemplate = () => {
    setJsonText(JSON.stringify(EMPTY_TEMPLATE, null, 2));
    setErrorMsg('');
    setSuccessMsg('Loaded fresh boilerplate template! Modify it to build your own story.');
  };

  return (
    <div 
      id="json-editor-drawer"
      className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 z-50 flex flex-col shadow-2xl animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold tracking-tight">Interactive JSON Config</h3>
            <span className="text-[10px] font-mono font-medium text-slate-500 uppercase">Apply Real-Time Data</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setJsonEditorOpen(false)}
          className="p-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-all text-slate-400 border-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Presets */}
      <div className="p-4 bg-slate-950 border-b border-slate-850/60 flex flex-col gap-3">
        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">CHOOSE JSON STORY PRESET:</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => resetToPreset('cricket')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
              activePreset === 'cricket'
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cricket Portfolio</span>
          </button>
          
          <button
            type="button"
            onClick={() => resetToPreset('zen')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
              activePreset === 'zen'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zen Journal</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <button
            type="button"
            onClick={loadFreshTemplate}
            className="text-[11px] font-mono text-blue-400 hover:underline hover:text-blue-300 flex items-center gap-1 cursor-pointer border-0 bg-transparent p-0"
          >
            <span>+ Load Blank Template JSON</span>
          </button>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded uppercase">
            Active: {activePreset}
          </span>
        </div>
      </div>

      {/* Editor Block */}
      <div className="flex-1 flex flex-col min-h-0 relative select-text">
        <div className="absolute top-2 right-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={formatText}
            title="Prettify formatting"
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded text-[10px] font-mono text-slate-300 border-0 cursor-pointer"
          >
            <RefreshCw className="w-3" /> Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 hover:text-white px-2 py-1 rounded text-[10px] font-mono text-slate-300 border-0 cursor-pointer"
          >
            {isCopied ? <Check className="w-3 text-emerald-550" /> : <Copy className="w-3" />}
            Copy
          </button>
        </div>

        <textarea
          id="json-config-textarea"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Paste or write your custom book pages JSON here..."
          className="w-full flex-1 p-4 pt-10 font-mono text-xs bg-slate-950 text-slate-200 resize-none border-0 focus:outline-none focus:ring-1 focus:ring-blue-600 overflow-y-auto selection:bg-slate-800 selection:text-white leading-relaxed"
          spellCheck="false"
        />

        {/* Drag-and-drop and manual upload slot */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 relative bg-slate-950/90 border-t border-slate-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-900 ${
            isDragging ? 'bg-blue-900/40 border-dashed border-blue-500' : ''
          }`}
          title="Drag and drop or click to upload config JSON file"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10.5px] font-mono">
            {isDragging ? 'Drop JSON file here...' : 'Drag-&-Drop / Click to Upload file'}
          </span>
        </div>
      </div>

      {/* Info helper block */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-850 flex items-start gap-2 text-[10px] text-slate-400 select-none">
        <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
        <span className="leading-normal">
          Page types supported: <code className="text-slate-200">"front-cover", "normal-page", "back-cover"</code>. Spreads are configured automatically by sorting odd/even items.
        </span>
      </div>

      {/* Message and Feedback Banner */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-950/90 text-rose-200 text-xs font-mono border-t border-rose-900 whitespace-pre-wrap select-text max-h-24 overflow-y-auto shrink-0 select-none">
          ⚠️ <strong>PARSE ERROR:</strong>
          <p className="mt-1 leading-normal opacity-90">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-950/90 text-emerald-250 text-xs font-mono border-t border-emerald-900 leading-normal shrink-0 select-none flex items-start gap-1.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Bottom Actions tab */}
      <div className="p-4 bg-slate-950 border-t border-slate-850 flex gap-3 shrink-0">
        <button
          id="btn-apply-json"
          type="button"
          onClick={handleApply}
          className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 border-0 rounded-lg text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
        >
          <Check className="w-4 h-4" />
          <span>Apply JSON Change</span>
        </button>

        <button
          id="btn-download-json"
          type="button"
          onClick={handleDownload}
          title="Download edited layout as JSON file"
          className="p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 border border-slate-800 rounded-lg transition-all cursor-pointer focus:outline-none flex items-center justify-center"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default JsonEditorPanel;
