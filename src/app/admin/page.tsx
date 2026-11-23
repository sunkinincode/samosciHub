"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Settings,
  Users,
  XCircle,
} from "lucide-react";
import { MembersTab } from "@/components/admin/MembersTab";
import { SecurityTab } from "@/components/admin/SecurityTab";
import { ServicesTab } from "@/components/admin/ServicesTab";
import { SiteConfigTab } from "@/components/admin/SiteConfigTab";
import { PublicHubData } from "@/types/hub";

type AdminTab = "services" | "members" | "config" | "security";

function AdminConsoleInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as AdminTab) || "services";

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>(
    ["services", "members", "config", "security"].includes(initialTab)
      ? initialTab
      : "services"
  );
  const [hubData, setHubData] = useState<PublicHubData | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadHubData = useCallback(async () => {
    try {
      const res = await fetch("/api/hub", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as PublicHubData;
        setHubData(data);
      }
    } catch {
      notify("error", "โหลดข้อมูลเว็บไซต์ไม่สำเร็จ");
    }
  }, [notify]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        const data = (await res.json()) as { authenticated?: boolean };
        if (data.authenticated) {
          setAuthenticated(true);
          await loadHubData();
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    void check();
  }, [loadHubData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as {
        authenticated?: boolean;
        error?: string;
      };
      if (!res.ok || !data.authenticated) {
        setLoginError(data.error || "รหัสผ่านไม่ถูกต้อง");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      await loadHubData();
    } catch {
      setLoginError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthenticated(false);
    setHubData(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060911] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-300">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">กำลังตรวจสอบสิทธิ์ระบบหลังบ้าน...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#080B11] flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-white/15 bg-[#0D131F] p-7 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.75)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <img
              src="/assets/logo-text-white.svg"
              alt="SAMO SCI PSU"
              className="h-9 w-auto object-contain"
            />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#FFE600]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>กลับหน้าหลัก</span>
            </Link>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-[#FFE600]" />
              <span>เข้าสู่ระบบหลังบ้านสโมสร</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              จัดการเว็บไซต์บริการ รายชื่อกรรมการ และช่องทางติดต่อ
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                รหัสผ่านผู้ดูแลระบบ
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านแอดมิน..."
                className="w-full rounded-xl border border-sky-400/30 bg-[#060911] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-yellow-400 focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-[#060911] hover:bg-yellow-300 disabled:opacity-50 transition-colors"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loggingIn ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบหลังบ้าน"}</span>
            </button>
          </form>

          <p className="rounded-xl border border-sky-400/15 bg-[#060911]/80 px-3.5 py-2.5 text-xs text-slate-400">
            รหัสผ่านเริ่มต้นสำหรับติดตั้งครั้งแรก:{" "}
            <code className="font-mono text-yellow-300">samosci2026</code>{" "}
            (สามารถเปลี่ยนได้ในแท็บตั้งค่ารหัสผ่าน)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-50 flex flex-col">
      {/* Admin Topbar */}
      <header className="sticky top-0 z-40 border-b border-sky-400/20 bg-[#080D19]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-yellow-300" />
            <span className="font-display font-bold text-white text-sm sm:text-base">
              SAMO SCI PSU · ระบบจัดการหลังบ้าน
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3.5 py-2 text-xs font-medium text-sky-200 hover:bg-sky-500/20 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ดูหน้าเว็บไซต์จริง</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <div
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-md ${
              toast.type === "success"
                ? "border-emerald-400/50 bg-[#0A1F1C]/95 text-emerald-200"
                : "border-rose-400/50 bg-[#240B14]/95 text-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-sky-400/15 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
              activeTab === "services"
                ? "border-yellow-400 bg-yellow-400 text-[#060911] font-semibold"
                : "border-sky-400/20 bg-[#0B1120] text-slate-300 hover:text-white"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>เว็บไซต์บริการ ({hubData?.services.length ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
              activeTab === "members"
                ? "border-yellow-400 bg-yellow-400 text-[#060911] font-semibold"
                : "border-sky-400/20 bg-[#0B1120] text-slate-300 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>คณะกรรมการสโมสร ({hubData?.members.length ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("config")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
              activeTab === "config"
                ? "border-yellow-400 bg-yellow-400 text-[#060911] font-semibold"
                : "border-sky-400/20 bg-[#0B1120] text-slate-300 hover:text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>เนื้อหา &amp; ช่องทางติดต่อ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
              activeTab === "security"
                ? "border-yellow-400 bg-yellow-400 text-[#060911] font-semibold"
                : "border-sky-400/20 bg-[#0B1120] text-slate-300 hover:text-white"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>รหัสผ่านแอดมิน</span>
          </button>
        </div>

        {/* Active Tab Content */}
        {!hubData ? (
          <div className="py-16 flex items-center justify-center text-sky-300 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <>
            {activeTab === "services" && (
              <ServicesTab
                services={hubData.services}
                onUpdated={(services) =>
                  setHubData((prev) => (prev ? { ...prev, services } : prev))
                }
                onNotify={notify}
              />
            )}

            {activeTab === "members" && (
              <MembersTab
                members={hubData.members}
                onUpdated={(members) =>
                  setHubData((prev) => (prev ? { ...prev, members } : prev))
                }
                onNotify={notify}
              />
            )}

            {activeTab === "config" && (
              <SiteConfigTab
                config={hubData.siteConfig}
                onUpdated={(siteConfig) =>
                  setHubData((prev) => (prev ? { ...prev, siteConfig } : prev))
                }
                onNotify={notify}
              />
            )}

            {activeTab === "security" && <SecurityTab onNotify={notify} />}
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060911] flex items-center justify-center text-sky-300">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <AdminConsoleInner />
    </Suspense>
  );
}
