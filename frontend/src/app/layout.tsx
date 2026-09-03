import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nicosia Fertility Centre",
    default: "Nicosia Fertility Centre | Where Science Meets Hope",
  },
  description:
    "A leading fertility clinic in Nicosia, Cyprus, offering IVF, egg donation, PGT-A, and personalised fertility care for patients from around the world.",
  keywords: ["IVF", "fertility clinic", "Nicosia", "Cyprus", "egg donation", "ICSI", "PGT"],
  openGraph: {
    title: "Nicosia Fertility Centre",
    description: "Where Science Meets Hope. Advanced fertility treatment in Cyprus.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
