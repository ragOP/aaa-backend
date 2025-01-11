const mongoose = require("mongoose");

const amcSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    dateOfCommissioning: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    amcPdf: {
      type: String, // Path to uploaded PDF
      default: "",
    },
  },
  { timestamps: true }
);

const AMC = mongoose.model("AMC", amcSchema);
module.exports = AMC;
