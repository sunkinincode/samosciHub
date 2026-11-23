"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  Mail,
  MessageCircle,
  Quote,
  Share2,
  UserCheck,
  X,
} from "lucide-react";
import { Member } from "@/types/hub";

const MEMBERS_PER_PAGE = 4;

interface MembersSectionProps {
  members: Member[];
  isActive?: boolean;
  onModalOpenChange?: (isOpen: boolean) => void;
}

export function MembersSection({
  members,
  isActive = true,
  onModalOpenChange,
}: MembersSectionProps) {
  const [activeDept, setActiveDept] = useState<string>("ทั้งหมด");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const departments = useMemo(() => {
    const unique = Array.from(
      new Set(members.map((m) => m.department).filter(Boolean))
    );
    return ["ทั้งหมด", ...unique];
  }, [members]);

  const filteredMembers = useMemo(() => {
    if (activeDept === "ทั้งหมด") return members;
    return members.filter((m) => m.department === activeDept);
  }, [members, activeDept]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)
  );
  const safePageIndex = Math.min(pageIndex, totalPages - 1);

  const paginatedMembers = useMemo(() => {
    const start = safePageIndex * MEMBERS_PER_PAGE;
    return filteredMembers.slice(start, start + MEMBERS_PER_PAGE);
  }, [filteredMembers, safePageIndex]);

  const handleSelectDept = (dept: string) => {
    setActiveDept(dept);
    setPageIndex(0);
  };

  useEffect(() => {
    onModalOpenChange?.(Boolean(selectedMember));
  }, [selectedMember, onModalOpenChange]);

  useEffect(() => {
    if (!selectedMember) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMember]);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <section
      id="members"
      aria-label="มีใครบ้างในสโมสรนักศึกษา"
      className="h-full w-full bg-[#F4F4F0] text-[#080B11] flex items-center justify-center px-5 pr-9 sm:px-10 lg:px-14 py-4 lg:py-10 overflow-hidden"
    >
      <div className="mx-auto max-w-[1360px] w-full my-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4 border-b border-black/15 pb-3 sm:pb-5 transition-all duration-700 delay-75 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-[#080B11]">
              มีใครบ้างในสโมสรนักศึกษา
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-700">
              รู้จักคณะกรรมการบริหารและทีมงานแต่ละฝ่าย สามารถ{" "}
              <span className="font-semibold text-[#080B11] underline decoration-[#FFE600] decoration-4 underline-offset-4">
                คลิกที่รูปภาพของแต่ละคน
              </span>{" "}
              เพื่อดูบทบาทหน้าที่และช่องทางติดต่อโดยตรง
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] sm:text-xs text-[#080B11]/80 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{filteredMembers.length} MEMBERS</span>
            </span>
            <span>SLIDE 04 / 06</span>
          </div>
        </div>

        {/* Sharp Department Filter Tabs + Slide Pagination Controls */}
        <div
          className={`mt-3 sm:mt-5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 transition-all duration-700 delay-100 ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div
            role="tablist"
            aria-label="กรองตามฝ่ายในสโมสร"
            className="flex overflow-x-auto max-w-full sm:flex-wrap gap-1.5 pb-1 sm:pb-0"
          >
            {departments.map((dept) => {
              const active = dept === activeDept;
              return (
                <button
                  key={dept}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectDept(dept)}
                  className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium border transition-colors ${
                    active
                      ? "border-[#080B11] bg-[#FFE600] text-[#080B11] font-semibold"
                      : "border-black/15 bg-white text-[#080B11]/80 hover:border-[#080B11] hover:text-[#080B11]"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={safePageIndex === 0}
                aria-label="ดูสมาชิกชุดก่อนหน้า"
                className="inline-flex items-center gap-1 sm:gap-1.5 border border-[#080B11]/25 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-[#080B11] hover:bg-[#FFE600] hover:border-[#080B11] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>ก่อนหน้า</span>
              </button>

              <span className="border border-[#080B11]/15 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-[#080B11]">
                หน้า {safePageIndex + 1} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={safePageIndex >= totalPages - 1}
                aria-label="ดูสมาชิกชุดถัดไป"
                className="inline-flex items-center gap-1 sm:gap-1.5 border border-[#080B11]/25 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-[#080B11] hover:bg-[#FFE600] hover:border-[#080B11] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
              >
                <span>ถัดไป</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Sharp Architectural Members Grid (2x2 Mobile, 1x4 Desktop) */}
        {paginatedMembers.length === 0 ? (
          <div className="mt-6 border border-dashed border-black/25 bg-white p-12 text-center">
            <p className="text-slate-700">ยังไม่มีรายชื่อกรรมการในฝ่ายนี้</p>
          </div>
        ) : (
          <div className="mt-3 sm:mt-4 grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/15 bg-white">
            {paginatedMembers.map((member, index) => (
              <article
                key={member.id}
                style={{ transitionDelay: `${120 + index * 60}ms` }}
                className={`group flex flex-col border-r border-b border-black/15 bg-white hover:bg-[#FAFAF7] transition-all duration-700 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                {/* Clickable Portrait Button */}
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  aria-label={`ดูรายละเอียดและช่องทางติดต่อของ ${member.name}`}
                  className="relative w-full h-28 sm:h-36 md:h-44 lg:h-52 overflow-hidden bg-[#080B11] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFE600] cursor-pointer"
                >
                  <img
                    src={member.imageUrl}
                    alt={`${member.name} (${member.nickname}) - ${member.role}`}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#080B11]/90 border border-white/15 px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[11px] font-medium text-white max-w-[85%] truncate">
                    {member.department}
                  </span>

                  <span className="absolute bottom-0 right-0 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center bg-[#FFE600] text-[#080B11] group-hover:bg-[#080B11] group-hover:text-[#FFE600] transition-colors">
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>

                  <span className="absolute bottom-0 left-0 right-7 sm:right-9 bg-[#080B11]/90 px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[11px] font-mono text-slate-200 border-t border-white/10 group-hover:text-[#FFE600] transition-colors truncate">
                    กดที่รูปเพื่อดูรายละเอียดและติดต่อ
                  </span>
                </button>

                {/* Card Footer */}
                <div className="p-2.5 sm:p-3.5 lg:p-4 flex-1 flex flex-col justify-between gap-1">
                  <div>
                    <p className="font-mono text-[10px] sm:text-xs font-semibold text-[#080B11]/70 truncate">
                      {member.role}
                    </p>
                    <h3 className="mt-0.5 sm:mt-1 text-xs sm:text-base font-bold text-[#080B11] leading-snug truncate">
                      {member.name}{" "}
                      {member.nickname && (
                        <span className="text-[11px] sm:text-sm font-medium text-slate-600">
                          ({member.nickname})
                        </span>
                      )}
                    </h3>
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-600 truncate">
                      {member.yearAndMajor}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Member Detail & Contact Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080B11]/85"
          onClick={() => setSelectedMember(null)}
        >
          <div
            data-modal-scroll="true"
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20 bg-[#080B11] text-white shadow-[0_32px_90px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="ปิดหน้าต่าง"
              className="absolute top-0 right-0 z-10 flex h-11 w-11 items-center justify-center bg-[#FFE600] text-[#080B11] hover:bg-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 bg-[#0D131F] border-b md:border-b-0 md:border-r border-white/15">
                <div className="aspect-[4/5] w-full h-full">
                  <img
                    src={selectedMember.imageUrl}
                    alt={selectedMember.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 space-y-5">
                <div className="pr-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#FFE600] px-2.5 py-1 text-xs font-bold text-[#080B11]">
                      {selectedMember.role}
                    </span>
                    <span className="border border-white/20 bg-[#0D131F] px-2.5 py-1 text-xs text-slate-200">
                      {selectedMember.department}
                    </span>
                  </div>

                  <h3
                    id="member-modal-title"
                    className="mt-4 font-display text-2xl font-bold text-white"
                  >
                    {selectedMember.name}
                    {selectedMember.nickname && (
                      <span className="ml-2 text-lg font-medium text-[#FFE600]">
                        ({selectedMember.nickname})
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedMember.yearAndMajor}
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-white/10 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#FFE600]">
                    RESPONSIBILITIES // หน้าที่ความรับผิดชอบ
                  </p>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {selectedMember.bio ||
                      "ปฏิบัติหน้าที่ร่วมขับเคลื่อนกิจกรรมและสวัสดิการนักศึกษาคณะวิทยาศาสตร์ ม.อ."}
                  </p>
                </div>

                {selectedMember.quote && (
                  <blockquote className="border border-white/15 bg-[#0D131F] p-4 text-sm italic text-slate-300 flex gap-3">
                    <Quote className="h-4 w-4 shrink-0 text-[#FFE600] mt-0.5" />
                    <span>“{selectedMember.quote}”</span>
                  </blockquote>
                )}

                <div className="pt-3 border-t border-white/10 space-y-3">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
                    DIRECT CONTACTS // ช่องทางติดต่อส่วนตัว
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedMember.contacts.line && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(selectedMember.contacts.line!, "line")
                        }
                        className="flex items-center justify-between gap-2 border border-[#FFE600]/45 bg-[#FFE600]/10 px-3.5 py-2.5 text-left text-xs sm:text-sm text-[#FFE600] hover:bg-[#FFE600] hover:text-[#080B11] transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <MessageCircle className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            LINE: {selectedMember.contacts.line}
                          </span>
                        </span>
                        {copiedKey === "line" ? (
                          <Check className="h-4 w-4 shrink-0" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 shrink-0 opacity-75" />
                        )}
                      </button>
                    )}

                    {selectedMember.contacts.instagram && (
                      <a
                        href={
                          selectedMember.contacts.instagram.startsWith("http")
                            ? selectedMember.contacts.instagram
                            : `https://instagram.com/${selectedMember.contacts.instagram.replace(
                                /^@/,
                                ""
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 border border-white/20 bg-[#0D131F] px-3.5 py-2.5 text-xs sm:text-sm text-white hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Instagram className="h-4 w-4 shrink-0" />
                          <span className="truncate">Instagram</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    )}

                    {selectedMember.contacts.facebook && (
                      <a
                        href={
                          selectedMember.contacts.facebook.startsWith("http")
                            ? selectedMember.contacts.facebook
                            : `https://facebook.com/${selectedMember.contacts.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 border border-white/20 bg-[#0D131F] px-3.5 py-2.5 text-xs sm:text-sm text-white hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Share2 className="h-4 w-4 shrink-0" />
                          <span className="truncate">Facebook</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    )}

                    {selectedMember.contacts.email && (
                      <a
                        href={`mailto:${selectedMember.contacts.email}`}
                        className="flex items-center justify-between gap-2 border border-white/20 bg-[#0D131F] px-3.5 py-2.5 text-xs sm:text-sm text-white hover:border-[#FFE600] hover:text-[#FFE600] transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {selectedMember.contacts.email}
                          </span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    )}
                  </div>

                  {!selectedMember.contacts.line &&
                    !selectedMember.contacts.instagram &&
                    !selectedMember.contacts.facebook &&
                    !selectedMember.contacts.email && (
                      <p className="text-xs text-slate-400">
                        ยังไม่ได้ระบุช่องทางติดต่อส่วนตัว สามารถติดต่อผ่านช่องทางกลางของสโมสรในสไลด์สุดท้ายได้
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
