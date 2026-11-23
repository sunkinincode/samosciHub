"use client";

import React, { useState } from "react";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";

interface SecurityTabProps {
  onNotify: (type: "success" | "error", text: string) => void;
}

export function SecurityTab({ onNotify }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      onNotify("error", "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (newPassword !== confirmPassword) {
      onNotify("error", "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: newPassword.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        onNotify("error", data.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onNotify("success", data.message || "เปลี่ยนรหัสผ่านแอดมินเรียบร้อยแล้ว");
    } catch {
      onNotify("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl rounded-2xl border border-sky-400/20 bg-[#0B1120] p-6 sm:p-8 space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/35 bg-yellow-400/10 text-yellow-300">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">เปลี่ยนรหัสผ่านแอดมิน</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            ใช้สำหรับส่งต่อสิทธิ์การดูแลระบบหลังบ้านให้คณะกรรมการสโมสรรุ่นถัดไป
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            รหัสผ่านปัจจุบัน
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-sky-400/25 bg-[#060911] px-4 py-2.5 text-sm text-white focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-[#060911] hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          <span>{saving ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}</span>
        </button>
      </form>
    </div>
  );
}
