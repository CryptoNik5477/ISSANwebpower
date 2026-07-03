import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { inputStyles } from "@/components/auth/auth-card";
import { buttonStyles } from "@/components/ui/button";
import { Trash2, Video, Music, Image as ImageIcon, FileText } from "lucide-react";

const icons = { video: Video, audio: Music, image: ImageIcon, pdf: FileText } as const;

export default async function AdminMediaPage() {
  const me = await currentUser();
  if (!me || me.role !== "ADMIN") redirect("/en/dashboard");
  const t = await getTranslations("admin");

  const media = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });

  async function addMedia(formData: FormData) {
    "use server";
    await requireAdmin();
    const url = String(formData.get("url") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const kind = String(formData.get("kind") ?? "video");
    if (!url.startsWith("https://") || !title) return;
    await prisma.mediaAsset.create({ data: { url, title, kind } });
    revalidatePath("/", "layout");
  }

  async function deleteMedia(formData: FormData) {
    "use server";
    await requireAdmin();
    await prisma.mediaAsset.delete({ where: { id: String(formData.get("id")) } });
    revalidatePath("/", "layout");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold text-white">{t("manageMedia")}</h1>

      <Card>
        <form action={addMedia} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input name="title" required placeholder={t("mediaTitle")} className={inputStyles} />
          <input name="url" required type="url" placeholder={`${t("mediaUrl")} (https://…)`} className={inputStyles} />
          <select name="kind" className={inputStyles}>
            <option value="video">video</option>
            <option value="audio">audio</option>
            <option value="image">image</option>
            <option value="pdf">pdf</option>
          </select>
          <button type="submit" className={buttonStyles("primary")}>
            {t("addMedia")}
          </button>
        </form>
        <p className="mt-3 text-xs text-night-500">
          Upload files to your storage bucket (Vercel Blob / S3), then register the public URL here and reference it
          from lesson content blocks: {"{ \"type\": \"video\", \"url\": \"…\" }"}
        </p>
      </Card>

      <Card className="!p-0">
        <ul>
          {media.map((m) => {
            const Icon = icons[m.kind as keyof typeof icons] ?? FileText;
            return (
              <li key={m.id} className="flex items-center gap-3 border-b border-white/5 px-5 py-3 last:border-0">
                <Icon className="h-5 w-5 shrink-0 text-gold-400" />
                <span className="text-sm text-white">{m.title}</span>
                <Badge tone="night">{m.kind}</Badge>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-xs text-night-400 hover:text-white">
                  {m.url}
                </a>
                <form action={deleteMedia}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="rounded-lg p-1.5 text-red-400 hover:bg-white/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </li>
            );
          })}
          {media.length === 0 && <li className="px-5 py-8 text-center text-sm text-night-400">—</li>}
        </ul>
      </Card>
    </div>
  );
}
