import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vāranāsi — Cinematic Format Experience",
  description:
    "Experience how Vāranāsi looks across IMAX 70MM, IMAX, 70MM, 35MM, Dolby Vision, and Large Format. A cinematic format experience.",
  openGraph: {
    title: "Vāranāsi — Cinematic Format Experience",
    description: "Experience the same footage across every cinematic format.",
    images: ["/hero-background.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
