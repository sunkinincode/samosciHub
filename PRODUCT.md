# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router, TypeScript, Tailwind CSS) with persistent JSON database (`data/hub-data.json`) and local upload storage (`public/uploads/`).

## Users

- **Primary Users:** Undergraduate students at the Faculty of Science, Prince of Songkla University (PSU Hat Yai), including freshmen to seniors (`SCI PSU XX`), looking for student union services, committee contacts, and official support channels.
- **Secondary Users:** SAMO SCI 69 Student Union committee administrators managing service links, member profiles, and contact channels via `/admin`.

## Product Purpose

Central digital hub for **สโมสรนักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ (SAMO SCI PSU / SAMO SCI 69)** presenting who the student union is, what it does, its committee members with clickable detail & contact modals, club service websites manageable via an admin backend, and official response-SLA-ordered contact channels (`LINE : SCI PSU XX`, `IG : samosci.psu_official`, `FB : SCIstudentPSU`).

## Positioning

A clean, slide-like architectural showcase and unified digital gateway tailored specifically for Faculty of Science PSU students (anchored around ตึกฟักทอง, ลานแปดเหลี่ยม, and อาคาร BSc), connecting every batch (`SCI PSU XX`) and every student union service in one place.

## Capabilities and Constraints

- Full-screen `SAMO SCI 69` logo zoom-and-fade entrance leading cleanly into Slide 01.
- Navbar contains only section navigation links (Admin backend link lives strictly in the Footer).
- Clickable member portraits open a modal with role bio, quote, and personal contact links (LINE, IG, FB, Email).
- Admin backend (`/admin`) manages service websites (with local image upload and URL support), committee members, site copy, LINE `SCI PSU XX` batches, and admin password.
- Contact channels strictly display response SLAs: LINE `SCI PSU XX` (ส่วนใหญ่ตอบทันที หรือภายใน 1 ชั่วโมง), IG `samosci.psu_official` (ภายใน 1 สัปดาห์), FB `SCIstudentPSU` (ภายใน 2 สัปดาห์).

## Brand Commitments

- **Logo Assets:** `logo-final-notext-white.svg`, `logo-final-notext.svg`, `logo-final-text-white.svg`, `logo-final-text.svg` (featuring the SAMO SCI 69 emblem).
- **Architectural Wireframes:** `Architectural Octagonal Plaza Blueprint.png`, `Blueprint Dome Pavilion Wireframe.png`, `Modern Architectural Complex Wireframe.png`.
- **Palette:** Deep Navy-Black (`#080B11`), Deep Navy Surface (`#0D131F`), Signal Yellow (`#FFE600`), and Warm Architectural Off-White (`#F4F4F0`).

## Evidence on Hand

- Original SVG logo files and PNG architectural wireframe drawings in workspace root and `public/assets/`.
- Representative SAMO SCI PSU Thai seed data in `src/lib/seed-data.ts`.
