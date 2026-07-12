import nodemailer from "nodemailer";

/**
 * Central email helper.
 *
 * Reads SMTP settings from environment variables so the same code works with
 * GoDaddy, Microsoft 365, Gmail, or any SMTP provider without code changes:
 *
 *   SMTP_HOST   e.g. smtpout.secureserver.net  (GoDaddy)  or  smtp.office365.com
 *   SMTP_PORT   465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER   book@alitaxisnorwich.com
 *   SMTP_PASS   the mailbox password
 *   SMTP_FROM   "AliTaxis Norwich <book@alitaxisnorwich.com>"  (defaults to SMTP_USER)
 *   CONTACT_TO  where owner notifications are delivered (defaults to SMTP_USER)
 *
 * If SMTP is not configured, sendMail() logs a warning and resolves without
 * throwing, so the site keeps working (form/booking still saves to the DB).
 */

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  CONTACT_TO,
} = process.env;

export const OWNER_EMAIL = CONTACT_TO || SMTP_USER || "";
const FROM = SMTP_FROM || SMTP_USER || "";

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!isConfigured) return null;
  if (cachedTransporter) return cachedTransporter;

  const port = Number(SMTP_PORT) || 587;
  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransporter;
}

/** Returns non-secret info about the current SMTP configuration. */
export function mailStatus() {
  const maskedUser = SMTP_USER ? SMTP_USER.replace(/(.{2}).*(@.*)/, "$1***$2") : null;
  return {
    configured: isConfigured,
    host: SMTP_HOST ?? null,
    port: SMTP_PORT ?? null,
    user: maskedUser,
    from: FROM || null,
    contactTo: OWNER_EMAIL || null,
    hasPassword: Boolean(SMTP_PASS),
  };
}

/** Verifies the SMTP connection/credentials without sending mail. */
export async function verifyMail(): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, error: "SMTP not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS)" };
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Sends an email. Never throws — returns true on success, false otherwise. */
export async function sendMail({ to, subject, html, replyTo }: MailOptions): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter || !to) {
    if (!isConfigured) {
      console.warn("[mail] SMTP not configured — skipping email to", to);
    }
    return false;
  }

  try {
    await transporter.sendMail({ from: FROM, to, subject, html, replyTo });
    return true;
  } catch (err) {
    console.error("[mail] Failed to send email:", err);
    return false;
  }
}

/** Wraps content in a simple branded HTML shell. */
export function emailLayout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:#111827;color:#eab308;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:700;">
        AliTaxis Norwich
      </div>
      <div style="background:#ffffff;padding:24px;border-radius:0 0 12px 12px;line-height:1.6;">
        <h2 style="margin:0 0 16px;font-size:18px;">${title}</h2>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
        AliTaxis Norwich &middot; Norwich, UK
      </p>
    </div>
  </body>
</html>`;
}
