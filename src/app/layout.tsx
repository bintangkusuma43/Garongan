import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | RT 01 Dusun Garongan",
    default: "RT 01 Dusun Garongan - Wonokerto, Turi, Sleman",
  },
  description: "Website resmi profil, potensi wisata & pertanian, galeri kegiatan, dan mitigasi jalur evakuasi di RT 01 Dusun Garongan, Wonokerto, Turi, Sleman, Yogyakarta.",
  keywords: ["RT 01 Garongan", "Garongan Turi Sleman", "Desa Wisata Garongan", "Jaka Garong", "KWT Garongan", "Mitigasi Sleman"],
  authors: [{ name: "RT 01 Garongan Administration" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
