"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ContactSection } from "@/components/ContactSection";
import {
  CoverSlide,
  IntroOverlay,
  WhatWeDoSlide,
  WhoWeAreSlide,
} from "@/components/HeroAboutSection";
import { MembersSection } from "@/components/MembersSection";
import { NAV_ITEMS } from "@/components/Navbar";
import { ServicesSection } from "@/components/ServicesSection";
import { Member, ServiceWebsite, SiteConfig } from "@/types/hub";

const TOTAL_SLIDES = 6;
const CHARGE_THRESHOLD = 280; // ~3 deliberate mouse wheel ticks (clamped at 95 per tick)
const CHARGE_DECAY_MS = 420;
const TRANSITION_LOCK_MS = 720;

interface SlideDeckProps {
  config: SiteConfig;
  members: Member[];
  services: ServiceWebsite[];
}

export function SlideDeck({ config, members, services }: SlideDeckProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [introRunKey, setIntroRunKey] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollCharge, setScrollCharge] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deckRef = useRef<HTMLDivElement | null>(null);
  const activeSlideRef = useRef(0);
  const chargeDeltaRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const decayTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchTargetRef = useRef<HTMLElement | null>(null);

  const shouldDeferInnerScroll = useCallback(
    (target: HTMLElement | null, deltaY: number): boolean => {
      const scroller = target?.closest("section, footer") as HTMLElement | null;
      if (!scroller) return false;

      const style = window.getComputedStyle(scroller);
      if (style.overflowY !== "auto" && style.overflowY !== "scroll") {
        return false;
      }

      if (scroller.scrollHeight <= scroller.clientHeight + 4) {
        return false;
      }

      if (deltaY > 0) {
        return scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 2;
      }
      if (deltaY < 0) {
        return scroller.scrollTop > 2;
      }
      return false;
    },
    []
  );

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  // Opening full-screen SAMO SCI 69 Logo zoom & fade animation
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setShowIntro(false);
      return;
    }

    setShowIntro(true);
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 2350);

    return () => window.clearTimeout(timer);
  }, [introRunKey]);

  useEffect(() => {
    return () => {
      if (decayTimerRef.current) window.clearTimeout(decayTimerRef.current);
      if (transitionTimerRef.current)
        window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const clearCharge = useCallback(() => {
    chargeDeltaRef.current = 0;
    setScrollCharge(0);
    if (decayTimerRef.current) {
      window.clearTimeout(decayTimerRef.current);
      decayTimerRef.current = null;
    }
  }, []);

  const goToSlide = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, nextIndex));
      clearCharge();

      if (clamped === activeSlideRef.current) return;

      isTransitioningRef.current = true;
      activeSlideRef.current = clamped;
      setActiveSlide(clamped);

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {
        isTransitioningRef.current = false;
      }, TRANSITION_LOCK_MS);
    },
    [clearCharge]
  );

  const handleReplayIntro = useCallback(() => {
    goToSlide(0);
    setIntroRunKey((prev) => prev + 1);
  }, [goToSlide]);

  // Scroll-Threshold Wheel Handler ("ต้องเลื่อนสักพักนึง")
  useEffect(() => {
    const node = deckRef.current;
    if (!node) return;

    const handleWheel = (e: WheelEvent) => {
      if (showIntro || isModalOpen) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-modal-scroll="true"]')) return;

      const rawDelta = e.deltaY;
      if (Math.abs(rawDelta) < 1) return;

      if (shouldDeferInnerScroll(target, rawDelta)) return;

      e.preventDefault();

      if (isTransitioningRef.current) return;

      const current = activeSlideRef.current;

      // Prevent charging past first/last slide boundaries
      if (current === 0 && rawDelta < 0 && chargeDeltaRef.current <= 0) {
        clearCharge();
        return;
      }
      if (
        current === TOTAL_SLIDES - 1 &&
        rawDelta > 0 &&
        chargeDeltaRef.current >= 0
      ) {
        clearCharge();
        return;
      }

      // Normalize per-event wheel delta so ~3 deliberate wheel notches (95 each) reach 280
      const clampedStep = Math.max(-95, Math.min(95, rawDelta));
      let nextDelta = chargeDeltaRef.current + clampedStep;

      if (current === 0 && nextDelta < 0) nextDelta = 0;
      if (current === TOTAL_SLIDES - 1 && nextDelta > 0) nextDelta = 0;

      chargeDeltaRef.current = nextDelta;

      const pct = Math.max(
        -100,
        Math.min(100, (nextDelta / CHARGE_THRESHOLD) * 100)
      );
      setScrollCharge(pct);

      if (decayTimerRef.current) {
        window.clearTimeout(decayTimerRef.current);
      }

      if (Math.abs(nextDelta) >= CHARGE_THRESHOLD) {
        const dir = nextDelta > 0 ? 1 : -1;
        goToSlide(current + dir);
        return;
      }

      decayTimerRef.current = window.setTimeout(() => {
        chargeDeltaRef.current = 0;
        setScrollCharge(0);
      }, CHARGE_DECAY_MS);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [showIntro, isModalOpen, clearCharge, goToSlide, shouldDeferInnerScroll]);

  // Keyboard Navigation (ArrowUp / ArrowDown / PageUp / PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro || isModalOpen) return;

      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT"
      ) {
        return;
      }

      if (isTransitioningRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSlide(activeSlideRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSlide(activeSlideRef.current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, isModalOpen, goToSlide]);

  // Touch Swipe Accumulator for Mobile/Tablet
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showIntro || isModalOpen) return;
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
    touchTargetRef.current = e.target as HTMLElement | null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      showIntro ||
      isModalOpen ||
      isTransitioningRef.current ||
      touchStartYRef.current === null
    ) {
      return;
    }

    const currentY = e.touches[0]?.clientY;
    if (typeof currentY !== "number") return;

    const deltaY = touchStartYRef.current - currentY;
    if (Math.abs(deltaY) < 12) return;

    if (shouldDeferInnerScroll(touchTargetRef.current, deltaY)) {
      touchStartYRef.current = currentY;
      return;
    }

    const current = activeSlideRef.current;

    if (current === 0 && deltaY < 0) return;
    if (current === TOTAL_SLIDES - 1 && deltaY > 0) return;

    const pct = Math.max(-100, Math.min(100, (deltaY / 110) * 100));
    chargeDeltaRef.current = (pct / 100) * CHARGE_THRESHOLD;
    setScrollCharge(pct);
  };

  const handleTouchEnd = () => {
    touchTargetRef.current = null;
    if (showIntro || isModalOpen || touchStartYRef.current === null) {
      touchStartYRef.current = null;
      return;
    }

    touchStartYRef.current = null;
    const currentPct = scrollCharge;

    if (Math.abs(currentPct) >= 50 && !isTransitioningRef.current) {
      const dir = currentPct > 0 ? 1 : -1;
      goToSlide(activeSlideRef.current + dir);
    } else {
      clearCharge();
    }
  };

  const renderLayerStyle = (idx: number): React.CSSProperties => {
    if (idx === activeSlide) {
      const tensionY = -(scrollCharge / 100) * 14;
      const tensionScale = 1 - (Math.abs(scrollCharge) / 100) * 0.015;
      return {
        transform: `translate3d(0, ${tensionY.toFixed(
          1
        )}px, 0) scale(${tensionScale.toFixed(4)})`,
        opacity: 1,
        zIndex: 20,
        pointerEvents: "auto",
      };
    }

    if (idx < activeSlide) {
      // Scale & Slide Curtain: previous slides recede upward and scale down behind
      return {
        transform: "translate3d(0, -10%, 0) scale(0.9)",
        opacity: 0,
        zIndex: 10,
        pointerEvents: "none",
      };
    }

    // Upcoming slides wait neatly below viewport edge
    return {
      transform: "translate3d(0, 100%, 0) scale(1)",
      opacity: 0,
      zIndex: 30,
      pointerEvents: "none",
    };
  };

  const isLightSlide = activeSlide === 0 || activeSlide === 3;

  return (
    <div
      ref={deckRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative h-[100dvh] w-screen overflow-hidden bg-[#080B11] text-white select-none ${
        isModalOpen ? "" : "touch-pan-x"
      }`}
    >
      {/* Opening Full-Screen Logo Fade & Zoom */}
      {showIntro && (
        <IntroOverlay runKey={introRunKey} onSkip={() => setShowIntro(false)} />
      )}

      {/* 6 Pinned 100dvh Curtain Slides */}
      <main className="relative h-full w-full overflow-hidden">
        <div
          aria-hidden={activeSlide !== 0}
          style={renderLayerStyle(0)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <CoverSlide
            config={config}
            isActive={activeSlide === 0}
            onSelectSlide={goToSlide}
            onReplayIntro={handleReplayIntro}
          />
        </div>

        <div
          aria-hidden={activeSlide !== 1}
          style={renderLayerStyle(1)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <WhoWeAreSlide config={config} isActive={activeSlide === 1} />
        </div>

        <div
          aria-hidden={activeSlide !== 2}
          style={renderLayerStyle(2)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <WhatWeDoSlide config={config} isActive={activeSlide === 2} />
        </div>

        <div
          aria-hidden={activeSlide !== 3}
          style={renderLayerStyle(3)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <MembersSection
            members={members}
            isActive={activeSlide === 3}
            onModalOpenChange={setIsModalOpen}
          />
        </div>

        <div
          aria-hidden={activeSlide !== 4}
          style={renderLayerStyle(4)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <ServicesSection services={services} isActive={activeSlide === 4} />
        </div>

        <div
          aria-hidden={activeSlide !== 5}
          style={renderLayerStyle(5)}
          className="absolute inset-0 h-full w-full slide-curtain"
        >
          <ContactSection config={config} isActive={activeSlide === 5} />
        </div>
      </main>

      {/* Right-Side Architectural Slide Rail */}
      <aside
        aria-label="แถบสถานะสไลด์"
        className="flex fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-2 sm:gap-2.5"
      >
        {NAV_ITEMS.map((item) => {
          const active = item.index === activeSlide;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => goToSlide(item.index)}
              aria-label={`ไปยังสไลด์ ${item.shortCode} ${item.label}`}
              title={`${item.shortCode} · ${item.label}`}
              className="group flex items-center gap-1.5 sm:gap-2 py-0.5 focus:outline-none"
            >
              <span
                className={`font-mono text-[9px] sm:text-[10px] transition-opacity ${
                  active
                    ? isLightSlide
                      ? "opacity-100 font-bold text-[#080B11]"
                      : "opacity-100 font-bold text-[#FFE600]"
                    : isLightSlide
                    ? "opacity-0 group-hover:opacity-100 text-[#080B11]"
                    : "opacity-0 group-hover:opacity-100 text-white"
                }`}
              >
                {item.shortCode}
              </span>
              <span
                className={`block h-[2px] transition-all duration-300 ${
                  active
                    ? isLightSlide
                      ? "w-5 sm:w-7 bg-[#080B11]"
                      : "w-5 sm:w-7 bg-[#FFE600]"
                    : isLightSlide
                    ? "w-2.5 sm:w-3 bg-black/25 group-hover:w-5 group-hover:bg-[#080B11]"
                    : "w-2.5 sm:w-3 bg-white/25 group-hover:w-5 group-hover:bg-[#FFE600]"
                }`}
              />
            </button>
          );
        })}
      </aside>
    </div>
  );
}
