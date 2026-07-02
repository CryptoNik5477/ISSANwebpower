import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inputStyles } from "@/components/auth/auth-card";
import { buttonStyles } from "@/components/ui/button";
import { CopyButton } from "@/components/app/copy-button";
import { Link } from "@/i18n/navigation";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const t = await getTranslations("settings");
  const tc = await getTranslations("common");
  const ta = await getTranslations("auth");

  async function saveProfile(formData: FormData) {
    "use server";
    const me = await currentUser();
    if (!me) return;
    const name = String(formData.get("name") ?? "").slice(0, 80);
    const dailyGoal = Math.min(120, Math.max(5, Number(formData.get("dailyGoalMinutes")) || 15));
    const locale = String(formData.get("locale") ?? me.locale);
    await prisma.user.update({
      where: { id: me.id },
      data: {
        name: name || me.name,
        dailyGoalMinutes: dailyGoal,
        locale: ["en", "fr", "de"].includes(locale) ? locale : me.locale,
      },
    });
    revalidatePath("/", "layout");
  }

  const referralLink = `${siteUrl()}/en/register?ref=${user.referralCode}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">{t("profile")}</h2>
        <form action={saveProfile} className="space-y-4">
          <label className="block text-sm text-night-300">
            {ta("name")}
            <input name="name" defaultValue={user.name ?? ""} className={`${inputStyles} mt-1`} />
          </label>
          <label className="block text-sm text-night-300">
            {t("dailyGoalMinutes")}
            <input
              name="dailyGoalMinutes"
              type="number"
              min={5}
              max={120}
              defaultValue={user.dailyGoalMinutes}
              className={`${inputStyles} mt-1`}
            />
          </label>
          <label className="block text-sm text-night-300">
            {t("interfaceLanguage")}
            <select name="locale" defaultValue={user.locale} className={`${inputStyles} mt-1`}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
          <button type="submit" className={buttonStyles("primary")}>
            {tc("save")}
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">{t("subscription")}</h2>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-night-300">{t("currentPlan")}:</span>
          <Badge tone={user.plan === "FREE" ? "night" : "jade"}>{user.plan}</Badge>
          <Link href="/#pricing" className={buttonStyles("secondary", "px-4 py-2 text-xs")}>
            {user.plan === "FREE" ? t("upgradePlan") : t("managePlan")}
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 font-display text-lg font-semibold text-white">{t("referral")}</h2>
        <p className="mb-4 text-sm text-night-300">{t("referralHint")}</p>
        <div className="flex gap-2">
          <input readOnly value={referralLink} className={inputStyles} />
          <CopyButton value={referralLink} label={t("copyLink")} copiedLabel={t("copied")} />
        </div>
      </Card>
    </div>
  );
}
