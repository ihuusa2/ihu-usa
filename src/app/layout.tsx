import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ConditionalLayout from "@/components/ConditionalLayout";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda",
    template: "%s | International Hindu University"
  },
  description: "Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University (IHU-USA). Enroll in master's degree programs and certificate courses.",
  keywords: [
    "Vedic Studies",
    "Yoga",
    "Ayurveda", 
    "Hindu University",
    "Online Courses",
    "Spiritual Education",
    "Vedic Philosophy",
    "Yoga Teacher Training",
    "Ayurvedic Medicine",
    "Hindu Studies",
    "Religious Education",
    "Distance Learning"
  ],
  authors: [{ name: "International Hindu University" }],
  creator: "International Hindu University",
  publisher: "International Hindu University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ihu-usa.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ihu-usa.org',
    siteName: 'International Hindu University',
    title: 'International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda',
    description: 'Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy at International Hindu University (IHU-USA).',
    images: [
      {
        url: '/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'International Hindu University Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'International Hindu University (IHU-USA) - Vedic Studies, Yoga & Ayurveda',
    description: 'Discover comprehensive online courses in Vedic Studies, Yoga, Ayurveda, and Hindu philosophy.',
    images: ['/Images/logo.png'],
    creator: '@ihu_usa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'wG2eowZufP0q1_WDDC7woua7JAy1uawGjDU6_NbMnos',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-title" content="IHU" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JL84W1E20W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JL84W1E20W');
          `}
        </Script>
        
        <SessionProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
