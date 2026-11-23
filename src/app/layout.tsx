import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-thai",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAMO SCI 69 | สโมสรนักศึกษาคณะวิทยาศาสตร์ ม.อ.",
  description:
    "Hub ศูนย์กลางสโมสรนักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยสงขลานครินทร์ — รู้จักพวกเรา คณะกรรมการ เว็บไซต์บริการนักศึกษา และช่องทางติดต่ออย่างเป็นทางการ",
  icons: {
    icon: "/assets/logo-notext-white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexThai.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#080B11] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
