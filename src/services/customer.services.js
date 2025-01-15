const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Complaint = require("../models/complaint.models");
const {
  uploadMultipleFiles,
  uploadVoiceNote,
} = require("../helper/cloudniary.uploads");
const Engineer = require("../models/engineer.model");
const Project = require("../models/project.models");
const Warranty = require("../models/warranty.models");
const AMC = require("../models/amc.models");

exports.customerLogin = async (userName, password) => {
  const customer = await Customer.findOne({ userName });
  if (!customer) {
    return {
      customer: null,
      token: null,
      message: "No user found",
      statusCode: 404,
    };
  }
  const comparePassword = await bcrypt.compare(password, customer.password);
  if (!comparePassword) {
    return {
      customer: null,
      token: null,
      message: "Password is not correct",
      statusCode: 401,
    };
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

exports.createComplaint = async (
  customerId,
  complaintData,
  images,
  voiceNote
) => {
  if (!images) {
    return { complaint: null, message: "No images provided", statusCode: 404 };
  }
  const uploadedUrls = await uploadMultipleFiles(images, "complaints/images");
  let uploadedAudioUrl = "";
  if (voiceNote) {
    uploadedAudioUrl = await uploadVoiceNote(
      voiceNote.path,
      "complaints/voice_notes"
    );
  }
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
  return {
    complaint,
    messaage: "Comaplaint registered successfully",
    statusCode: 201,
  };
};

exports.getMyComplaint = async (customerId) => {
  const complaints = await Complaint.find({ customerId }).sort({
    createdAt: -1,
  });
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
  return {
    complaints: populatedComplaints,
    messaage: "Complaint retrieved successfully",
    statusCode: 200,
  };
};

exports.raisePriority = async (complaintId) => {
  const complaint = await Complaint.findById(complaintId);
  const severity = complaint.severity;
  if (severity === "Low") {
    complaint.severity = "Medium";
  } else if (severity === "Medium") {
    complaint.severity = "High";
  } else {
    return {
      complaint: null,
      messaage: "Priority Alredy High",
      statusCode: 400,
    };
  }
  await complaint.save();
  if (!complaint) {
    return { complaint: null, message: "No complaint found", statusCode: 404 };
  }
  return {
    complaint,
    messaage: "Priority raised successfully",
    statusCode: 200,
  };
};
exports.getMyDetails = async (id) => {
  const customer = await Customer.findById(id).select("-password");
  if (!customer) {
    return { customer: null, message: "No customer found", statusCode: 404 };
  }
  return {
    customer,
    messaage: "Customer details retrieved successfully",
    statusCode: 200,
  };
};
exports.getSingleComplaint = async (id) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return { complaint: null, message: "No complaint found", statusCode: 404 };
  }
  const customerDetails = await Customer.findById(complaint.customerId).select(
    "-password"
  );
  const technicianDetails = await Engineer.findById(
    complaint.technician
  ).select("-password");
  return {
    complaint: {
      ...complaint.toObject(),
      customerId: customerDetails,
      technician: technicianDetails,
    },
    messaage: "Complaint retrieved successfully",
    statusCode: 200,
  };
};

exports.getAllProjects = async (customerId) => {
  try {
    const projects = await Project.find({ customerId });
    const warranties = await Warranty.find({ customerId });
    const amcs = await AMC.find({ customerId });

    if (projects.length === 0) {
      return { complaint: null, message: "No projects found", statusCode: 404 };
    }

    const projectsWithDetails = projects.map((project) => {
      const projectWarranties = warranties.filter(
        (warranty) => warranty.projectId.toString() === project._id.toString()
      );
      const projectAMCs = amcs.filter(
        (amc) => amc.projectId.toString() === project._id.toString()
      );

      return {
        ...project._doc,
        warranties: projectWarranties,
        amcs: projectAMCs,
      };
    });

    return {
      projects: projectsWithDetails,
      message: "All projects retrieved successfully",
      statusCode: 200,
    };
  } catch (error) {
    return {
      message: "An error occurred while retrieving the projects",
      error: error.message,
      statusCode: 500,
    };
  }
};

exports.createNotification = async (formData) => {
  try {
    const { email, userName } = formData;
    const customer = await Customer.findOne({
      $or: [{ email: email, userName: userName }],
    });
    if (!customer) {
      return {
        message: "Customer not found",
        statusCode: 404,
      };
    }

    const notification = await Notification.create({
      formData,
    });

    return {
      notification,
      message: "Notification created successfully",
      statusCode: 201,
    };
  } catch (error) {
    return {
      message: "An error occurred while creating the notification",
      error: error.message,
      statusCode: 500,
    };
  }
};
