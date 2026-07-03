import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lt, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { Award, FileDown } from "lucide-react";

export default async function CertificatesPage() {
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const [t, locale] = await Promise.all([getTranslations("certificates"), getLocale()]);

  const certs = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-night-300">{t("subtitle")}</p>

      <div className="mt-8 space-y-4">
        {certs.length === 0 && (
          <Card className="p-10 text-center">
            <Award className="mx-auto h-12 w-12 text-night-600" />
            <p className="mt-4 text-night-300">{t("empty")}</p>
            <p className="mt-1 text-xs text-night-500">{t("progressHint")}</p>
          </Card>
        )}
        {certs.map((cert) => (
          <Card key={cert.id} className="flex flex-wrap items-center gap-4 border-gold-400/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-night-950">
              <Award className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display font-semibold text-white">{lt(cert.course.title, locale)}</h2>
              <p className="text-xs text-night-400">
                {t("issued", { date: formatDate(cert.issuedAt, locale) })} · {t("serial")}: {cert.serial}
              </p>
            </div>
            <a href={`/api/certificates/${cert.id}/pdf`} className={buttonStyles("primary", "px-4 py-2 text-xs")}>
              <FileDown className="h-4 w-4" /> {t("download")}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
