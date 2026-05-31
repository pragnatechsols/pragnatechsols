import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pragna Techsols | MEPF Consultancy & Engineering Services",
  description: "Your trusted partner for comprehensive MEPF Consultancy and Engineering Services for Domestic, Commercial & Industrial projects in Vijayawada, Andhra Pradesh.",
  keywords: "MEPF, Electrical, HVAC, Plumbing, Fire Safety, Solar, CCTV, Vijayawada, Engineering Services, Contractor",
  authors: [{ name: "Pragna Techsols" }],
  openGraph: {
    title: "Pragna Techsols | MEPF Consultancy & Engineering Services",
    description: "Your trusted partner for comprehensive MEPF Consultancy and Engineering Services.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 font-sans">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
