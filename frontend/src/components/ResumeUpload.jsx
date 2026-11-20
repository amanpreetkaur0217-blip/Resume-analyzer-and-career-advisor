import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Sparkles } from 'lucide-react';

export default function ResumeUpload({ selectedFile, onFileSelect, onFileRemove, onUseSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setErrorMessage('');

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF document. Other formats are not supported.');
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxBytes) {
      setErrorMessage('File size exceeds the 5 MB limit. Please upload a smaller PDF.');
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The uploaded PDF file is empty (0 bytes).');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-300 bg-emerald-50/20'
            : 'border-slate-200 hover:border-indigo-400 bg-white/80 hover:bg-slate-50/50'
        }`}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Cloud Upload Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-inner">
          <UploadCloud className="w-7 h-7 stroke-[1.8]" />
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-800">
          Drag &amp; drop your PDF resume here
        </p>
        <p className="text-xs text-slate-500 mt-0.5">or</p>

        {/* Browse Files Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="mt-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
        >
          Browse Files
        </button>

        <p className="text-[11px] text-slate-400 mt-3 font-medium">
          Supports PDF only • Max size: 5 MB
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected File Card - Matching reference image */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider">PDF</span>
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemove();
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Test Helper Button */}
      {!selectedFile && onUseSample && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">Don't have a PDF ready?</span>
          <button
            type="button"
            onClick={onUseSample}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try with Sample Resume
          </button>
        </div>
      )}
    </div>
  );
}
