"use strict";

const { json2csv } = require("json-2-csv");

/**
 * Streams a JSON array as a CSV download response.
 * @param {Response} res  - Express response object
 * @param {Array}    data - Array of plain objects
 * @param {string}   filename - Download filename (without .csv)
 */
async function sendCsv(res, data, filename = "export") {
  const csv = await json2csv(data, { emptyFieldValue: "" });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
  res.status(200).send(csv);
}

module.exports = { sendCsv };
