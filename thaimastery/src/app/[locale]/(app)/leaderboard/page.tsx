import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Star } from "lucide-react";

export default async function LeaderboardPage() {
  const user = await currentUser();
  if (!user) redirect("/en/login");
  const t = await getTranslations("leaderboard");

  const top = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { xp: "desc" },
    take: 25,
    select: { id: true, name: true, xp: true, streak: true },
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-white">{t("title")}</h1>
      <p className="mt-1 text-night-300">{t("subtitle")}</p>

      <Card className="mt-8 !p-0">
        <ol>
          {top.map((u, i) => {
            const isMe = u.id === user.id;
            return (
              <li
                key={u.id}
                className={`flex items-center gap-4 border-b border-white/5 px-5 py-3.5 last:border-0 ${isMe ? "bg-gold-400/10" : ""}`}
              >
                <span className="w-8 text-center font-display font-bold text-night-300">
                  {medals[i] ?? i + 1}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-night-500 to-night-700 text-sm font-semibold text-white">
                  {(u.name ?? "?").charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 truncate text-sm text-white">
                  {u.name ?? "Anonymous"} {isMe && <Badge className="ml-2">{t("you")}</Badge>}
                </span>
                <span className="flex items-center gap-1 text-xs text-orange-400">
                  <Flame className="h-3.5 w-3.5" /> {u.streak}
                </span>
                <span className="flex w-20 items-center justify-end gap-1 text-sm font-semibold text-gold-300">
                  <Star className="h-3.5 w-3.5" /> {u.xp}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
