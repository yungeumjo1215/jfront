const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema); 