import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.braille-box.com"),
  title: "BrailleBox | Adaptive Braille Learning for Students, Teachers, and Schools",
  description:
    "BrailleBox is a hardware and software system for Braille learning that helps visually impaired students practice Braille while giving teachers and schools clearer progress visibility.",
  keywords: [
    "BrailleBox",
    "Braille learning device",
    "assistive technology",
    "visually impaired students",
    "Braille education",
    "Teachers of the Visually Impaired",
    "TVI tools",
    "school accessibility",
    "Braille literacy",
  ],
  openGraph: {
    title: "BrailleBox",
    description:
      "A premium Braille learning system designed for students, teachers, and schools.",
    url: "https://www.braille-box.com",
    siteName: "BrailleBox",
    images: [
      {
        url: "/assets/device.jpg",
        width: 1400,
        height: 1100,
        alt: "BrailleBox device",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrailleBox",
    description:
      "Braille education, rethought for the modern classroom.",
    images: ["/assets/device.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
