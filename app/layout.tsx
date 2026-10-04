import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { profile, seo, siteUrl } from "@/lib/content";
import "@/styles/globals.css";

const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  applicationName: "Naveen B — Portfolio",
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  keywords: [
    "Naveen B",
    "Generative AI Engineer",
    "Agentic AI",
    "Multi-agent systems",
    "Graph RAG",
    "MCP",
    "LangGraph",
    "Full-stack engineer",
    "Open source",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: seo.title,
    description: seo.description,
    siteName: "Naveen B",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: seo.description,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "VIT University" },
  worksFor: { "@type": "Organization", name: "Synapt" },
  knowsAbout: [
    "Generative AI",
    "Agentic AI",
    "Multi-agent systems",
    "RAG",
    "Graph RAG",
    "MCP",
    "Backend engineering",
    "Distributed systems",
  ],
  address: { "@type": "PostalAddress", addressCountry: "IN" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: browser extensions (Grammarly, ColorZilla, password managers…)
    // add attributes to <html>/<body> before React loads. It only ignores attribute
    // differences on these two elements, not on anything inside them.
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          // Static, server-authored JSON with no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
