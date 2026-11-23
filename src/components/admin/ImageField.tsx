"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Upload } from "lucide-react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
}

export function ImageField({
  label,
  value,
  onChange,
  aspectClass = "aspect-[16/10]",
}: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "อัปโหลดรูปภาพไม่สำเร็จ");
        return;
      }
      onChange(data.url);
    } catch {
      setError("เกิดข้อผิดพลาดระหว่างอัปโหลดไฟล์");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        {/* Preview box */}
        <div
          className={`sm:col-span-4 ${aspectClass} rounded-xl border border-sky-400/25 bg-[#060911] overflow-hidden flex items-center justify-center`}
        >
          {value ? (
            <img
              src={value}
              alt="ตัวอย่างรูปภาพ"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-500 p-3 text-center">
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px]">ยังไม่มีรูปภาพ</span>
            </div>
          )}
        </div>

        {/* Upload + URL inputs */}
        <div className="sm:col-span-8 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-yellow-400/15 px-3.5 py-2 text-xs font-semibold text-yellow-200 hover:bg-yellow-400/25 disabled:opacity-50 transition-colors"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              <span>{uploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์รูปจากเครื่อง"}</span>
            </button>
          </div>

          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="หรือวางลิงก์รูปภาพ (URL เช่น /uploads/... หรือ https://...)"
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
