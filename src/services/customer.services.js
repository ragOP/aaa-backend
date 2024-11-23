const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Complaint = require("../models/complaint.models");
const { uploadMultipleFiles, uploadVoiceNote }  = require("../helper/cloudniary.uploads");
const Engineer = require("../models/engineer.model");

exports.customerLogin = async (userName, password) => {
  const customer = await Customer.findOne({ userName });
  if (!customer) {
    return { customer: null, token: null, message: "No user found", statusCode: 404 };
  }
  const comparePassword = await bcrypt.compare(password, customer.password);
  if (!comparePassword) {
    return { customer: null, token: null, message: "Password is not correct", statusCode: 401 };
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
    statusCode: 200,
  };
};

exports.createComplaint = async (customerId, complaintData, images, voiceNote) => {
  if(!images){
    return { complaint: null, message: "No images provided", statusCode: 404 };
  }
  const uploadedUrls = await uploadMultipleFiles(images, 'complaints/images');
  const uploadedAudioUrl = await uploadVoiceNote(voiceNote.path, 'complaints/voice_notes');
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return { complaint: null, message: "Customer not found", statusCode: 404 };
  }
  const complaint = await Complaint.create({
    customerId,
    ...complaintData,
    images: uploadedUrls,
    voiceNote: uploadedAudioUrl,
  });
  return { complaint, messaage: "Comaplaint registered successfully", statusCode: 201 };
}

exports.getMyComplaint = async (customerId) => {
  const complaints = await Complaint.find({ customerId });
  if (complaints.length == 0) {
    return { complaint: null, message: "No complaint found", statusCode: 404 };
  }
  const populatedComplaints = await Promise.all(
    complaints.map(async (complaint) => {
      const customerDetails = await Customer.findById(
        complaint.customerId
      ).select("-password");
      const technicianDetails = await Engineer.findById(
        complaint.technician
      ).select("-password");
      return {
        ...complaint.toObject(),
        customerId: customerDetails || null,
        technician: technicianDetails || null,
      };
    })
  );
  return { complaints: populatedComplaints, messaage: "Complaint retrieved successfully", statusCode: 200 };
}