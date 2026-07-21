import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappFloatingButton } from "@/components/layout/whatsapp-floating-button";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.urbancruiselko.com"),
  title: {
    default: "Urban Cruise | Travel Agent Lucknow | Tour Packages & Car Rental",
    template: "%s | Urban Cruise",
  },
  description:
    "Urban Cruise — Lucknow's trusted travel agency. Varanasi, Ayodhya, Prayagraj & pilgrimage tours. Clean cars, on-time service, affordable rates. Open 24 hours.",
  keywords: [
    "travel agent Lucknow",
    "Urban Cruise Lucknow",
    "Varanasi tour package",
    "Ayodhya Ram Mandir tour",
    "Prayagraj Sangam tour",
    "Naimisharanya tirth yatra",
    "Mathura Vrindavan tour",
    "car rental Lucknow",
    "pilgrimage tour UP",
    "Shimla trip from Lucknow",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Urban Cruise",
    title: "Urban Cruise | Travel Agent Lucknow",
    description:
      "Lucknow's trusted travel agency for pilgrimage tours, car rental and North India trips. Clean cars, knowledgeable drivers, 24/7 service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Cruise | Travel Agent Lucknow",
    description:
      "Lucknow's trusted travel agency for pilgrimage tours, car rental and North India trips. Clean cars, knowledgeable drivers, 24/7 service.",
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
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsappFloatingButton />
        </Providers>
      </body>
    </html>
  );
}
