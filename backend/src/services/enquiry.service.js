"use strict";

const enquiryRepo = require("../repositories/enquiry.repository");
const { parsePagination, buildSearch } = require("../utils/pagination");
const { sendEnquiryReceived } = require("./email.service");
const ApiError = require("../utils/ApiError");

async function createEnquiry(data) {
  const enquiry = await enquiryRepo.create(data);
  await sendEnquiryReceived(enquiry);
  return enquiry;
}

async function getAll(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = {};
  if (query.status && query.status !== "all") filter.status = query.status;
  if (query.search) {
    const searchFilter = buildSearch(["name", "email", "destination"], query.search);
    Object.assign(filter, searchFilter);
  }
  const { data, total } = await enquiryRepo.findAll({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

async function getById(id) {
  const enquiry = await enquiryRepo.findById(id);
  if (!enquiry) throw ApiError.notFound("Enquiry not found");
  if (!enquiry.isRead) {
    await enquiryRepo.update(id, { isRead: true, readAt: new Date(), status: "read" });
  }
  return enquiry;
}

async function updateStatus(id, data) {
  const enquiry = await enquiryRepo.findById(id);
  if (!enquiry) throw ApiError.notFound("Enquiry not found");
  return enquiryRepo.update(id, data);
}

async function remove(id) {
  const enquiry = await enquiryRepo.findById(id);
  if (!enquiry) throw ApiError.notFound("Enquiry not found");
  return enquiryRepo.delete(id);
}

// Contact messages
async function createContact(data, ip) {
  return enquiryRepo.createContact({ ...data, ip });
}

async function getAllContacts(query) {
  const { page, limit, skip, sort } = parsePagination(query);
  const filter = {};
  if (query.isRead !== undefined) filter.isRead = query.isRead === "true";
  const { data, total } = await enquiryRepo.findAllContacts({ filter, sort, skip, limit });
  return { data, total, page, limit };
}

async function markContactRead(id) {
  return enquiryRepo.updateContact(id, { isRead: true, readAt: new Date() });
}

module.exports = {
  createEnquiry,
  getAll,
  getById,
  updateStatus,
  remove,
  createContact,
  getAllContacts,
  markContactRead,
};
