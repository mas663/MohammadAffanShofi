"use client";

import { useState } from "react";
import Image from "next/image";

type ImageUploadProps = {
  value: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  accept?: string;
  placeholder?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*",
  placeholder = "https://example.com/image.jpg",
}: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">(
    value?.startsWith("http") ? "url" : "file",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(value || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        onChange(result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImagePreview(url);
    onChange(url);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-300">
        {label}
      </label>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMethod("url")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            uploadMethod === "url"
              ? "bg-sky-500 text-white"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          URL Link
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod("file")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            uploadMethod === "file"
              ? "bg-sky-500 text-white"
              : "bg-white/5 text-neutral-400 hover:bg-white/10"
          }`}
        >
          Drag & Drop
        </button>
      </div>

      {uploadMethod === "url" ? (
        <input
          type="url"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-neutral-500 focus:border-sky-500 focus:outline-none"
          placeholder={placeholder}
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-sky-500", "bg-sky-500/10");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-sky-500", "bg-sky-500/10");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-sky-500", "bg-sky-500/10");
            const file = e.dataTransfer.files[0];
            const isImage = file && file.type.startsWith("image/");
            const isPDF = file && file.type === "application/pdf";

            if (isImage || isPDF) {
              setImageFile(file);
              const reader = new FileReader();
              reader.onload = (event) => {
                const result = event.target?.result as string;
                setImagePreview(result);
                onChange(result, file);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-white/20 transition"
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s/g, "-").toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s/g, "-").toLowerCase()}`}
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-12 h-12 text-neutral-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-neutral-300 mb-1">
              Drag & drop your {label.toLowerCase()} (image or PDF)
            </p>
            <p className="text-xs text-neutral-500">
              Supports JPG, PNG, PDF • Click to browse
            </p>
          </label>
        </div>
      )}

      {/* Image/PDF Preview */}
      {imagePreview && (
        <div className="mt-3">
          <p className="text-xs text-neutral-400 mb-2">Preview:</p>
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-neutral-800">
            {imageFile?.type === "application/pdf" ? (
              <iframe
                src={imagePreview}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
