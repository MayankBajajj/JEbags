import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[MAIL DEV MODE] to=${to} subject="${subject}"\n${html}`);
    return;
  }
  await t.sendMail({ from: process.env.SMTP_USER, to, subject, html });
}

export async function sendOtpEmail(to, code) {
  await sendMail({
    to,
    subject: "Your JE BAGS verification code",
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px">
        <h2 style="color:#0f1e36">JE BAGS</h2>
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:6px;color:#0f1e36">${code}</p>
        <p style="color:#6b6151;font-size:13px">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}
