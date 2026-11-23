# samosciHub (SAMO SCI 69 · ศูนย์กลางสโมสรนักศึกษาคณะวิทยาศาสตร์ ม.อ.)

> **[Vibecode]** Official central web hub make for SAMO SCI PSU (Science Student Club, Prince of Songkla University) featuring a 100dvh presentation slide deck, committee directory, club web services hub, priority contact channels, and an admin backend.

เว็บไซต์ศูนย์กลางอย่างเป็นทางการของ **สโมสรนักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ (วิทยาเขตหาดใหญ่)** ออกแบบในรูปแบบ Presentation Slide Deck เต็มหน้าจอ (`100dvh`) เพื่อเชื่อมโยงข้อมูลองค์กร คณะกรรมการ เว็บไซต์บริการนักศึกษา และช่องทางติดต่อทั้งหมดไว้ในที่เดียว

---

## ✨ Features

- 🎬 **Opening Logo Sequence**: แอนิเมชันเปิดหน้าเว็บแบบเต็มจอด้วยโลโก้ `SAMO SCI 69` (Fade & Zoom-through) พร้อมปุ่มข้ามอินโทรและรองรับ `prefers-reduced-motion`
- 🧭 **100dvh Pinned Presentation Deck**: ระบบนำเสนอแบบ 6 สไลด์เต็มหน้าจอทั้งบนคอมพิวเตอร์และมือถือ พร้อม **Scroll-Threshold Accumulator** (หน่วงจังหวะการเลื่อนเมาส์/ปัดหน้าจอ) และแอนิเมชันเปลี่ยนสไลด์แบบ Scale & Slide Curtain:
  1. `01 หน้าปก` — แถบสีเหลือง `#FFE600` คู่ภาพเส้นสายสถาปัตยกรรมศูนย์วิทยาศาสตร์ (BSc Wireframe)
  2. `02 เราคือใคร (Who We Are)` — ข้อมูลแนะนำบทบาทของสโมสรนักศึกษาคณะวิทยาศาสตร์ ม.อ. กึ่งกลางหน้าจอ
  3. `03 เราทำอะไร (What We Do)` — สรุป 4 พันธกิจหลัก (กิจกรรมสร้างสรรค์, สวัสดิการ, วิชาการ, กระบอกเสียงและบริการดิจิทัล)
  4. `04 มีใครบ้าง` — รายชื่อคณะกรรมการแยกตามฝ่าย (จัดเรียงพอดีหน้าจอ พร้อมปุ่มแบ่งหน้าและ Modal รายละเอียด + ช่องทางติดต่อส่วนตัวเมื่อคลิกที่รูป)
  5. `05 เว็บไซต์บริการ` — ศูนย์รวมเว็บแอปและระบบออนไลน์ของสโมสร พร้อมแท็บกรองหมวดหมู่ ช่องค้นหา ป้ายสถานะ และปุ่มแบ่งหน้า
  6. `06 ช่องทางติดต่อ & Footer` — เรียงลำดับตามความเร็วในการตอบกลับ (`LINE : SCI PSU XX` ทันที–1 ชม. พร้อมตัวเลือกรุ่น `XX`, `IG : samosci.psu_official` ภายใน 1 สัปดาห์, `FB : SCIstudentPSU` ภายใน 2 สัปดาห์) และลิงก์ระบบหลังบ้านในส่วน Footer
- 🛠️ **Admin Backend (`/admin`)**: แดชบอร์ดหลังบ้านป้องกันด้วยรหัสผ่านสำหรับเพิ่ม/แก้ไข/ลบ/จัดลำดับเว็บไซต์บริการ รายชื่อคณะกรรมการ ข้อมูลหน้าเว็บ ช่องทางติดต่อ การอัปโหลดรูปภาพ และการเปลี่ยนรหัสผ่านผู้ดูแลระบบ

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling & Icons**: Tailwind CSS + Lucide React
- **Persistence**: Local JSON Storage (`data/hub-data.json`, auto-seeded from `src/lib/seed-data.ts` on first run)

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/sunkinincode/samosciHub.git
cd samosciHub

# Install dependencies
npm install

# Start local development server
npm run dev
# เปิดเบราว์เซอร์ไปที่ http://localhost:3000

# Lint and build for production
npm run lint
npm run build
npm run start
```

> **หมายเหตุ (Admin & Environment)**:
> - ในการใช้งานครั้งแรก ไฟล์ฐานข้อมูล `data/hub-data.json` จะถูกสร้างขึ้นอัตโนมัติจาก `src/lib/seed-data.ts`
> - คุณสามารถกำหนด `ADMIN_SESSION_SECRET` ในไฟล์ `.env.local` เมื่อนำไป Deploy จริง และเข้าจัดการเนื้อหาได้ที่ `/admin` (ลิงก์อยู่ใน Footer ของสไลด์ `06`) โดยแนะนำให้เปลี่ยนรหัสผ่านในแท็บ Security ทันทีหลังติดตั้ง

---

## 📄 License

MIT License © 2026 [sunkinincode](https://github.com/sunkinincode)
