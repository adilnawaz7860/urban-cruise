"use strict";

const newsletterRepo = require("../repositories/newsletter.repository");
const { sendNewsletterConfirmation } = require("./email.service");
const { parsePagination } = require("../utils/pagination");
const ApiError = require("../utils/ApiError");

async function subscribe(email, name) {
  const existing = await newsletterRepo.findByEmail(email);
  if (existing && existing.isActive) {
    throw ApiError.conflict("This email is already subscribed");
  }

  const subscriber = await newsletterRepo.upsert(email, {
    email,
    name,
    isActive: true,
    confirmedAt: new Date(),
  });

  await sendNewsletterConfirmation(email, name);
  return subscriber;
}

async function unsubscribe(email) {
  const subscriber = await newsletterRepo.findByEmail(email);
  if (!subscriber) throw ApiError.notFound("Subscriber not found");
  return newsletterRepo.unsubscribe(email);
}

async function getAll(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = {};
  if (query.active !== undefined) filter.isActive = query.active === "true";
  const { data, total } = await newsletterRepo.findAll({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

module.exports = { subscribe, unsubscribe, getAll };
