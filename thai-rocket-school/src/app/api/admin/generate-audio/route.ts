import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { synthesizeThai, ttsConfigured } from "@/lib/tts";
import { extractThaiTexts } from "@/lib/audio";
import { checkAdminSecret, page } from "@/lib/admin-auth";
import type { ContentBlock } from "@/types/content";

export const maxDuration = 60;

// Generates native-quality Thai pronunciation clips for every phrase used
// across all lessons (vocab, dialogue, speaking prompts, tracing
// characters), uploads them to Vercel Blob storage, and records them in the
// VoiceClip table. Processes a small batch per request to stay within
// serverless time limits, then auto-refreshes itself until everything is
// done — just leave the page open.
//
// Usage: https://<your-app>/api/admin/generate-audio?secret=<ADMIN_SECRET>

const BATCH_SIZE = 8;

function blobPathFor(text: string): string {
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 20);
  return `audio/thai-${hash}.mp3`;
}

export async function GET(req: Request) {
  const denied = checkAdminSecret(req, "generate-audio");
  if (denied) return denied;

  if (!ttsConfigured()) {
    return new NextResponse(
      page("Not configured", "GOOGLE_TTS_API_KEY is not set. Add it in Vercel → Settings → Environment Variables (Google Cloud Console → enable the Text-to-Speech API → create an API key), then redeploy.", false),
      { status: 503, headers: { "Content-Type": "text/html" } },
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse(
      page("Not configured", "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel → Storage → Create Database → Blob, connect it to this project, then redeploy.", false),
      { status: 503, headers: { "Content-Type": "text/html" } },
    );
  }

  const lessons = await prisma.lesson.findMany({ select: { content: true } });
  const allTexts = extractThaiTexts(lessons.flatMap((l) => l.content as unknown as ContentBlock[]));

  const existing = await prisma.voiceClip.findMany({
    where: { text: { in: allTexts } },
    select: { text: true },
  });
  const existingSet = new Set(existing.map((r) => r.text));
  const remaining = allTexts.filter((t) => !existingSet.has(t));

  const total = allTexts.length;
  const doneBefore = total - remaining.length;

  if (remaining.length === 0) {
    return new NextResponse(
      page("All done ✔", `All ${total} Thai phrases already have generated pronunciation audio. Nothing left to do.`, true),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }

  const batch = remaining.slice(0, BATCH_SIZE);
  const errors: { text: string; error: string }[] = [];
  let succeeded = 0;

  for (const text of batch) {
    try {
      const audio = await synthesizeThai(text);
      const blob = await put(blobPathFor(text), audio, {
        access: "public",
        contentType: "audio/mpeg",
        addRandomSuffix: false,
      });
      await prisma.voiceClip.upsert({
        where: { text },
        update: { url: blob.url },
        create: { text, url: blob.url },
      });
      succeeded++;
    } catch (err) {
      errors.push({ text, error: err instanceof Error ? err.message : String(err) });
    }
  }

  const doneAfter = doneBefore + succeeded;
  const stillRemaining = total - doneAfter;

  if (errors.length > 0) {
    return new NextResponse(
      page(
        "Batch finished with errors",
        `Progress: ${doneAfter}/${total} phrases done. ${succeeded} generated in this batch, ${errors.length} failed:<ul>${errors
          .map((e) => `<li><strong>${e.text}</strong> — ${e.error}</li>`)
          .join("")}</ul>Fix the underlying issue (check the error above — often an API key or quota problem) then reload this same URL to retry the failed ones.`,
        false,
      ),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }

  if (stillRemaining === 0) {
    return new NextResponse(
      page("All done ✔", `All ${total} Thai phrases now have generated pronunciation audio.`, true),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }

  // Auto-refresh to process the next batch — keep this page open, no need to tap anything.
  const nextUrl = req.url;
  return new NextResponse(
    page(
      "Generating…",
      `Progress: ${doneAfter}/${total} phrases done. This page will automatically continue in 1 second — leave it open. (${stillRemaining} remaining)`,
      true,
      `<meta http-equiv="refresh" content="1;url=${nextUrl}">`,
    ),
    { status: 200, headers: { "Content-Type": "text/html" } },
  );
}
