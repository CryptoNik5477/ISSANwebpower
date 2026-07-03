import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");

  return (
    <footer className="border-t border-white/5 bg-night-950 px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-night-400">{t("tagline")}</p>
        </div>
        <nav aria-label={t("product")}>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("product")}</h3>
          <ul className="space-y-2 text-sm text-night-400">
            <li><a href="#features" className="hover:text-white">{tn("features")}</a></li>
            <li><a href="#pricing" className="hover:text-white">{tn("pricing")}</a></li>
            <li><a href="#faq" className="hover:text-white">{tn("faq")}</a></li>
            <li><Link href="/register" className="hover:text-white">{tn("signup")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("legal")}>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("legal")}</h3>
          <ul className="space-y-2 text-sm text-night-400">
            <li><Link href="/privacy" className="hover:text-white">{t("privacy")}</Link></li>
            <li><Link href="/terms" className="hover:text-white">{t("terms")}</Link></li>
            <li><a href="mailto:hello@thairocketschool.com" className="hover:text-white">{t("contact")}</a></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/5 pt-6 text-xs text-night-500">
        {t("copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
