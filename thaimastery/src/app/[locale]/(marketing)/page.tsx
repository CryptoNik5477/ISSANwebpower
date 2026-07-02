import { setRequestLocale, getTranslations } from "next-intl/server";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Method } from "@/components/landing/method";
import { Roadmap } from "@/components/landing/roadmap";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { PRICING_PLANS } from "@/config/pricing";
import { site } from "@/config/site";
import { siteUrl } from "@/lib/utils";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "hero" });

  // Structured data for Google (Course + Product offers).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: siteUrl(),
        description: site.description,
      },
      {
        "@type": "Course",
        name: t("title"),
        description: t("subtitle"),
        provider: { "@type": "Organization", name: site.name, sameAs: siteUrl() },
        offers: PRICING_PLANS.map((p) => ({
          "@type": "Offer",
          price: (p.amount / 100).toFixed(2),
          priceCurrency: "EUR",
          category: p.key,
        })),
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT20M",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Method />
        <Roadmap />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
