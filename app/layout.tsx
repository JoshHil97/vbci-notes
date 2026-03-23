import "./globals.css";
import Navbar from "./components/Navbar";
import VerseCarousel from "./components/VerseCarousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oil for the Journey",
  description: "Scripture, reflection, and teaching for the journey of faith",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <VerseCarousel />
      </body>
    </html>
  );
}
