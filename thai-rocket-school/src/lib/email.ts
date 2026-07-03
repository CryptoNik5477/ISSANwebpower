// Transactional email via the Resend HTTP API (no SDK dependency).
// When RESEND_API_KEY is missing (local dev, CI) emails are logged instead —
// every flow stays testable without external services.

import { siteUrl } from "./utils";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Thai Rocket School <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(`[email:dev] to=${to} subject="${subject}"`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    console.error(`[email] Resend error ${res.status}: ${await res.text()}`);
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

function layout(body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0d1220;font-family:Segoe UI,Arial,sans-serif;padding:32px 12px">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#141a2e;border-radius:16px;overflow:hidden">
    <tr><td style="padding:28px 32px 8px"><span style="font-size:22px;font-weight:800;color:#f4c430">Thai Rocket</span> <span style="font-size:22px;font-weight:800;color:#ffffff">School</span> <span style="font-size:20px">🚀</span></td></tr>
    <tr><td style="padding:8px 32px 32px;color:#c9d2e8;font-size:15px;line-height:1.6">${body}</td></tr>
    <tr><td style="padding:16px 32px;background:#0d1220;font-size:12px;color:#5b6680">© Thai Rocket School — Learn Thai in under 60 days.</td></tr>
  </table></body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${href}" style="background:#f4c430;color:#141a2e;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;display:inline-block">${label}</a></p>`;
}

export const emails = {
  welcome(to: string, name: string) {
    return sendEmail({
      to,
      subject: "Welcome to Thai Rocket School — your first lesson is ready 🇹🇭",
      html: layout(
        `<h2 style="color:#fff">Sawasdee, ${name}! 🙏</h2>
         <p>Your journey to fluent Thai starts today. Just 15–20 minutes a day and you'll be having real conversations in less than 60 days.</p>
         ${button(`${siteUrl()}/en/dashboard`, "Start Lesson 1")}`,
      ),
    });
  },
  verifyEmail(to: string, token: string) {
    const url = `${siteUrl()}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;
    return sendEmail({
      to,
      subject: "Confirm your Thai Rocket School email",
      html: layout(`<p>Please confirm your email address to activate your account.</p>${button(url, "Confirm email")}`),
    });
  },
  passwordReset(to: string, token: string) {
    const url = `${siteUrl()}/en/reset-password?token=${encodeURIComponent(token)}`;
    return sendEmail({
      to,
      subject: "Reset your Thai Rocket School password",
      html: layout(`<p>We received a request to reset your password. The link expires in 1 hour.</p>${button(url, "Choose a new password")}<p>If you didn't ask for this, you can safely ignore this email.</p>`),
    });
  },
  dailyReminder(to: string, name: string, streak: number) {
    return sendEmail({
      to,
      subject: `🔥 ${streak}-day streak — keep it alive, ${name}!`,
      html: layout(`<p>Your ${streak}-day streak is waiting. Today's lesson takes less than 20 minutes.</p>${button(`${siteUrl()}/en/dashboard`, "Practice now")}`),
    });
  },
  levelCompleted(to: string, name: string, levelTitle: string) {
    return sendEmail({
      to,
      subject: `🎉 Level completed: ${levelTitle}`,
      html: layout(`<p>Congratulations ${name} — you passed <strong>${levelTitle}</strong>! The next level is now unlocked.</p>${button(`${siteUrl()}/en/dashboard`, "Continue learning")}`),
    });
  },
  certificateEarned(to: string, name: string, courseTitle: string, certificateId: string) {
    return sendEmail({
      to,
      subject: `🏆 Your official ${courseTitle} certificate`,
      html: layout(`<p>Amazing work, ${name}! Your official certificate for <strong>${courseTitle}</strong> is ready to download and print.</p>${button(`${siteUrl()}/api/certificates/${certificateId}/pdf`, "Download certificate (PDF)")}`),
    });
  },
  paymentReceipt(to: string, name: string, planLabel: string, amountFormatted: string) {
    return sendEmail({
      to,
      subject: "Your Thai Rocket School receipt",
      html: layout(`<p>Thanks ${name}! Your payment for the <strong>${planLabel}</strong> plan (${amountFormatted}) was successful. Full access is now unlocked.</p>${button(`${siteUrl()}/en/dashboard`, "Go to my dashboard")}`),
    });
  },
  abandonedCart(to: string, name: string) {
    return sendEmail({
      to,
      subject: "Your Thai fluency plan is still waiting 🇹🇭",
      html: layout(`<p>Hi ${name}, you were one step away from unlocking the full Thai Rocket School program. Ready to speak Thai in 60 days?</p>${button(`${siteUrl()}/en/#pricing`, "Complete my enrollment")}`),
    });
  },
};
