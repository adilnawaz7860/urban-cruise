"use strict";

// Redis is disabled — all cache calls are no-ops. Drop-in replacement if Redis is added later.
const cache = {
  enabled: false,
  async get() { return null; },
  async set() {},
  async del() {},
  async delPattern() {},
};

module.exports = cache;
