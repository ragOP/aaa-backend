const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Engineer = require("../models/engineer.model");
const Complaint = require("../models/complaint.models");
const { asyncHandler } = require("../common/asyncHandler");

exports.adminLogin = async (userName, password) => {
  const admin = await Admin.findOne({ userName });
  if (!admin) {
    return {
      admin: null,
      token: null,
      message: "No admin found with this credentials",
    };
  }
  if (admin.password !== password) {
    return { admin: null, token: null, message: "Wrong password" };
  }

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET
  );

  const { password: _, ...adminWithoutPassword } = admin.toObject();

  return {
    admin: adminWithoutPassword,
    token,
    message: "Admin loggedIn successfully",
  };
};

exports.adminAddCustomer = async (
  userName,
  password,
  name,
  email,
  address,
  gst,
  contactPerson
) => {
  let existingCustomer = await Customer.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingCustomer) {
    return {
      customer: null,
      message: "Customer already exist.",
    };
  }
  if (!password) {
    return {
      customer: null,
      message: "Password is required",
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newCustomer = await Customer.create({
    userName,
    name,
    email,
    password: hashedPassword,
    address,
    gst,
    contactPerson,
  });
  const { password: _, ...customerWithoutPassword } = newCustomer.toObject();
  return { customer: customerWithoutPassword, message: "Customer created" };
};

exports.adminAddEngineer = async (
  userName,
  password,
  name,
  email,
  employeeId
) => {
  let existingEngineer = await Engineer.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingEngineer) {
    return {
      engineer: null,
      message: "Engineer already exist",
    };
  }
  if (!password) {
    return {
      customer: null,
      message: "Password is required",
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newEngineer = await Engineer.create({
    userName,
    email,
    name,
    password: hashedPassword,
    employeeId,
  });
  const { password: _, ...engineerWithoutPassword } = newEngineer.toObject();
  return { engineer: engineerWithoutPassword, message: "Engineer created" };
};

exports.adminGetAllComplaints = async () => {
  const complaints = await Complaint.find({});
  if (complaints.length == 0) {
    return { complaints: null, message: "No complaints found" };
  }
  return { complaints, message: "All complaints fetched successfully" };
};

exports.adminGetAllTechnician = async () => {
  const engineer = await Engineer.find({});
  if (engineer.length == 0) {
    return { engineer: null, message: "No complaints found" };
  }
  return { engineer, message: "All complaints fetched successfully" };
};

exports.getSingleComplaint = async (id) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return { complaint: null, message: "No complaint found" };
  }
  const technicanId = complaint.technician;
  const technician = await Engineer.findById(technicanId).select("-password");
  complaint.technician = technician;
  return { complaint, message: "Complaint retrieved successfully" };
};
exports.adminAddTechnician = async (id, technicianId) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return { complaint: null, message: "No complaint found" };
  }
  const technician = await Engineer.findById(technicianId);
  if (!technician) {
    return { technician: null, message: "No technician found" };
  }
  complaint.technician = technicianId;
  complaint.statusCode = Math.floor(1000 + Math.random() * 9000);
  await complaint.save();
  return { complaint, message: "Technician added successfully" };
};

exports.getTechnicianDetails = async (technicianId) => {
  const technician = await Engineer.findById(technicianId).select("-password");
  if (!technician) {
    return { technician: null, message: "No technician found" };
  }
  return { technician, message: "Technician retrieved successfully" };
};

exports.getCustomerDetails = async (customerId) => {
  const customer = await Customer.findById(customerId).select("-password");
  if (!customer) {
    return { customer: null, message: "No customer found" };
  }
  return { customer, message: "Customer retrieved successfully" };
};
