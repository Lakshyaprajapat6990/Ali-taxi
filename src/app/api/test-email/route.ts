import { NextRequest, NextResponse } from "next/server";
import { mailStatus, verifyMail, sendMail, emailLayout, OWNER_EMAIL } from "@/lib/mail";

// Diagnostic endpoint — protected by ADMIN_SETUP_SECRET.
//
// Usage:
//   GET  /api/test-email?secret=YOUR_SECRET            -> shows config + verifies connection
//   GET  /api/test-email?secret=YOUR_SECRET&to=you@x   -> also sends a test email to `to`
export async function GET(req: NextRequest) {
  const setupSecret = process.env.ADMIN_SETUP_SECRET ?? "alitaxis-admin-setup-2024";
  const { searchParams } = new URL(req.url);

  if (searchParams.get("secret") !== setupSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const status = mailStatus();
  const verify = await verifyMail();

  let sent: { ok: boolean; error?: string } | null = null;
  const to = searchParams.get("to") || OWNER_EMAIL;
  if (searchParams.get("to") !== null || OWNER_EMAIL) {
    const ok = await sendMail({
      to,
      subject: "AliTaxis test email ✅",
      html: emailLayout("Test email", "<p>If you can read this, your website email is working correctly.</p>"),
    });
    sent = { ok, ...(ok ? {} : { error: "sendMail returned false — see server logs / verify result" }) };
  }

  return NextResponse.json({ status, verify, sentTo: to, sent });
}
