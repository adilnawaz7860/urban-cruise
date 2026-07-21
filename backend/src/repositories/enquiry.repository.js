"use strict";

const Enquiry = require("../models/Enquiry.model");
const Contact = require("../models/Contact.model");

class EnquiryRepository {
  async create(data) {
    return Enquiry.create(data);
  }

  async findById(id) {
    return Enquiry.findById(id).populate("package", "title destination");
  }

  async findAll({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Enquiry.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments(filter),
    ]);
    return { data, total };
  }

  async update(id, data) {
    return Enquiry.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Enquiry.findByIdAndDelete(id);
  }

  async countUnread() {
    return Enquiry.countDocuments({ isRead: false });
  }

  // Contact messages
  async createContact(data) {
    return Contact.create(data);
  }

  async findAllContacts({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) {
    const [data, total] = await Promise.all([
      Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter),
    ]);
    return { data, total };
  }

  async updateContact(id, data) {
    return Contact.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new EnquiryRepository();
