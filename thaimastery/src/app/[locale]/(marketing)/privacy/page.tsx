import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-white">Privacy Policy</h1>
        <div className="prose prose-invert mt-8 space-y-4 text-sm leading-relaxed text-night-300">
          <p>
            ThaiMastery is committed to protecting your personal data in accordance with the GDPR. We collect only the
            data needed to provide the service: your name, email address, learning progress and — when you purchase a
            plan — billing information processed by Stripe (we never store card numbers).
          </p>
          <p>
            Your learning data (lessons completed, exam scores, streaks) is used exclusively to power your dashboard,
            certificates and reminders. We do not sell or share personal data with third parties for advertising.
          </p>
          <p>
            You can export or delete your account and all associated data at any time by contacting{" "}
            <a href="mailto:privacy@thaimastery.app" className="text-gold-400">privacy@thaimastery.app</a>. Transactional
            emails can be disabled from your settings; strictly necessary emails (receipts, password resets) are always sent.
          </p>
          <p>
            Cookies: we use a single session cookie for authentication and no third-party tracking cookies.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
