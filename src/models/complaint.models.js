const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
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
  issueDescription: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  activity: {
    type: String,
    enum: ["Pending", "Ongoing", "Closed"],
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Engineer",
  },
  statusCode: {
    type: Number,
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
