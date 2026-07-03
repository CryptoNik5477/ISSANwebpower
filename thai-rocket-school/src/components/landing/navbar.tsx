import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { buttonStyles } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";

export async function Navbar() {
  const [t, session] = await Promise.all([getTranslations("nav"), auth()]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Thai Rocket School home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 text-sm text-night-200 md:flex">
          <a href="#features" className="transition hover:text-white">{t("features")}</a>
          <a href="#method" className="transition hover:text-white">{t("method")}</a>
          <a href="#pricing" className="transition hover:text-white">{t("pricing")}</a>
          <a href="#faq" className="transition hover:text-white">{t("faq")}</a>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {session?.user ? (
            <Link href="/dashboard" className={buttonStyles("primary", "px-4 py-2")}>
              {t("dashboard")}
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-night-200 transition hover:text-white sm:block">
                {t("login")}
              </Link>
              <Link href="/register" className={buttonStyles("primary", "px-4 py-2")}>
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
