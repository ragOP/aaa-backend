const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Complaint = require("../models/complaint.models");
const { uploadMultipleFiles, uploadVoiceNote }  = require("../helper/cloudniary.uploads");

exports.customerLogin = async (userName, password) => {
  const customer = await Customer.findOne({ userName });
  if (!customer) {
    return { customer: null, token: null, message: "No user found" };
  }
  const comparePassword = await bcrypt.compare(password, customer.password);
  if (!comparePassword) {
    return { customer: null, token: null, message: "Password is not correct" };
  }
  const { password: _, ...customerWithoutPassword } = customer.toObject();
  const token = jwt.sign(
    { id: customer._id, role: "customer" },
    process.env.JWT_SECRET
  );
  return {
    customer: customerWithoutPassword,
    token,
    message: "User loggedin successfully",
  };
};

exports.createComplaint = async (customerId, complaintData, images, voiceNote) => {
  if(!images){
    return { complaint: null, message: "No images provided" };
  }
  const uploadedUrls = await uploadMultipleFiles(images, 'complaints/images');
  const uploadedAudioUrl = await uploadVoiceNote(voiceNote.path, 'complaints/voice_notes');
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return { complaint: null, message: "Customer not found" };
  }
  const complaint = await Complaint.create({
    customerId,
    ...complaintData,
    images: uploadedUrls,
    voiceNote: uploadedAudioUrl,
  });
  return { complaint, messaage: "Comaplaint registered successfully" };
}

exports.getMyComplaint = async (customerId) => {
  const complaint = await Complaint.find({ customerId });
  if (!complaint) {
    return { complaint: null, message: "No complaint found" };
  }
  return { complaint, messaage: "Complaint retrieved successfully" };
}