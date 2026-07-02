import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white">Terms of Service</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-night-300">
          <p>
            By creating a ThaiMastery account you agree to these terms. The free tier gives access to the first level of
            each course; paid plans (monthly, yearly, lifetime) unlock the full curriculum, AI practice and certificates.
          </p>
          <p>
            Subscriptions renew automatically until cancelled from your settings. All purchases include a 14-day
            money-back guarantee — email <a href="mailto:support@thaimastery.app" className="text-gold-400">support@thaimastery.app</a>.
          </p>
          <p>
            Course content is licensed for personal use only and may not be redistributed. Certificates attest completion
            of the ThaiMastery curriculum and are not accredited language qualifications.
          </p>
          <p>
            We may update these terms; material changes will be announced by email at least 14 days in advance.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
