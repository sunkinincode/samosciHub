"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Instagram,
  MessageCircle,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SiteConfig } from "@/types/hub";

interface ContactSectionProps {
  config: SiteConfig;
  isActive?: boolean;
}

export function ContactSection({
  config,
  isActive = true,
}: ContactSectionProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    config.lineBatches[0]?.id || ""
  );
  const [customBatchXX, setCustomBatchXX] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedBatch = useMemo(() => {
    return (
      config.lineBatches.find((b) => b.id === selectedBatchId) ||
      config.lineBatches[0] ||
      null
    );
  }, [config.lineBatches, selectedBatchId]);

  const effectiveLineLabel = customBatchXX.trim()
    ? `SCI PSU ${customBatchXX.trim()}`
    : selectedBatch?.lineId || config.lineTitle;

  const effectiveLineDescription = customBatchXX.trim()
    ? `ช่องทางติดต่อทางไลน์สำหรับนักศึกษาวิทยาศาสตร์ รุ่น ${customBatchXX.trim()} (ค้นหาชื่อ: SCI PSU ${customBatchXX.trim()})`
    : selectedBatch?.description || config.lineSubtitle;

  const effectiveLineUrl = selectedBatch?.lineUrl || "https://line.me";

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <footer
      id="contact"
      aria-label="ช่องทางติดต่อสโมสรนักศึกษาและส่วนท้ายเว็บไซต์"
      className="h-full w-full bg-[#080B11] text-white flex flex-col justify-center px-5 pr-10 sm:px-10 lg:px-14 py-4 lg:py-8 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] w-full my-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-1.5 sm:gap-3 border-b border-white/15 pb-2.5 sm:pb-3 transition-all duration-700 delay-75 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-[-0.025em] text-white">
              ช่องทางติดต่อสโมสรนักศึกษา
            </h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-base text-slate-300">
              เลือกติดต่อผ่านช่องทางที่สะดวก เรียงลำดับตามความเร็วในการตอบกลับ
              เพื่อการประสานงานและช่วยเหลือที่รวดเร็วที่สุด
            </p>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-slate-400 shrink-0">
            SLIDE 06 / 06 · OFFICIAL CHANNELS
          </span>
        </div>

        {/* Contrast Split Grid: Solid Signal Yellow LINE Block vs Dark IG/FB Tiles */}
        <div className="mt-2.5 sm:mt-4 grid grid-cols-1 md:grid-cols-12 border border-white/15">
          {/* 1. LINE : SCI PSU XX (Solid #FFE600 Yellow Block) */}
          <div
            className={`md:col-span-6 h-full flex flex-col justify-between bg-[#FFE600] text-[#080B11] p-3 sm:p-5 lg:p-6 border-b md:border-b-0 md:border-r border-black/15 transition-all duration-700 delay-100 ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center bg-[#080B11] text-[#FFE600]">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#080B11]/75">
                      PRIORITY 01 · LINE
                    </p>
                    <h3 className="font-display text-base sm:text-xl lg:text-2xl font-bold text-[#080B11]">
                      LINE : {config.lineTitle}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 bg-[#080B11] px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-[11px] font-semibold text-[#FFE600]">
                  <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{config.lineResponseTime}</span>
                </span>
              </div>

              <p className="border border-black/20 bg-black/5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-medium text-[#080B11]">
                หมายเหตุ: {config.lineSubtitle} (เช่น รุ่น 59 ให้ใช้{" "}
                <code className="font-mono font-bold underline">SCI PSU 59</code>)
              </p>

              {/* Batch Selector */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <label
                    htmlFor="custom-batch-xx"
                    className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-[#080B11]"
                  >
                    เลือกรุ่นวิทยาศาสตร์ที่เข้าเรียน (XX):
                  </label>
                  <input
                    id="custom-batch-xx"
                    type="text"
                    value={customBatchXX}
                    onChange={(e) => setCustomBatchXX(e.target.value)}
                    placeholder="พิมพ์เลขรุ่น XX..."
                    className="w-28 sm:w-36 border border-[#080B11]/35 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-[#080B11] placeholder:text-slate-500 focus:border-[#080B11] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {config.lineBatches.map((batch) => {
                    const active =
                      !customBatchXX.trim() && batch.id === selectedBatch?.id;
                    return (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => {
                          setCustomBatchXX("");
                          setSelectedBatchId(batch.id);
                        }}
                        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[10px] sm:text-xs font-semibold border transition-colors ${
                          active
                            ? "border-[#080B11] bg-[#080B11] text-[#FFE600]"
                            : "border-[#080B11]/25 bg-white/80 text-[#080B11] hover:bg-[#080B11]/10"
                        }`}
                      >
                        {batch.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Batch Box */}
              <div className="border border-[#080B11]/25 bg-white p-2.5 sm:p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#080B11]">
                    {effectiveLineLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(effectiveLineLabel, "line-batch")}
                    className="inline-flex items-center gap-1 border border-[#080B11]/25 bg-[#F4F4F0] px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-xs font-semibold text-[#080B11] hover:bg-[#080B11] hover:text-[#FFE600] transition-colors"
                  >
                    {copiedId === "line-batch" ? (
                      <>
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>คัดลอกชื่อไลน์</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="hidden sm:block text-xs text-slate-700">
                  {effectiveLineDescription}
                </p>
              </div>
            </div>

            <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-black/15 flex items-center justify-between gap-2">
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs font-semibold text-[#080B11]">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{config.lineResponseTime}</span>
              </div>

              <a
                href={effectiveLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 sm:gap-2 bg-[#080B11] px-3 py-2 text-xs sm:text-sm font-bold text-[#FFE600] hover:bg-black transition-colors"
              >
                <span>ติดต่อทาง LINE</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          {/* Right Column on Desktop (Stacked) / Bottom 2-Column on Mobile (Side-by-Side) */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-1 divide-x md:divide-x-0 md:divide-y divide-white/15 bg-[#0D131F]">
            {/* 2. Instagram : samosci.psu_official */}
            <div
              className={`flex flex-col justify-between p-2.5 sm:p-5 hover:bg-[#111A2B] transition-all duration-700 delay-150 ${
                isActive
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2.5">
                  <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                    <div className="flex h-6 w-6 sm:h-9 sm:w-9 shrink-0 items-center justify-center border border-white/20 bg-[#080B11] text-[#FFE600]">
                      <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] sm:text-[11px] text-slate-400">
                        PRIORITY 02 · IG
                      </p>
                      <h3 className="font-display text-[11px] sm:text-lg lg:text-xl font-bold text-white break-all">
                        {config.igHandle}
                      </h3>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1 border border-white/20 bg-[#080B11] px-1.5 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-xs text-slate-200">
                    <Clock className="h-3 w-3 text-[#FFE600]" />
                    <span>{config.igResponseTime}</span>
                  </span>
                </div>

                <p className="hidden sm:block text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  ติดตามข่าวสาร ภาพบรรยากาศกิจกรรม รีแคปโครงการ และทักข้อความ DM
                  สอบถามข้อมูลทั่วไปได้ตลอดเวลา
                </p>
              </div>

              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="hidden sm:inline font-mono text-xs text-slate-400">
                  ระยะเวลาตอบกลับ:{" "}
                  <strong className="text-white">{config.igResponseTime}</strong>
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => copyText(config.igHandle, "ig-handle")}
                    aria-label="คัดลอกชื่อ Instagram"
                    className="inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center border border-white/20 bg-[#080B11] text-slate-300 hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
                  >
                    {copiedId === "ig-handle" ? (
                      <Check className="h-3.5 w-3.5 text-[#FFE600]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <a
                    href={config.igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 bg-[#FFE600] px-2 py-1.5 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#080B11] hover:bg-white transition-colors"
                  >
                    <span className="sm:hidden">เปิด IG</span>
                    <span className="hidden sm:inline">เปิด Instagram</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Facebook : SCIstudentPSU */}
            <div
              className={`flex flex-col justify-between p-2.5 sm:p-5 hover:bg-[#111A2B] transition-all duration-700 delay-200 ${
                isActive
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2.5">
                  <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                    <div className="flex h-6 w-6 sm:h-9 sm:w-9 shrink-0 items-center justify-center border border-white/20 bg-[#080B11] text-[#FFE600]">
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] sm:text-[11px] text-slate-400">
                        PRIORITY 03 · FB PAGE
                      </p>
                      <h3 className="font-display text-[11px] sm:text-lg lg:text-xl font-bold text-white break-all">
                        {config.fbName}
                      </h3>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1 border border-white/20 bg-[#080B11] px-1.5 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] sm:text-xs text-slate-200">
                    <Clock className="h-3 w-3 text-[#FFE600]" />
                    <span>{config.fbResponseTime}</span>
                  </span>
                </div>

                <p className="hidden sm:block text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  ประกาศอย่างเป็นทางการ กำหนดการโครงการ เอกสารประชาสัมพันธ์
                  และติดต่อประสานงานผ่าน Inbox เพจ
                </p>
              </div>

              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="hidden sm:inline font-mono text-xs text-slate-400">
                  ระยะเวลาตอบกลับ:{" "}
                  <strong className="text-white">{config.fbResponseTime}</strong>
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => copyText(config.fbName, "fb-name")}
                    aria-label="คัดลอกชื่อ Facebook"
                    className="inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center border border-white/20 bg-[#080B11] text-slate-300 hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
                  >
                    {copiedId === "fb-name" ? (
                      <Check className="h-3.5 w-3.5 text-[#FFE600]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <a
                    href={config.fbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 bg-[#FFE600] px-2 py-1.5 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#080B11] hover:bg-white transition-colors"
                  >
                    <span className="sm:hidden">เปิด FB</span>
                    <span className="hidden sm:inline">เปิด Facebook</span>
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar (ONLY place with Admin Backend link) */}
        <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-white/15 flex flex-row items-center justify-between gap-3">
          <div className="pl-0 sm:pl-10 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img
              src="/assets/logo-text-white.svg"
              alt="SAMO SCI PSU"
              className="h-6 sm:h-8 w-auto object-contain shrink-0"
            />
            <div className="text-[10px] sm:text-xs text-slate-400 min-w-0">
              <p className="text-white font-medium">
                <span className="sm:hidden">SAMO SCI 69</span>
                <span className="hidden sm:inline">
                  SAMO SCI 69 · คณะวิทยาศาสตร์ ม.อ.
                </span>
              </p>
              <p className="hidden sm:block mt-0.5">
                สโมสรนักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตหาดใหญ่
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2 border border-white/20 bg-[#0D131F] px-2.5 py-1.5 sm:px-4 sm:py-2 font-mono text-[10px] sm:text-xs text-slate-200 hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#FFE600]" />
            <span>ระบบหลังบ้าน (Admin)</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
