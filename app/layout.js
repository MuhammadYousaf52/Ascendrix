import { Poppins, Merriweather } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/app/components/SmoothScroll";
import Gradient from "@/app/components/Gradientuse";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: "900"
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL('https://www.ascendrix.co'),
  title: {
    default: 'Ascendrix | Amazon PPC & Profit Growth Agency',
    template: '%s | Ascendrix',
  },
  description:
    "Increase your Amazon brand's net profit by 30% in 82 days with the Profit Protocol System™. Expert Amazon PPC management, DSP advertising, listing optimization & brand strategy. No retainers. Cancel anytime.",
  keywords: [
    'Amazon PPC agency',
    'Amazon advertising management',
    'Amazon profit growth',
    'Profit Protocol System',
    'Amazon DSP management',
    'Amazon listing optimization',
    'reduce ACoS',
    'Amazon brand strategy',
    'Amazon seller agency',
    'ecommerce growth agency',
  ],
  authors: [{ name: 'Ascendrix', url: 'https://www.ascendrix.co' }],
  creator: 'Ascendrix',
  publisher: 'Ascendrix',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ascendrix.co',
    siteName: 'Ascendrix',
    title: 'Ascendrix | Amazon PPC & Profit Growth Agency',
    description:
      "Increase your Amazon brand's net profit by 30% in 82 days. Expert PPC management, DSP, listing optimization & brand strategy. No retainers.",
    images: [
      {
        url: '/Official_Logo.png',
        width: 1200,
        height: 630,
        alt: 'Ascendrix — Amazon Profit Growth Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ascendrix | Amazon PPC & Profit Growth Agency',
    description:
      "Increase your Amazon brand's net profit by 30% in 82 days with the Profit Protocol System™.",
    images: ['/Official_Logo.png'],
  },
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  alternates: {
    canonical: 'https://www.ascendrix.co',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ascendrix',
    url: 'https://www.ascendrix.co',
    logo: 'https://www.ascendrix.co/Official_Logo.png',
    description:
      "Amazon PPC management and profit growth agency. We increase Amazon brand net profit by 30% in 82 days using the Profit Protocol System™.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Queens Village',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-347-992-7860',
      email: 'ascendrixc@gmail.com',
      contactType: 'customer service',
    },
    sameAs: [
      'https://www.linkedin.com/company/ascendrix-co/',
      'https://www.instagram.com/ascendrix.co.usa/',
    ],
    serviceType: [
      'Amazon PPC Management',
      'Amazon DSP Management',
      'Amazon Listing Optimization',
      'Brand Strategy',
      'Product Launch',
    ],
  }

  return (
    <html lang="en" className={`${poppins.variable} ${merriweather.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Gradient />
        <SmoothScroll>{children}</SmoothScroll>
        <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
