"use strict";

const enquiryService = require("../services/enquiry.service");
const { sendCsv } = require("../utils/csvExport");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC — submit enquiry
const create = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);
  ApiResponse.created(res, enquiry, "Enquiry submitted. We will contact you shortly.");
});

// PUBLIC — submit contact form
const createContact = asyncHandler(async (req, res) => {
  const contact = await enquiryService.createContact(req.body, req.ip);
  ApiResponse.created(res, contact, "Message sent. We will get back to you soon.");
});

// ADMIN — enquiries
const getAll = asyncHandler(async (req, res) => {
  const result = await enquiryService.getAll(req.query);
  ApiResponse.paginated(res, result);
});

const getById = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.getById(req.params.id);
  ApiResponse.ok(res, enquiry);
});

const updateStatus = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.updateStatus(req.params.id, req.body);
  ApiResponse.ok(res, enquiry, "Enquiry updated");
});

const remove = asyncHandler(async (req, res) => {
  await enquiryService.remove(req.params.id);
  ApiResponse.ok(res, null, "Enquiry deleted");
});

const exportCsv = asyncHandler(async (req, res) => {
  const { data } = await enquiryService.getAll({ ...req.query, limit: 10000 });
  const rows = data.map((e) => ({
    name: e.name,
    email: e.email,
    phone: e.phone || "",
    destination: e.destination || "",
    message: e.message,
    status: e.status,
    createdAt: new Date(e.createdAt).toLocaleDateString("en-IN"),
  }));
  await sendCsv(res, rows, `enquiries-${Date.now()}`);
});

// ADMIN — contact messages
const getAllContacts = asyncHandler(async (req, res) => {
  const result = await enquiryService.getAllContacts(req.query);
  ApiResponse.paginated(res, result);
});

const markContactRead = asyncHandler(async (req, res) => {
  const contact = await enquiryService.markContactRead(req.params.id);
  ApiResponse.ok(res, contact, "Marked as read");
});

module.exports = {
  create, createContact, getAll, getById,
  updateStatus, remove, exportCsv,
  getAllContacts, markContactRead,
};
