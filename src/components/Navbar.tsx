"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export interface SlideNavItem {
  index: number;
  href: string;
  label: string;
  shortCode: string;
}

export const NAV_ITEMS: SlideNavItem[] = [
  { index: 0, href: "#top", label: "หน้าแรก", shortCode: "01" },
  { index: 1, href: "#about", label: "เราคือใคร", shortCode: "02" },
  { index: 2, href: "#what-we-do", label: "เราทำอะไร", shortCode: "03" },
  { index: 3, href: "#members", label: "มีใครบ้าง", shortCode: "04" },
  { index: 4, href: "#services", label: "เว็บไซต์บริการ", shortCode: "05" },
  { index: 5, href: "#contact", label: "ช่องทางติดต่อ", shortCode: "06" },
];

interface NavbarProps {
  activeSlide: number;
  onSelectSlide: (index: number) => void;
  scrollCharge?: number;
}

export function Navbar({
  activeSlide,
  onSelectSlide,
  scrollCharge = 0,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const showDesktopBar = activeSlide > 0;
  const chargeWidth = Math.min(100, Math.abs(scrollCharge));

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    onSelectSlide(index);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        showDesktopBar
          ? "bg-[#080B11]/95 border-b border-white/15 translate-y-0 opacity-100"
          : "md:-translate-y-full md:opacity-0 md:pointer-events-none bg-[#080B11]/95 border-b border-white/15"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 0)}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE600]"
          >
            <img
              src="/assets/logo-text-white.svg"
              alt="สโมสรนักศึกษาคณะวิทยาศาสตร์ ม.อ."
              className="h-8 w-auto object-contain"
            />
          </a>

          <nav
            aria-label="เมนูหลัก"
            className="hidden md:flex items-center gap-5 lg:gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.index === activeSlide;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, item.index)}
                  className={`text-xs font-mono tracking-wide transition-colors ${
                    isActive
                      ? "text-[#FFE600] font-bold"
                      : "text-slate-300 hover:text-[#FFE600]"
                  }`}
                >
                  <span
                    className={`mr-1.5 ${
                      isActive ? "text-[#FFE600]" : "text-slate-500"
                    }`}
                  >
                    {isActive ? "▸" : "·"}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block font-mono text-xs text-slate-300 border border-white/15 bg-[#0D131F] px-2.5 py-1">
              0{activeSlide + 1} / 06 · SAMO SCI 69
            </span>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
              className="md:hidden inline-flex items-center justify-center border border-white/20 bg-[#0D131F] p-2 text-white hover:border-[#FFE600]"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle top scroll-charge hairline synced with deck tension */}
      <div className="h-[2px] w-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-[#FFE600] transition-all duration-100"
          style={{ width: `${chargeWidth}%` }}
        />
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080B11]">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.index === activeSlide;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.index)}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#FFE600] text-[#080B11] font-bold"
                      : "text-slate-200 hover:bg-[#FFE600]/15 hover:text-[#FFE600]"
                  }`}
                >
                  <span>
                    {item.shortCode} · {item.label}
                  </span>
                  {isActive && <span className="font-mono text-xs">ACTIVE</span>}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
