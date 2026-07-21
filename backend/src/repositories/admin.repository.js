"use strict";

const Admin = require("../models/Admin.model");

class AdminRepository {
  async findById(id, includeSecrets = false) {
    const q = Admin.findById(id);
    if (includeSecrets) q.select("+password +refreshTokens +passwordResetToken +passwordResetExpires");
    return q.exec();
  }

  async findByEmail(email, includePassword = false) {
    const q = Admin.findOne({ email: email.toLowerCase() });
    if (includePassword) q.select("+password +refreshTokens");
    return q.exec();
  }

  async create(data) {
    return Admin.create(data);
  }

  async update(id, data) {
    return Admin.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findAll({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) {
    const [data, total] = await Promise.all([
      Admin.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Admin.countDocuments(filter),
    ]);
    return { data, total };
  }

  async delete(id) {
    return Admin.findByIdAndDelete(id);
  }

  async pushRefreshToken(id, token) {
    return Admin.findByIdAndUpdate(id, { $push: { refreshTokens: token } });
  }

  async removeRefreshToken(id, token) {
    return Admin.findByIdAndUpdate(id, { $pull: { refreshTokens: token } });
  }

  async clearRefreshTokens(id) {
    return Admin.findByIdAndUpdate(id, { $set: { refreshTokens: [] } });
  }
}

module.exports = new AdminRepository();
