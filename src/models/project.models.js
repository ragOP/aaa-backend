const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  title: {
    type: String,
  },
  panels: {
    type: [String],
  },
  siteLocation:{
    type: String,
  },
  activity:{
    type: String,
    default: 'Ongoing',
  },
  warranty:{
    type: String,
  },
  AMC: {
    type: String,
  },
  technical_documentation: {
    type: String,
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
