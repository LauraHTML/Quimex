import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import {
  Cairo as V0_Font_Cairo,
  Crimson_Text as V0_Font_Crimson_Text,
} from "next/font/google";

// Inicializa as fontes
const _cairo = V0_Font_Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
const _crimsonText = V0_Font_Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
