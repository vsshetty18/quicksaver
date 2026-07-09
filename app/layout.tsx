import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ------------------------------------------------------------
// Root Layout
// Wraps every page with a shared Navbar and Footer.
// ------------------------------------------------------------

export const metadata: Metadata = {
  title: "AI Vehicle Speed Detection & Accident Prediction",
  description:
    "A BE AI & ML major project that detects vehicle speed from video footage and predicts accident risk using Machine Learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f5f7fb]">
        <Navbar />
        {/* Main content area grows to push footer to bottom */}
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
