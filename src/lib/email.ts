import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? 'NISMPracticeTests <noreply@nismpracticetests.com>';

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendMagicLink(to: string, url: string) {
  if (!resend) {
    // Dev fallback: log the link to the server console instead of failing.
    // This lets you exercise the auth flow before configuring Resend.
    console.warn('[email] RESEND_API_KEY not set — printing magic link instead.');
    console.log(`[magic-link] ${to}: ${url}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Your NISMPracticeTests sign-in link',
    text:
      `Click this link to sign in. It expires in 15 minutes and can only be used once.\n\n${url}\n\n` +
      `If you didn't request this, you can ignore this email.`,
  });
}
