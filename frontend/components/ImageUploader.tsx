'use client';

import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  value?: string;
  bucket?: string;
  multiple?: boolean;
  className?: string;
}

export default function ImageUploader({
  onUpload,
  value = '',
  bucket = 'product-images',
  multiple = false,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File) => {
    console.log('[ImageUploader] Starting upload for file:', file.name, file.size, file.type);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('[ImageUploader] Server upload response status:', res.status, data);

    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data.url;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError('');
      setIsUploading(true);
      setUploadSuccess(false);

      try {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
          const url = await uploadFile(file);
          console.log('[ImageUploader] Uploaded URL:', url);
          onUpload(url);
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      } catch (err) {
        console.error('[ImageUploader] Upload error:', err);
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, bucket]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={className}>
      {/* If an image URL is present, show preview with option to change */}
      {value ? (
        <div className="relative group border border-zinc-800 rounded-2xl p-4 bg-zinc-950 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden relative flex items-center justify-center p-1">
            <img src={value} alt="Uploaded Preview" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1">
              <span>✓</span> Image Uploaded
            </p>
            <p className="text-xs text-zinc-400 font-mono truncate">{value}</p>
            <div className="flex gap-2 mt-2">
              <label className="text-xs text-pink-400 hover:text-pink-300 font-bold cursor-pointer underline">
                Replace Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => onUpload('')}
                className="text-xs text-zinc-500 hover:text-red-400 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-pink-500 bg-pink-500/10'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60'
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload-input"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <svg className="w-7 h-7 text-pink-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold text-pink-400">Uploading image to Supabase...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="text-xs text-zinc-300">
                  Drag & drop or <span className="text-pink-400 font-bold">click to upload file</span>
                </span>
                <p className="text-[11px] text-zinc-500 mt-0.5">JPEG, PNG, WebP, GIF — Max 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadSuccess && (
        <p className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
          <span>✓</span> Image uploaded successfully!
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400 font-semibold">{error}</p>
      )}
    </div>
  );
}

