const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  customerId: {
   type: String,
  },
  projectName: {
   type: String,
  },
  siteLocation: {
   type: String,
  },
  panelSectionName: {
   type: String,
  },
  issueDescription:{
   type: String,
  },
  images: [{
   type: String,
  }],
  severity: {
   type: String,
   enum: ["Low", "Medium", "High"],
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
