import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indica-regente-indaia.vercel.app"),
  title: "Indica Jd.Regente • Indaiatuba | Guia de Recomendações e Serviços",
  description:
    "Encontre os melhores profissionais e serviços recomendados pela comunidade no Jardim Regente e Indaiatuba com WhatsApp direto.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [
      { url: "/logo.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Indica Jd.Regente • Indaiatuba | Guia de Recomendações",
    description:
      "Encontre e recomende profissionais e serviços de confiança no Jardim Regente e Indaiatuba com WhatsApp direto.",
    url: "https://indica-regente-indaia.vercel.app",
    siteName: "Indica Jd.Regente",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indica Jd.Regente - Guia de Serviços de Indaiatuba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indica Jd.Regente • Indaiatuba",
    description:
      "Guia comunitário de serviços e profissionais recomendados no Jd. Regente com WhatsApp direto.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Indica Jd.Regente",
  },
  applicationName: "Indica Jd.Regente - Indaiatuba",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta property="og:image" content="https://indica-regente-indaia.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans select-none sm:select-auto">
        {children}

        {/* Registro do Service Worker PWA no navegador */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
