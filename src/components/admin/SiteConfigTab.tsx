"use client";

import React, { useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { LineBatch, SiteConfig, WhatWeDoItem } from "@/types/hub";

interface SiteConfigTabProps {
  config: SiteConfig;
  onUpdated: (config: SiteConfig) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}

export function SiteConfigTab({
  config,
  onUpdated,
  onNotify,
}: SiteConfigTabProps) {
  const [form, setForm] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);

  const updateMission = (idx: number, patch: Partial<WhatWeDoItem>) => {
    const next = form.whatWeDoItems.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setForm({ ...form, whatWeDoItems: next });
  };

  const updateBatch = (idx: number, patch: Partial<LineBatch>) => {
    const next = form.lineBatches.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setForm({ ...form, lineBatches: next });
  };

  const addBatch = () => {
    const newBatch: LineBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: "60",
      title: "SCI PSU 60",
      description: "ไลน์แจ้งข่าวสารและสอบถามด่วนสำหรับนักศึกษาวิทย์ รุ่น 60",
      lineUrl: "https://line.me/R/ti/p/@scipsu60",
      lineId: "SCI PSU 60",
    };
    setForm({ ...form, lineBatches: [newBatch, ...form.lineBatches] });
  };

  const removeBatch = (idx: number) => {
    setForm({
      ...form,
      lineBatches: form.lineBatches.filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/hub", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteConfig: form }),
      });
      const data = (await res.json()) as {
        siteConfig?: SiteConfig;
        error?: string;
      };
      if (!res.ok || !data.siteConfig) {
        onNotify("error", data.error || "บันทึกการตั้งค่าไม่สำเร็จ");
        return;
      }
      onUpdated(data.siteConfig);
      onNotify("success", "บันทึกเนื้อหาเว็บไซต์และช่องทางติดต่อเรียบร้อยแล้ว");
    } catch {
      onNotify("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Hero & Who We Are */}
      <div className="rounded-2xl border border-sky-400/20 bg-[#0B1120] p-6 space-y-5">
        <h2 className="text-lg font-bold text-white border-b border-sky-400/15 pb-3">
          ส่วนเปิดตัวหน้าแรก &amp; แนะนำ &ldquo;เราคือใคร&rdquo;
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ข้อความป้ายด้านบน (Hero Badge)
            </label>
            <input
              type="text"
              value={form.heroBadge}
              onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              หัวข้อหลัก (Hero Title)
            </label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              หัวข้อรอง (Hero Subtitle)
            </label>
            <input
              type="text"
              value={form.heroSubtitle}
              onChange={(e) =>
                setForm({ ...form, heroSubtitle: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คำโปรยหน้าแรก (Hero Tagline)
            </label>
            <input
              type="text"
              value={form.heroTagline}
              onChange={(e) =>
                setForm({ ...form, heroTagline: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              หัวข้อ &ldquo;เราคือใคร&rdquo;
            </label>
            <input
              type="text"
              value={form.whoWeAreTitle}
              onChange={(e) =>
                setForm({ ...form, whoWeAreTitle: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คำโปรยรอง &ldquo;เราคือใคร&rdquo;
            </label>
            <input
              type="text"
              value={form.whoWeAreSubtitle}
              onChange={(e) =>
                setForm({ ...form, whoWeAreSubtitle: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            คำอธิบาย &ldquo;เราคือใคร&rdquo;
          </label>
          <textarea
            rows={3}
            value={form.whoWeAreDescription}
            onChange={(e) =>
              setForm({ ...form, whoWeAreDescription: e.target.value })
            }
            className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
          />
        </div>
      </div>

      {/* What We Do */}
      <div className="rounded-2xl border border-sky-400/20 bg-[#0B1120] p-6 space-y-5">
        <h2 className="text-lg font-bold text-white border-b border-sky-400/15 pb-3">
          ส่วน &ldquo;สโมสรนักศึกษาทำอะไร&rdquo;
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              หัวข้อหลัก
            </label>
            <input
              type="text"
              value={form.whatWeDoTitle}
              onChange={(e) =>
                setForm({ ...form, whatWeDoTitle: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คำอธิบายรอง
            </label>
            <input
              type="text"
              value={form.whatWeDoSubtitle}
              onChange={(e) =>
                setForm({ ...form, whatWeDoSubtitle: e.target.value })
              }
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.whatWeDoItems.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-sky-400/15 bg-[#060911]/80 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-yellow-300">
                  พันธกิจ #{idx + 1}
                </span>
                <input
                  type="text"
                  value={item.badge}
                  onChange={(e) =>
                    updateMission(idx, { badge: e.target.value })
                  }
                  className="w-40 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-1 text-[11px] font-mono text-sky-300"
                />
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateMission(idx, { title: e.target.value })}
                className="w-full rounded-lg border border-sky-400/20 bg-[#0B1120] px-3 py-2 text-sm font-semibold text-white"
              />
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) =>
                  updateMission(idx, { description: e.target.value })
                }
                className="w-full rounded-lg border border-sky-400/20 bg-[#0B1120] px-3 py-2 text-xs text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Channels & LINE SCI PSU XX Batches */}
      <div className="rounded-2xl border border-emerald-400/25 bg-[#0B1120] p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/15 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              ช่องทางติดต่อหลัก &amp; รุ่น LINE (SCI PSU XX)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              จัดการเวลาตอบกลับ ลิงก์ IG / FB และรายการรุ่นนักศึกษาสำหรับ LINE SCI PSU XX
            </p>
          </div>
          <button
            type="button"
            onClick={addBatch}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>เพิ่มรุ่น LINE ใหม่</span>
          </button>
        </div>

        {/* Global LINE / IG / FB settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-400/25 bg-[#060911]/80 p-4 space-y-3">
            <p className="font-mono text-xs text-emerald-300">LINE HEADER</p>
            <input
              type="text"
              value={form.lineTitle}
              onChange={(e) => setForm({ ...form, lineTitle: e.target.value })}
              placeholder="SCI PSU XX"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-sm text-white"
            />
            <input
              type="text"
              value={form.lineSubtitle}
              onChange={(e) =>
                setForm({ ...form, lineSubtitle: e.target.value })
              }
              placeholder="XX คือรุ่นวิทยาศาสตร์ที่เข้าเรียน"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-slate-200"
            />
            <input
              type="text"
              value={form.lineResponseTime}
              onChange={(e) =>
                setForm({ ...form, lineResponseTime: e.target.value })
              }
              placeholder="ส่วนใหญ่ตอบทันที หรือภายใน 1 ชั่วโมง"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-emerald-200"
            />
          </div>

          <div className="rounded-xl border border-pink-400/25 bg-[#060911]/80 p-4 space-y-3">
            <p className="font-mono text-xs text-pink-300">INSTAGRAM</p>
            <input
              type="text"
              value={form.igHandle}
              onChange={(e) => setForm({ ...form, igHandle: e.target.value })}
              placeholder="samosci.psu_official"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-sm text-white"
            />
            <input
              type="url"
              value={form.igUrl}
              onChange={(e) => setForm({ ...form, igUrl: e.target.value })}
              placeholder="https://www.instagram.com/..."
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-slate-200"
            />
            <input
              type="text"
              value={form.igResponseTime}
              onChange={(e) =>
                setForm({ ...form, igResponseTime: e.target.value })
              }
              placeholder="ภายใน 1 สัปดาห์"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-pink-200"
            />
          </div>

          <div className="rounded-xl border border-blue-400/25 bg-[#060911]/80 p-4 space-y-3">
            <p className="font-mono text-xs text-blue-300">FACEBOOK</p>
            <input
              type="text"
              value={form.fbName}
              onChange={(e) => setForm({ ...form, fbName: e.target.value })}
              placeholder="SCIstudentPSU"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-sm text-white"
            />
            <input
              type="url"
              value={form.fbUrl}
              onChange={(e) => setForm({ ...form, fbUrl: e.target.value })}
              placeholder="https://www.facebook.com/..."
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-slate-200"
            />
            <input
              type="text"
              value={form.fbResponseTime}
              onChange={(e) =>
                setForm({ ...form, fbResponseTime: e.target.value })
              }
              placeholder="ภายใน 2 สัปดาห์"
              className="w-full rounded-lg border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs text-blue-200"
            />
          </div>
        </div>

        {/* LINE Batches List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-emerald-300">
            รายการรุ่น LINE (SCI PSU XX):
          </p>
          {form.lineBatches.map((batch, idx) => (
            <div
              key={batch.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-xl border border-slate-800 bg-[#060911]/80 p-3.5 items-center"
            >
              <input
                type="text"
                value={batch.batchNumber}
                onChange={(e) =>
                  updateBatch(idx, { batchNumber: e.target.value })
                }
                placeholder="รุ่น XX"
                className="md:col-span-1 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={batch.title}
                onChange={(e) => updateBatch(idx, { title: e.target.value })}
                placeholder="ชื่อปุ่ม (SCI PSU 59)"
                className="md:col-span-2 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={batch.lineId}
                onChange={(e) => updateBatch(idx, { lineId: e.target.value })}
                placeholder="Line ID / ชื่อกลุ่ม"
                className="md:col-span-2 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-2 text-xs text-emerald-200"
              />
              <input
                type="url"
                value={batch.lineUrl}
                onChange={(e) => updateBatch(idx, { lineUrl: e.target.value })}
                placeholder="ลิงก์ LINE (https://line.me/...)"
                className="md:col-span-3 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-2 text-xs text-sky-200"
              />
              <input
                type="text"
                value={batch.description}
                onChange={(e) =>
                  updateBatch(idx, { description: e.target.value })
                }
                placeholder="คำอธิบายสั้นๆ"
                className="md:col-span-3 rounded-lg border border-slate-700 bg-[#0B1120] px-2.5 py-2 text-xs text-slate-300"
              />
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeBatch(idx)}
                  aria-label="ลบรุ่นนี้"
                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-[#060911] shadow-[0_12px_36px_rgba(250,204,21,0.3)] hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่าทั้งหมด"}</span>
        </button>
      </div>
    </form>
  );
}
