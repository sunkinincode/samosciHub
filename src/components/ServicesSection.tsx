"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, Search, Star } from "lucide-react";
import { ServiceStatus, ServiceWebsite } from "@/types/hub";

interface ServicesSectionProps {
  services: ServiceWebsite[];
  isActive?: boolean;
}

function getStatusBadge(status: ServiceStatus) {
  switch (status) {
    case "active":
      return {
        label: "เปิดใช้งาน",
        className: "border-[#FFE600]/45 bg-[#FFE600]/15 text-[#FFE600]",
      };
    case "coming_soon":
      return {
        label: "เร็วๆ นี้",
        className: "border-white/25 bg-white/10 text-slate-200",
      };
    case "maintenance":
      return {
        label: "ปิดปรับปรุง",
        className: "border-rose-400/40 bg-rose-500/15 text-rose-200",
      };
  }
}

export function ServicesSection({
  services,
  isActive = true,
}: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const perPage = isMobile ? 1 : 3;

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(services.map((s) => s.category).filter(Boolean))
    );
    return ["ทั้งหมด", ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return services.filter((srv) => {
      const matchCat =
        selectedCategory === "ทั้งหมด" || srv.category === selectedCategory;
      const matchSearch =
        !q ||
        srv.title.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / perPage)
  );
  const safePageIndex = Math.min(pageIndex, totalPages - 1);

  const paginatedServices = useMemo(() => {
    const start = safePageIndex * perPage;
    return filteredServices.slice(start, start + perPage);
  }, [filteredServices, safePageIndex, perPage]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPageIndex(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPageIndex(0);
  };

  return (
    <section
      id="services"
      aria-label="เว็บไซต์บริการของทางสโมสร"
      className="h-full w-full bg-[#080B11] text-white flex items-center justify-center px-5 pr-9 sm:px-10 lg:px-14 py-4 lg:py-10 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] w-full my-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4 border-b border-white/15 pb-3 sm:pb-5 transition-all duration-700 delay-75 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-white">
              เว็บไซต์บริการของทางสโมสร
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-300">
              ศูนย์รวมเว็บแอปและระบบบริการออนไลน์สำหรับนักศึกษาคณะวิทยาศาสตร์ ม.อ.
              พร้อมอัปเดตและเพิ่มบริการใหม่ๆ ผ่านระบบหลังบ้านได้ตลอดเวลา
            </p>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-slate-400 shrink-0">
            SLIDE 05 / 06 · {filteredServices.length} SERVICES
          </span>
        </div>

        {/* Category Filter + Search + Pagination Controls */}
        <div
          className={`mt-3 sm:mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex overflow-x-auto max-w-full sm:flex-wrap gap-1.5 pb-1 sm:pb-0">
            {categories.map((cat) => {
              const active = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium border transition-colors ${
                    active
                      ? "border-[#FFE600] bg-[#FFE600] text-[#080B11] font-semibold"
                      : "border-white/15 bg-[#0D131F] text-slate-300 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none sm:w-64 min-w-[140px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="ค้นหาเว็บไซต์บริการ..."
                className="w-full border border-white/20 bg-[#0D131F] pl-8 sm:pl-9 pr-3 py-1 sm:py-1.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-[#FFE600] focus:outline-none"
              />
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={safePageIndex === 0}
                  aria-label="ดูบริการชุดก่อนหน้า"
                  className="inline-flex items-center gap-1 border border-white/20 bg-[#0D131F] px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-white hover:bg-[#FFE600] hover:text-[#080B11] hover:border-[#FFE600] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ก่อนหน้า</span>
                </button>

                <span className="border border-white/15 bg-[#0D131F] px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-slate-200">
                  {safePageIndex + 1} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={safePageIndex >= totalPages - 1}
                  aria-label="ดูบริการชุดถัดไป"
                  className="inline-flex items-center gap-1 border border-white/20 bg-[#0D131F] px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-white hover:bg-[#FFE600] hover:text-[#080B11] hover:border-[#FFE600] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">ถัดไป</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Services Bento Grid (Max 3 per centered slide) */}
        {paginatedServices.length === 0 ? (
          <div className="mt-6 border border-dashed border-white/20 bg-[#0D131F] p-12 text-center space-y-3">
            <Globe className="mx-auto h-8 w-8 text-slate-500" />
            <p className="text-slate-300">
              ไม่พบเว็บไซต์บริการที่ตรงกับคำค้นหาหรือหมวดหมู่ที่เลือก
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ทั้งหมด");
                setSearchQuery("");
                setPageIndex(0);
              }}
              className="border border-[#FFE600]/45 bg-[#FFE600]/10 px-4 py-2 text-xs font-medium text-[#FFE600] hover:bg-[#FFE600] hover:text-[#080B11] transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/15">
            {paginatedServices.map((service, index) => {
              const statusBadge = getStatusBadge(service.status);
              const isMaintenance = service.status === "maintenance";
              return (
                <article
                  key={service.id}
                  style={{ transitionDelay: `${120 + index * 70}ms` }}
                  className={`group flex flex-col border-r border-b border-white/15 bg-[#0D131F] hover:bg-[#111A2B] transition-all duration-700 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                >
                  {/* Preview Cover */}
                  <div className="relative h-36 md:h-40 lg:h-48 w-full overflow-hidden bg-[#080B11] border-b border-white/15">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="border border-white/20 bg-[#080B11]/90 px-2.5 py-1 font-mono text-[11px] text-slate-200">
                        {service.category}
                      </span>
                      {service.featured && (
                        <span className="inline-flex items-center gap-1 bg-[#FFE600] px-2 py-1 font-mono text-[11px] font-bold text-[#080B11]">
                          <Star className="h-3 w-3 fill-[#080B11]" />
                          <span>แนะนำ</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`absolute top-3 right-3 border px-2.5 py-1 font-mono text-[11px] font-medium ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 lg:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-slate-400 truncate">
                        {service.url.replace(/^https?:\/\//, "")}
                      </span>

                      {isMaintenance ? (
                        <span className="shrink-0 border border-white/15 bg-[#080B11] px-3 py-2 font-mono text-xs text-slate-400 cursor-not-allowed">
                          ปิดปรับปรุง
                        </span>
                      ) : (
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-2 bg-[#FFE600] px-3.5 py-2 text-xs font-bold text-[#080B11] hover:bg-white transition-colors"
                        >
                          <span>เข้าสู่เว็บไซต์</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
