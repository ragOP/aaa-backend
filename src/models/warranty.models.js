const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  durationInMonths: {
    type: Number,
    required: true,
  },
  panels: {
    type: [String],
    default: [],
  },
  projectName: {
    type: String,
    required: true,
  },
  dateOfCommissioning: {
    type: Date,
    required: true,
  },
  warrntyPdf: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const Warranty = mongoose.model('Warranty', warrantySchema);
module.exports = Warranty;
