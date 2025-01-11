const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Engineer = require("../models/engineer.model");
const Complaint = require("../models/complaint.models");
const Project = require("../models/project.models");
const { uploadPDF } = require("../helper/cloudniary.uploads");
const Warranty = require("../models/warranty.models");
const AMC = require("../models/amc.models");

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
  contactPerson,
  phoneNumber
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
    phoneNumber,
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
    phoneNumber,
  });
  const { password: _, ...engineerWithoutPassword } = newEngineer.toObject();
  return {
    engineer: engineerWithoutPassword,
    message: "Engineer created",
    statusCode: 201,
  };
};

exports.adminGetAllComplaints = async () => {
  const complaints = await Complaint.find({}).sort({ createdAt: -1 });
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
  const totalProjects = await Project.countDocuments();
  const totalEngineers = await Engineer.countDocuments();
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
    totalEngineers,
    totalProjects,
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

exports.addProject = async (
  id,
  title,
  panels,
  siteLocation,
  activity,
  warranty,
  AMC,
  technical_documentation
) => {
  const customer = await Customer.findById(id).select("-password");
  if (!customer) {
    return { engineer: null, message: "No Customer found", statusCode: 404 };
  }

  const warrantyPdf = await uploadPDF(warranty.path, "projects/pdfs");
  const AMCPdf = await uploadPDF(AMC.path, "projects/pdfs");
  const technical_documentationPdf = await uploadPDF(
    technical_documentation.path,
    "projects/pdfs"
  );

  const project = await Project.create({
    customerId: id,
    title,
    panels,
    siteLocation,
    activity,
    warranty: warrantyPdf,
    AMC: AMCPdf,
    technical_documentation: technical_documentationPdf,
  });

  const newProject = {
    ...project.toObject(),
    customerId: customer,
  };
  return {
    project: newProject,
    message: "Project added successfully",
    statusCode: 201,
  };
};

exports.getAllProjects = async () => {
  const projects = await Project.find({});
  if (projects.length == 0) {
    return { projects: null, message: "No projects found", statusCode: 404 };
  }
  const populatedProjects = await Promise.all(
    projects.map(async (project) => {
      const customerDetails = await Customer.findById(
        project.customerId
      ).select("-password");
      return {
        ...project.toObject(),
        customerId: customerDetails || null,
      };
    })
  );
  return {
    projects: populatedProjects,
    message: "All projects fetched successfully",
    statusCode: 200,
  };
};

exports.getSingleProject = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    return { project: null, message: "No project found", statusCode: 404 };
  }
  const customerDetails = await Customer.findById(project.customerId).select(
    "-password"
  );
  project.customerId = customerDetails;
  return {
    project,
    message: "Project retrieved successfully",
    statusCode: 200,
  };
};

exports.deleteSingleProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return { project: null, message: "No project found", statusCode: 404 };
  }
  return {
    project,
    message: "Project deleted successfully",
    statusCode: 200,
  };
};

exports.generateWarranty = async (
  id,
  companyName,
  durationInMonths,
  panels,
  projectName,
  dateOfCommissioning,
  warranty
) => {
  const warrantyPdf = await uploadPDF(warranty.path, "projects/pdfs");
  const warrantyRes = await Warranty.create({
    companyId: id,
    companyName,
    durationInMonths,
    panels,
    projectName,
    dateOfCommissioning,
    warrntyPdf: warrantyPdf,
  });
  if (!warrantyRes) {
    return {
      warrantyRes: null,
      message: "Failed to generate warranty",
      statusCode: 500,
    };
  }
  return {
    warrantyRes,
    message: "Warranty generated successfully",
    statusCode: 200,
  };
};

exports.generateAmc = async (
  id,
  companyName,
  durationInMonths,
  productName,
  dateOfCommissioning,
  amc,
  amount,
  title
) => {
  const amcPdf = await uploadPDF(amc.path, "projects/pdfs");
  const amcRes = await AMC.create({
    companyId: id,
    companyName,
    durationInMonths,
    productName,
    dateOfCommissioning,
    amcPdf: amcPdf,
    amount,
    title
  });
  if (!amcRes) {
    return {
      amcRes: null,
      message: "Failed to generate warranty",
      statusCode: 500,
    };
  }
  return {
    amcRes,
    message: "Warranty generated successfully",
    statusCode: 200,
  };
};

exports.getWarranty = async (id) => {
  const warranty = await Warranty.findById(id);
  if (!warranty) {
    return { warranty: null, message: "No warranty found", statusCode: 404 };
  }
  return {
    warranty,
    message: "Warranty retrieved successfully",
    statusCode: 200,
  };
}

exports.getAmc = async (id) => {
  const amc = await AMC.findById(id);
  if (!amc) {
    return { amc: null, message: "No amc found", statusCode: 404 };
  }
  return {
    amc,
    message: "Amc retrieved successfully",
    statusCode: 200,
  };
};

exports.getAllWarrants = async () => {
  const warranties = await Warranty.find({});
  if (warranties.length == 0) {
    return { warranties: null, message: "No warranties found", statusCode: 404 };
  }
  return {
    warranties,
    message: "All warranties fetched successfully",
    statusCode: 200,
  };
};

exports.getAllAmcs = async () => {
  const amcs = await AMC.find({});
  if (amcs.length == 0) {
    return { amcs: null, message: "No amcs found", statusCode: 404 };
  }
  return {
    amcs,
    message: "All amcs fetched successfully",
    statusCode: 200,
  };
}