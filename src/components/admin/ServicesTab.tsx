"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { ImageField } from "@/components/admin/ImageField";
import { ServiceStatus, ServiceWebsite } from "@/types/hub";

interface ServicesTabProps {
  services: ServiceWebsite[];
  onUpdated: (services: ServiceWebsite[]) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}

const EMPTY_SERVICE: Omit<ServiceWebsite, "id" | "order"> = {
  title: "",
  description: "",
  url: "",
  imageUrl: "/assets/services/service-1.svg",
  category: "บริการพัสดุและสถานที่",
  status: "active",
  featured: false,
};

const CATEGORY_SUGGESTIONS = [
  "บริการพัสดุและสถานที่",
  "วิชาการและการเรียน",
  "กิจกรรมนักศึกษา",
  "สวัสดิการและร้องเรียน",
  "บริการทั่วไป",
];

export function ServicesTab({
  services,
  onUpdated,
  onNotify,
}: ServicesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_SERVICE);
  };

  const startEdit = (srv: ServiceWebsite) => {
    setEditingId(srv.id);
    setForm({
      title: srv.title,
      description: srv.description,
      url: srv.url,
      imageUrl: srv.imageUrl,
      category: srv.category,
      status: srv.status,
      featured: srv.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      onNotify("error", "กรุณากรอกชื่อเว็บไซต์และลิงก์ URL");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = (await res.json()) as {
        services?: ServiceWebsite[];
        error?: string;
      };
      if (!res.ok || !data.services) {
        onNotify("error", data.error || "บันทึกข้อมูลไม่สำเร็จ");
        return;
      }
      onUpdated(data.services);
      onNotify(
        "success",
        editingId
          ? "อัปเดตข้อมูลเว็บไซต์บริการแล้ว"
          : "เพิ่มเว็บไซต์บริการใหม่เรียบร้อยแล้ว"
      );
      resetForm();
    } catch {
      onNotify("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ต้องการลบ "${title}" ออกจากรายการเว็บไซต์บริการใช่หรือไม่?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as {
        services?: ServiceWebsite[];
        error?: string;
      };
      if (!res.ok || !data.services) {
        onNotify("error", data.error || "ลบข้อมูลไม่สำเร็จ");
        return;
      }
      if (editingId === id) resetForm();
      onUpdated(data.services);
      onNotify("success", "ลบเว็บไซต์บริการแล้ว");
    } catch {
      onNotify("error", "เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= services.length) return;

    const reordered = [...services];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const normalized = reordered.map((srv, idx) => ({ ...srv, order: idx + 1 }));

    onUpdated(normalized);
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: normalized }),
      });
      const data = (await res.json()) as { services?: ServiceWebsite[] };
      if (res.ok && data.services) {
        onUpdated(data.services);
        onNotify("success", "อัปเดตลำดับการแสดงผลแล้ว");
      }
    } catch {
      onNotify("error", "จัดเรียงลำดับไม่สำเร็จ");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Column */}
      <div className="lg:col-span-5 rounded-2xl border border-sky-400/25 bg-[#0B1120] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-sky-400/15 pb-3">
          <h2 className="text-lg font-bold text-white">
            {editingId ? "แก้ไขเว็บไซต์บริการ" : "เพิ่มเว็บไซต์บริการใหม่"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              <span>ยกเลิกแก้ไข</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ชื่อเว็บไซต์บริการ *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="เช่น ระบบจองห้องและยืมพัสดุสโมสร"
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ลิงก์เว็บไซต์ (URL) *
            </label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://service.samosci.psu.ac.th"
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                หมวดหมู่
              </label>
              <input
                type="text"
                list="service-categories"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
              <datalist id="service-categories">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                สถานะการใช้งาน
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ServiceStatus })
                }
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              >
                <option value="active">เปิดใช้งาน</option>
                <option value="coming_soon">เร็วๆ นี้</option>
                <option value="maintenance">ปิดปรับปรุง</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คำอธิบายเว็บไซต์บริการ
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="อธิบายจุดประสงค์และวิธีใช้งานสำหรับนักศึกษา..."
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <ImageField
            label="รูปภาพหน้าปกเว็บไซต์ (อัปโหลดจากเครื่อง หรือ วาง URL)"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />

          <label className="flex items-center gap-2.5 pt-1 text-sm text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-[#060911] text-yellow-400 focus:ring-yellow-400"
            />
            <span>ปักหมุดเป็นบริการแนะนำ (Featured)</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-[#060911] hover:bg-yellow-300 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>
              {saving
                ? "กำลังบันทึก..."
                : editingId
                  ? "บันทึกการแก้ไขเว็บไซต์"
                  : "เพิ่มเว็บไซต์บริการ"}
            </span>
          </button>
        </form>
      </div>

      {/* List Column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            รายการเว็บไซต์บริการทั้งหมด ({services.length})
          </h2>
          <span className="text-xs text-slate-400">
            กดลูกศรขึ้น-ลงเพื่อจัดลำดับการแสดงผล
          </span>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-400/25 bg-[#0B1120] p-10 text-center text-sm text-slate-400">
            ยังไม่มีเว็บไซต์บริการ กดเพิ่มรายการใหม่จากแบบฟอร์มด้านซ้าย
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((srv, idx) => (
              <div
                key={srv.id}
                className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-sky-400/20 bg-[#0B1120] p-4 items-start sm:items-center justify-between"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={srv.imageUrl}
                    alt={srv.title}
                    className="h-16 w-24 shrink-0 rounded-lg border border-sky-400/20 object-cover bg-[#060911]"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-200">
                        {srv.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        สถานะ:{" "}
                        {srv.status === "active"
                          ? "เปิดใช้งาน"
                          : srv.status === "coming_soon"
                            ? "เร็วๆ นี้"
                            : "ปิดปรับปรุง"}
                      </span>
                      {srv.featured && (
                        <span className="text-[11px] font-semibold text-yellow-300">
                          ★ แนะนำ
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {srv.description}
                    </p>
                    <a
                      href={srv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
                    >
                      <span className="truncate max-w-[260px]">{srv.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    aria-label="เลื่อนขึ้น"
                    className="rounded-lg border border-slate-700 bg-[#060911] p-2 text-slate-300 hover:border-sky-400 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === services.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    aria-label="เลื่อนลง"
                    className="rounded-lg border border-slate-700 bg-[#060911] p-2 text-slate-300 hover:border-sky-400 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(srv)}
                    aria-label="แก้ไข"
                    className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-2 text-sky-200 hover:bg-sky-500/20"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(srv.id, srv.title)}
                    aria-label="ลบ"
                    className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
