"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { ImageField } from "@/components/admin/ImageField";
import { Member } from "@/types/hub";

interface MembersTabProps {
  members: Member[];
  onUpdated: (members: Member[]) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}

const EMPTY_MEMBER: Omit<Member, "id" | "order"> = {
  name: "",
  nickname: "",
  role: "",
  department: "ฝ่ายบริหาร",
  yearAndMajor: "",
  bio: "",
  quote: "",
  imageUrl: "/assets/members/member-1.svg",
  contacts: {
    instagram: "",
    facebook: "",
    line: "",
    email: "",
  },
};

const DEPARTMENT_SUGGESTIONS = [
  "ฝ่ายบริหาร",
  "ฝ่ายวิชาการ",
  "ฝ่ายกิจกรรมและสวัสดิการ",
  "ฝ่ายประชาสัมพันธ์และโสตฯ",
  "ฝ่ายพัสดุและสถานที่",
];

export function MembersTab({
  members,
  onUpdated,
  onNotify,
}: MembersTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_MEMBER);
  };

  const startEdit = (mem: Member) => {
    setEditingId(mem.id);
    setForm({
      name: mem.name,
      nickname: mem.nickname,
      role: mem.role,
      department: mem.department,
      yearAndMajor: mem.yearAndMajor,
      bio: mem.bio,
      quote: mem.quote,
      imageUrl: mem.imageUrl,
      contacts: {
        instagram: mem.contacts?.instagram || "",
        facebook: mem.contacts?.facebook || "",
        line: mem.contacts?.line || "",
        email: mem.contacts?.email || "",
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      onNotify("error", "กรุณากรอกชื่อ-นามสกุล และตำแหน่ง");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/members", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = (await res.json()) as { members?: Member[]; error?: string };
      if (!res.ok || !data.members) {
        onNotify("error", data.error || "บันทึกข้อมูลกรรมการไม่สำเร็จ");
        return;
      }
      onUpdated(data.members);
      onNotify(
        "success",
        editingId ? "อัปเดตข้อมูลกรรมการแล้ว" : "เพิ่มรายชื่อกรรมการใหม่แล้ว"
      );
      resetForm();
    } catch {
      onNotify("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ต้องการลบ "${name}" ออกจากรายชื่อคณะกรรมการใช่หรือไม่?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { members?: Member[]; error?: string };
      if (!res.ok || !data.members) {
        onNotify("error", data.error || "ลบข้อมูลไม่สำเร็จ");
        return;
      }
      if (editingId === id) resetForm();
      onUpdated(data.members);
      onNotify("success", "ลบข้อมูลกรรมการเรียบร้อยแล้ว");
    } catch {
      onNotify("error", "เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= members.length) return;

    const reordered = [...members];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const normalized = reordered.map((m, idx) => ({ ...m, order: idx + 1 }));

    onUpdated(normalized);
    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: normalized }),
      });
      const data = (await res.json()) as { members?: Member[] };
      if (res.ok && data.members) {
        onUpdated(data.members);
        onNotify("success", "อัปเดตลำดับคณะกรรมการแล้ว");
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
            {editingId ? "แก้ไขข้อมูลกรรมการ" : "เพิ่มคณะกรรมการสโมสร"}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ชื่อ - นามสกุล *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="เช่น ธนกฤต ศรีสุวรรณ"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ชื่อเล่น
              </label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="เช่น ภูมิ"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ตำแหน่ง *
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="เช่น นายกสโมสรนักศึกษา"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ฝ่าย (Department)
              </label>
              <input
                type="text"
                list="member-departments"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
              />
              <datalist id="member-departments">
                {DEPARTMENT_SUGGESTIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ชั้นปีและสาขาวิชา
            </label>
            <input
              type="text"
              value={form.yearAndMajor}
              onChange={(e) =>
                setForm({ ...form, yearAndMajor: e.target.value })
              }
              placeholder="เช่น ชั้นปีที่ 3 · วิทยาการคอมพิวเตอร์"
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              รายละเอียดหน้าที่ความรับผิดชอบ
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              คติประจำใจ (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <ImageField
            label="รูปภาพประจำตัว (แสดงในหน้าเว็บและป๊อปอัป)"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspectClass="aspect-[4/5]"
          />

          <div className="pt-2 border-t border-sky-400/15 space-y-3">
            <p className="text-xs font-semibold text-sky-300">
              ช่องทางติดต่อส่วนตัว (แสดงเมื่อกดที่รูปภาพ)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={form.contacts.line || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contacts: { ...form.contacts, line: e.target.value },
                  })
                }
                placeholder="LINE ID"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="text"
                value={form.contacts.instagram || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contacts: { ...form.contacts, instagram: e.target.value },
                  })
                }
                placeholder="Instagram (เช่น @name หรือ URL)"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="text"
                value={form.contacts.facebook || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contacts: { ...form.contacts, facebook: e.target.value },
                  })
                }
                placeholder="Facebook (URL หรือชื่อ)"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="email"
                value={form.contacts.email || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contacts: { ...form.contacts, email: e.target.value },
                  })
                }
                placeholder="Email (เช่น name@psu.ac.th)"
                className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-3.5 py-2 text-xs text-white focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

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
                  ? "บันทึกการแก้ไขกรรมการ"
                  : "เพิ่มรายชื่อกรรมการ"}
            </span>
          </button>
        </form>
      </div>

      {/* List Column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            รายชื่อคณะกรรมการสโมสร ({members.length})
          </h2>
          <span className="text-xs text-slate-400">
            คลิกแก้ไขเพื่อเปลี่ยนรูปหรือช่องทางติดต่อได้ทันที
          </span>
        </div>

        <div className="space-y-3">
          {members.map((mem, idx) => (
            <div
              key={mem.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-sky-400/20 bg-[#0B1120] p-4 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={mem.imageUrl}
                  alt={mem.name}
                  className="h-16 w-14 shrink-0 rounded-lg border border-sky-400/20 object-cover bg-[#060911]"
                />
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-200">
                      {mem.department}
                    </span>
                    <span className="text-[11px] font-semibold text-yellow-300">
                      {mem.role}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {mem.name} {mem.nickname ? `(${mem.nickname})` : ""}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {mem.yearAndMajor}
                  </p>
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
                  disabled={idx === members.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  aria-label="เลื่อนลง"
                  className="rounded-lg border border-slate-700 bg-[#060911] p-2 text-slate-300 hover:border-sky-400 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(mem)}
                  aria-label="แก้ไข"
                  className="rounded-lg border border-sky-400/30 bg-sky-500/10 p-2 text-sky-200 hover:bg-sky-500/20"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(mem.id, mem.name)}
                  aria-label="ลบ"
                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
