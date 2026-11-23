"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Atom,
  Compass,
  Megaphone,
  RotateCcw,
  Shield,
  Sparkles,
} from "lucide-react";
import { SiteConfig } from "@/types/hub";

function renderMissionIcon(iconName: string, isPrimary: boolean) {
  const colorClass = isPrimary ? "text-[#080B11]" : "text-[#FFE600]";
  switch (iconName) {
    case "sparkles":
      return <Sparkles className={`h-5 w-5 ${colorClass}`} />;
    case "shield":
      return <Shield className={`h-5 w-5 ${colorClass}`} />;
    case "atom":
      return <Atom className={`h-5 w-5 ${colorClass}`} />;
    case "megaphone":
      return <Megaphone className={`h-5 w-5 ${colorClass}`} />;
    default:
      return <Compass className={`h-5 w-5 ${colorClass}`} />;
  }
}

interface IntroOverlayProps {
  runKey: number;
  onSkip: () => void;
}

export function IntroOverlay({ runKey, onSkip }: IntroOverlayProps) {
  return (
    <div
      key={runKey}
      aria-hidden="true"
      className="fixed inset-0 z-50 bg-[#080B11] flex items-center justify-center overflow-hidden animate-intro-overlay"
    >
      <div className="relative flex flex-col items-center justify-center px-6">
        <img
          src="/assets/logo-notext-white.svg"
          alt="SAMO SCI 69"
          className="w-60 sm:w-80 md:w-[420px] h-auto object-contain animate-logo-zoom select-none"
        />
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-6 right-6 border border-white/20 bg-[#0D131F] px-3.5 py-2 font-mono text-xs text-slate-300 hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
      >
        ข้ามอินโทร →
      </button>
    </div>
  );
}

interface CoverSlideProps {
  config: SiteConfig;
  isActive: boolean;
  onSelectSlide: (index: number) => void;
  onReplayIntro: () => void;
}

export function CoverSlide({
  config,
  isActive,
  onSelectSlide,
  onReplayIntro,
}: CoverSlideProps) {
  return (
    <section
      id="top"
      aria-label="หน้าปกแนะนำตัว สโมสรนักศึกษาคณะวิทยาศาสตร์"
      className="h-full w-full bg-[#F4F4F0] text-[#080B11] flex flex-col md:grid md:grid-cols-12 overflow-hidden"
    >
      {/* Top on Mobile / Left Column on Desktop (#FFE600 Sidebar) */}
      <aside className="md:col-span-3 shrink-0 bg-[#FFE600] text-[#080B11] px-5 sm:px-8 py-4 md:py-10 flex flex-row md:flex-col justify-between items-center md:items-start border-b md:border-b-0 md:border-r border-black/15">
        <button
          type="button"
          onClick={() => onSelectSlide(0)}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#080B11]"
        >
          <img
            src="/assets/logo-text.svg"
            alt="SAMO SCI PSU"
            className="h-8 sm:h-11 lg:h-14 w-auto object-contain"
          />
        </button>

        <div className="hidden md:block space-y-6 w-full">
          <div className="border-t border-black/20 pt-5 space-y-1">
            <p className="font-mono text-2xl font-bold tracking-tight text-[#080B11]">
              01 / 06
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#080B11]/80">
              SAMO SCI 69 · PSU HAT YAI
            </p>
          </div>

          <div className="border-t border-black/20 pt-4">
            <button
              type="button"
              onClick={() => onSelectSlide(1)}
              className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#080B11] hover:underline underline-offset-4"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              <span>SCROLL FOR MORE</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[#080B11]">
            01 / 06
          </span>
          <button
            type="button"
            onClick={onReplayIntro}
            className="inline-flex items-center gap-1.5 border border-black/25 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#080B11]"
          >
            <RotateCcw className="h-3 w-3" />
            <span>อินโทร</span>
          </button>
        </div>
      </aside>

      {/* Bottom on Mobile / Right Off-White Canvas on Desktop */}
      <div className="md:col-span-9 flex-1 min-h-0 bg-[#F4F4F0] flex flex-col justify-between overflow-hidden">
        {/* Vertically Centered Editorial Title + Clean Wireframe */}
        <div className="px-5 pr-9 sm:px-10 lg:px-14 py-4 sm:py-8 lg:py-12 flex-1 flex flex-col justify-center gap-4 sm:gap-6 lg:gap-8 min-h-0">
          <div
            className={`max-w-4xl space-y-2.5 sm:space-y-3 transition-all duration-700 ${
              isActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="animate-slide-reveal font-display text-[1.85rem] sm:text-5xl lg:text-[3.75rem] font-bold tracking-[-0.03em] text-[#080B11] leading-[1.08]">
              {config.heroTitle}
            </h1>
            <p className="animate-slide-reveal delay-100 text-base sm:text-xl lg:text-2xl font-medium text-[#080B11]/80">
              {config.heroSubtitle}
            </p>
            <p className="animate-slide-reveal delay-200 max-w-2xl text-xs sm:text-base lg:text-lg text-slate-700 leading-relaxed">
              {config.heroTagline}
            </p>
          </div>

          <div className="animate-slide-reveal delay-300 relative w-full flex items-end justify-end min-h-0">
            <img
              src="/assets/bsc-blueprint.png"
              alt="ภาพเส้นสายสถาปัตยกรรมอาคารศูนย์วิทยาศาสตร์ คณะวิทยาศาสตร์ ม.อ."
              className="w-full max-w-3xl h-auto max-h-[24vh] sm:max-h-[34vh] lg:max-h-[40vh] object-contain object-right-bottom mix-blend-multiply opacity-90 select-none"
            />
          </div>
        </div>

        {/* Flush Bottom Strip */}
        <div className="px-5 pr-9 sm:px-10 lg:px-14 py-4 sm:py-5 border-t border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#F4F4F0] shrink-0">
          <button
            type="button"
            onClick={() => onSelectSlide(1)}
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#080B11] hover:underline underline-offset-4"
          >
            <span>01 // SCROLL FOR MORE</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <p className="hidden sm:block text-xs text-slate-700 max-w-md">
            ศูนย์กลางข้อมูล คณะกรรมการ เว็บไซต์บริการ และช่องทางติดต่อของชาววิทยาศาสตร์ ม.อ.
          </p>
        </div>
      </div>
    </section>
  );
}

interface WhoWeAreSlideProps {
  config: SiteConfig;
  isActive: boolean;
}

export function WhoWeAreSlide({ config, isActive }: WhoWeAreSlideProps) {
  return (
    <section
      id="about"
      aria-label="เราคือใคร"
      className="h-full w-full bg-[#080B11] text-white flex items-center justify-center px-6 pr-9 sm:px-10 lg:px-14 py-6 lg:py-10 overflow-hidden"
    >
      <div
        className={`mx-auto max-w-4xl w-full text-center space-y-4 sm:space-y-6 transition-all duration-700 delay-100 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.1]">
          {config.whoWeAreTitle}
        </h2>

        <p className="text-base sm:text-2xl lg:text-3xl font-medium text-[#FFE600] leading-snug">
          {config.whoWeAreSubtitle}
        </p>

        <p className="mx-auto max-w-3xl text-sm sm:text-xl lg:text-2xl text-slate-300 leading-relaxed">
          {config.whoWeAreDescription}
        </p>

        <p className="pt-2 sm:pt-4 font-mono text-[11px] sm:text-xs tracking-widest text-slate-500">
          SLIDE 02 / 06 · WHO WE ARE
        </p>
      </div>
    </section>
  );
}

interface WhatWeDoSlideProps {
  config: SiteConfig;
  isActive: boolean;
}

export function WhatWeDoSlide({ config, isActive }: WhatWeDoSlideProps) {
  return (
    <section
      id="what-we-do"
      aria-label="สโมสรนักศึกษาทำอะไร"
      className="h-full w-full bg-[#080B11] text-white flex items-center justify-center px-5 pr-9 sm:px-10 lg:px-14 py-4 lg:py-10 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] w-full space-y-4 sm:space-y-6 lg:space-y-8 my-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4 border-b border-white/15 pb-3 sm:pb-5 lg:pb-6 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-white">
              {config.whatWeDoTitle}
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base lg:text-lg text-slate-300">
              {config.whatWeDoSubtitle}
            </p>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-slate-400">
            SLIDE 03 / 06 · CORE MISSIONS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/15">
          {config.whatWeDoItems.map((item, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={item.id}
                style={{ transitionDelay: `${140 + idx * 70}ms` }}
                className={`group relative flex flex-col justify-between p-3 sm:p-4 lg:p-6 border-r border-b border-white/15 transition-all duration-700 ${
                  isPrimary
                    ? "bg-[#FFE600] text-[#080B11]"
                    : "bg-[#0D131F] text-white hover:bg-[#111A2B]"
                } ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border ${
                        isPrimary
                          ? "border-[#080B11]/25 bg-[#080B11]/10"
                          : "border-white/15 bg-[#080B11]"
                      }`}
                    >
                      {renderMissionIcon(item.icon, isPrimary)}
                    </div>

                    <div
                      className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center ${
                        isPrimary
                          ? "bg-[#080B11] text-[#FFE600]"
                          : "bg-[#FFE600] text-[#080B11]"
                      }`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>

                  <h3
                    className={`mt-2.5 sm:mt-5 text-xs sm:text-base lg:text-lg font-bold leading-snug ${
                      isPrimary ? "text-[#080B11]" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-1.5 sm:mt-2.5 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none ${
                      isPrimary ? "text-[#080B11]/85" : "text-slate-300"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <p
                  className={`mt-2.5 sm:mt-5 pt-2 sm:pt-3 border-t font-mono text-[10px] sm:text-[11px] truncate ${
                    isPrimary
                      ? "border-[#080B11]/20 text-[#080B11]/80"
                      : "border-white/10 text-slate-400"
                  }`}
                >
                  {item.badge}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
