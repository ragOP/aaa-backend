const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Engineer = require("../models/engineer.model");
const Complaint = require("../models/complaint.models");

exports.adminLogin = async (userName, password) => {
  const admin = await Admin.findOne({ userName });
  if (!admin) {
    return {
      admin: null,
      token: null,
      message: "No admin found with this credentials",
      statusCode: 404,
    };
  }
  if (admin.password !== password) {
    return {
      admin: null,
      token: null,
      message: "Wrong password",
      statusCode: 401,
    };
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
    statusCode: 200,
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
      statusCode: 409,
    };
  }
  if (!password) {
    return {
      customer: null,
      message: "Password is required",
      statusCode: 401,
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
  return {
    customer: customerWithoutPassword,
    message: "Customer created",
    statusCode: 201,
  };
};

exports.adminAddEngineer = async (
  userName,
  password,
  name,
  email,
  employeeId,
  phoneNumber
) => {
  let existingEngineer = await Engineer.findOne({
    $or: [{ userName }, { email }],
  });
  if (existingEngineer) {
    return {
      engineer: null,
      message: "Engineer already exist",
      statusCode: 409,
    };
  }
  if (!password) {
    return {
      customer: null,
      message: "Password is required",
      statusCode: 401,
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
    phoneNumber
  });
  const { password: _, ...engineerWithoutPassword } = newEngineer.toObject();
  return {
    engineer: engineerWithoutPassword,
    message: "Engineer created",
    statusCode: 201,
  };
};

exports.adminGetAllComplaints = async () => {
  const complaints = await Complaint.find({}).sort({createdAt: -1});
  if (complaints.length == 0) {
    return {
      complaints: null,
      message: "No complaints found",
      statusCode: 404,
    };
  }
  const populatedComplaints = await Promise.all(
    complaints.map(async (complaint) => {
      const customerDetails = await Customer.findById(
        complaint.customerId
      ).select("-password");
      const technicianDetails = await Engineer.findById(
        complaint.technician
      ).select("-password");

      console.log(customerDetails, technicianDetails);

      return {
        ...complaint.toObject(),
        customerId: customerDetails || null,
        technician: technicianDetails || null,
      };
    })
  );
  return {
    complaints: populatedComplaints,
    message: "All complaints fetched successfully",
    statusCode: 200,
  };
};

exports.adminGetAllTechnician = async () => {
  const engineer = await Engineer.find({});
  if (engineer.length == 0) {
    return { engineer: null, message: "No complaints found", statusCode: 404 };
  }
  return {
    engineer,
    message: "All complaints fetched successfully",
    statusCode: 200,
  };
};

exports.getSingleComplaint = async (id) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return { complaint: null, message: "No complaint found", statusCode: 404 };
  }
  const technicanId = complaint.technician;
  let customerId = complaint.customerId;
  const technician = await Engineer.findById(technicanId).select("-password");
  const customer = await Customer.findById(customerId).select("-password");
  complaint.technician = technician;
  complaint.customerId = customer;
  return {
    complaint,
    message: "Complaint retrieved successfully",
    statusCode: 200,
  };
};
exports.adminAddTechnician = async (id, technicianId) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return { complaint: null, message: "No complaint found", statusCode: 404 };
  }
  const technician = await Engineer.findById(technicianId);
  if (!technician) {
    return {
      technician: null,
      message: "No technician found",
      statusCode: 404,
    };
  }
  complaint.technician = technicianId;
  complaint.statusCode = Math.floor(1000 + Math.random() * 9000);
  await complaint.save();
  return {
    complaint,
    message: "Technician added successfully",
    statusCode: 201,
  };
};

exports.getTechnicianDetails = async (technicianId) => {
  const technician = await Engineer.findById(technicianId).select("-password");
  if (!technician) {
    return {
      technician: null,
      message: "No technician found",
      statusCode: 404,
    };
  }
  return {
    technician,
    message: "Technician retrieved successfully",
    statusCode: 200,
  };
};

exports.getCustomerDetails = async (customerId) => {
  const customer = await Customer.findById(customerId).select("-password");
  if (!customer) {
    return { customer: null, message: "No customer found", statusCode: 404 };
  }
  return {
    customer,
    message: "Customer retrieved successfully",
    statusCode: 200,
  };
};

exports.getAllDashboardStats = async () => {
  const totalComplaints = await Complaint.countDocuments();
  const complaintsByActivity = await Complaint.aggregate([
    { $group: { _id: "$activity", count: { $sum: 1 } } },
  ]);
  const complaintsBySeverity = await Complaint.aggregate([
    { $group: { _id: "$severity", count: { $sum: 1 } } },
  ]);

  const stats = {
    totalComplaints,
    complaintsByActivity,
    complaintsBySeverity,
  };

  return {
    stats,
    message: "Dashboard stats retrieved successfully",
    statusCode: 200,
  };
};

exports.getAllCustomers = async () => {
  const customers = await Customer.find({});
  if (customers.length == 0) {
    return { customers: null, message: "No customers found", statusCode: 404 };
  }
  return {
    customers,
    message: "All customers fetched successfully",
    statusCode: 200,
  };
};
