"use strict";

const Newsletter = require("../models/Newsletter.model");

class NewsletterRepository {
  async upsert(email, data) {
    return Newsletter.findOneAndUpdate({ email }, data, { upsert: true, new: true });
  }

  async findByEmail(email) {
    return Newsletter.findOne({ email });
  }

  async findAll({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 100 }) {
    const [data, total] = await Promise.all([
      Newsletter.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Newsletter.countDocuments(filter),
    ]);
    return { data, total };
  }

  async count() {
    return Newsletter.countDocuments({ isActive: true });
  }

  async unsubscribe(email) {
    return Newsletter.findOneAndUpdate(
      { email },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new NewsletterRepository();
