import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; // Import both
import "./globals.css";

// Configure the fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair", // This creates a CSS variable we can use
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Imena Paper Pop",
  description: "Luxury Family Invitations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body */}
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}