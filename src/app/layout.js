import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import HeaderWrapper from "@/componentes/HeaderWrapper";
import FooterWrapper from "@/componentes/FooterWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.lexaero.com.br"),
  title: "Indenização por Voo Cancelado ou Atrasado | LexAero",
  description:
    "Teve problemas com voo ou bagagem? Você pode ter direito a compensação financeira. Resolvemos seu problema de forma 100% online com mais de 90% de sucesso. Avalie seu caso agora!",
  keywords: [
    "direito do passageiro aéreo",
    "voo atrasado indenização",
    "voo cancelado direitos",
    "advogado voo cancelado",
    "overbooking direitos passageiro",
    "bagagem extraviada indenização",
    "Kareline Staut advogada",
    "LexAero",
    "perda de conexão indenização",
    "assistência material voo",
    "direito consumidor aéreo",
  ],
  openGraph: {
    title: "Indenização por Voo Cancelado ou Atrasado | LexAero",
    description:
      "Teve problemas com voo ou bagagem? Você pode ter direito a compensação financeira. Resolvemos seu problema com agilidade. Avalie seu caso agora!",
    siteName: "LexAero",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "LexAero — Direito do Passageiro Aéreo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indenização por Voo Cancelado ou Atrasado | LexAero",
    description: "Teve problemas com voo ou bagagem? Você pode ter direito a compensação financeira. Avalie seu caso agora!",
    images: ["/twitter-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  other: {
    "geo.region": "BR-MG",
    "geo.placename": "Belo Horizonte, Minas Gerais, Brasil",
    "geo.position": "-19.9167;-43.9345",
    "ICBM": "-19.9167, -43.9345",
  },
  verification: {
    google: "-doLCMF_2ScmlRkNEcPgKomGYVPJoiMbfGifSzBJ9Y4",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Kareline Staut - Advocacia Especializada em Direito Aéreo",
              "url": "https://www.lexaero.com.br",
              "logo": "https://www.lexaero.com.br/logo_lexaero_dark.png",
              "image": "https://www.lexaero.com.br/opengraph-image.jpg",
              "description": "Boutique jurídica especializada em Direito do Passageiro Aéreo. Atuação 100% digital focada em indenizações por atraso e cancelamento de voos, extravio de bagagens e overbooking. OAB/RO 10.067.",
              "areaServed": "BR",
              "telephone": "+55-31-98325-9594",
              "email": "contato@lexaero.com.br",
              "priceRange": "Honorários ao êxito",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Belo Horizonte",
                "addressRegion": "MG",
                "addressCountry": "BR"
              },
              "founder": {
                "@type": "Person",
                "name": "Kareline Staut",
                "jobTitle": "Advogada Especialista",
                "knowsAbout": ["Direito do Consumidor", "Direito Aeronáutico", "Indenização Voo Cancelado"]
              }
            })
          }}
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-YE46K4H3J3"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YE46K4H3J3');
            `,
          }}
        />
      </head>
      <body>
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({pageLanguage: 'pt', includedLanguages: 'pt,en'}, 'google_translate_element');
              }
            `,
          }}
        />
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <HeaderWrapper />
        <main id="main-content">{children}</main>
        <FooterWrapper />

      </body>
    </html>
  );
}
