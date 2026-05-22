'use client';

import { useState, useRef } from 'react';

/**
 * FileUploadZone — drag-and-drop file upload with visual feedback.
 * Props:
 *   label       — field label
 *   id          — input id
 *   accept      — file type filter (e.g. "image/*")
 *   onFileSelect(file) — called when user picks a file
 */
export default function FileUploadZone({ label, id, accept = 'image/*', onFileSelect }) {
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div
        className={`upload-zone${dragOver ? ' dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          aria-label={label}
        />
        <div className="upload-icon" aria-hidden="true">📁</div>
        <div className="upload-text">Click or drag to upload</div>
        <div className="upload-sub">PNG, JPG, WEBP supported</div>
        {fileName && (
          <div className="upload-filename">
            <span aria-hidden="true">✓</span>
            {fileName}
          </div>
        )}
      </div>
    </div>
  );
}
