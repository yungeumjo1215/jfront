const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company',
    required: true 
  },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema); 