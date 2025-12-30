const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  APP_URL,
} = require("../config");

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

function inviteTemplate(companyName, token) {
  const base = (APP_URL || "http://localhost:5173").replace(/\/$/, "");
  const acceptUrl = `${base}/accept-invite?token=${encodeURIComponent(token)}`;
  return `
  <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f6f7fb; padding:24px;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,0.06);">
      <div style="padding:24px; border-bottom:1px solid #f0f0f5;">
        <h1 style="margin:0; font-size:20px; color:#111827;">You're invited to ${companyName}</h1>
        <p style="margin-top:8px; font-size:14px; color:#6b7280;">Join the workspace and start collaborating.</p>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 16px; font-size:14px; color:#374151;">
          You've been invited to join <strong>${companyName}</strong> on MeterOps.
        </p>
        <a href="${acceptUrl}" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:8px; font-weight:600;">
          Accept Invitation
        </a>
        <p style="margin:16px 0 0; font-size:12px; color:#6b7280;">
          This invitation expires in 24 hours.
        </p>
      </div>
      <div style="padding:16px 24px; border-top:1px solid #f0f0f5; text-align:center;">
        <p style="margin:0; font-size:12px; color:#9ca3af;">MeterOps • Modern SaaS metering & billing</p>
      </div>
    </div>
  </div>
  `;
}

let verified = false;
async function ensureVerified(tx) {
  if (verified) return;
  await tx.verify();
  verified = true;
}

async function sendMail({ to, subject, html }) {
  const tx = getTransporter();
  await ensureVerified(tx);
  const info = await tx.sendMail({
    from: `"MeterOps" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });
  return info;
}

async function sendInviteEmail({ to, companyName, token }) {
  const html = inviteTemplate(companyName, token);
  return await sendMail({
    to,
    subject: `Invitation to join ${companyName} on MeterOps`,
    html,
  });
}

module.exports = {
  sendMail,
  sendInviteEmail,
};
