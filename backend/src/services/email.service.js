"use strict";

const fs = require("fs");
const path = require("path");
const { getTransporter } = require("../config/email");
const logger = require("../utils/logger");

const TEMPLATES_DIR = path.join(__dirname, "../emails/templates");

function loadTemplate(name) {
  const filePath = path.join(TEMPLATES_DIR, `${name}.html`);
  return fs.readFileSync(filePath, "utf-8");
}

function interpolate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

async function sendEmail({ to, subject, templateName, vars }) {
  try {
    const transporter = getTransporter();
    const rawTemplate = loadTemplate(templateName);
    const html = interpolate(rawTemplate, vars);

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${subject} → ${to}`);
  } catch (err) {
    logger.error("Email send failed:", { to, subject, error: err.message });
    // Non-fatal — don't throw; log and move on
  }
}

async function sendBookingConfirmation(booking) {
  await sendEmail({
    to: booking.email,
    subject: `Booking Confirmed — ${booking.bookingId} | Urban Cruise`,
    templateName: "booking-confirmation",
    vars: {
      customerName: booking.customerName,
      bookingId: booking.bookingId,
      packageTitle: booking.package?.title || "Your Package",
      travelDate: new Date(booking.travelDate).toLocaleDateString("en-IN"),
      travelers: booking.travelers,
      totalAmount: `₹${booking.totalAmount.toLocaleString("en-IN")}`,
      phone: process.env.SMTP_USER || "+91 92609 94765",
    },
  });
}

async function sendEnquiryReceived(enquiry) {
  await sendEmail({
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

async function sendPasswordReset(email, resetLink) {
  await sendEmail({
    to: email,
    subject: "Password Reset — Urban Cruise Admin",
    templateName: "password-reset",
    vars: { resetLink },
  });
}

async function sendNewsletterConfirmation(email, name) {
  await sendEmail({
    to: email,
    subject: "Welcome to Urban Cruise Travel Updates!",
    templateName: "newsletter-confirm",
    vars: { name: name || "Traveller", email },
  });
}

module.exports = {
  sendBookingConfirmation,
  sendEnquiryReceived,
  sendPasswordReset,
  sendNewsletterConfirmation,
};
