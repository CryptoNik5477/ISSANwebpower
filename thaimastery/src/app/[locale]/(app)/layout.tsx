import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { LocaleSwitcher } from "@/components/landing/locale-switcher";
import { SignOutButton } from "@/components/app/sign-out-button";
import { LayoutDashboard, GraduationCap, Award, Trophy, Settings, Shield } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [t, session] = await Promise.all([getTranslations("nav"), auth()]);
  const isAdmin = session?.user?.role === "ADMIN";

  const links = [
    { href: "/dashboard", label: t("dashboard"), Icon: LayoutDashboard },
    { href: "/courses", label: "Courses", Icon: GraduationCap },
    { href: "/certificates", label: "Certificates", Icon: Award },
    { href: "/leaderboard", label: "Leaderboard", Icon: Trophy },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-night-300 transition hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gold-400 transition hover:bg-gold-400/10">
                <Shield className="h-4 w-4" />
                {t("admin")}
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <SignOutButton label={t("logout")} />
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="flex justify-around border-t border-white/5 py-1 md:hidden">
          {links.map(({ href, Icon, label }) => (
            <Link key={href} href={href} aria-label={label} className="rounded-lg p-2.5 text-night-300 hover:text-white">
              <Icon className="h-5 w-5" />
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" aria-label="Admin" className="rounded-lg p-2.5 text-gold-400">
              <Shield className="h-5 w-5" />
            </Link>
          )}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pt-24">{children}</main>
    </div>
  );
}
