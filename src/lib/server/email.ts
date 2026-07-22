import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    pool: true,
    maxConnections: 5,
    rateDelta: 1000,
    rateLimit: 5,
  });
  transporter.verify().then(
    () => console.info("SMTP transporter ready"),
    (err) => console.warn("SMTP verify failed:", err.message)
  );
  return transporter;
}

function loadTemplate(name: string) {
  const filePath = path.join(process.cwd(), "src", "lib", "server", "emails", "templates", `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
}

function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ""));
}

async function sendEmail({
  to,
  subject,
  templateName,
  vars,
}: {
  to: string;
  subject: string;
  templateName: string;
  vars: Record<string, string | number>;
}) {
  try {
    const template = loadTemplate(templateName);
    const html = interpolate(template, vars);
    await getTransporter().sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.warn("Email send failed (non-fatal):", err);
  }
}

export function sendEnquiryReceived(enquiry: { name: string; email: string; destination?: string }) {
  return sendEmail({
    to: enquiry.email,
    subject: "We received your enquiry — Urban Cruise",
    templateName: "enquiry-received",
    vars: {
      name: enquiry.name,
      destination: enquiry.destination || "your chosen destination",
      phone: "+91 92609 94765",
    },
  });
}

export function sendNewsletterConfirmation(email: string, name?: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Urban Cruise Updates!",
    templateName: "newsletter-confirm",
    vars: { name: name || "Traveller", email },
  });
}

export function sendPasswordReset(email: string, resetLink: string) {
  return sendEmail({
    to: email,
    subject: "Password Reset — Urban Cruise Admin",
    templateName: "password-reset",
    vars: { resetLink },
  });
}
