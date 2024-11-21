const { asyncHandler } = require("../common/asyncHandler");
const Complaint = require("../models/complaint.models");
const {
  adminLogin,
  adminAddCustomer,
  adminAddEngineer,
  adminGetAllTechnician,
  adminGetAllComplaints,
  getSingleComplaint,
} = require("../services/admin.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleAdminLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const { admin, token, message } = await adminLogin(userName, password);

  if (!admin) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { token, user: admin }, message));
});

exports.handleAddCustomer = asyncHandler(async (req, res) => {
  const { userName, password, email, name } = req.body;
  const { customer, message } = await adminAddCustomer(
    userName,
    password,
    name,
    email
  );

  if (!customer) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user: customer }, message));
});

exports.handleAddEngineer = asyncHandler(async (req, res) => {
  const { userName, password, email, name } = req.body;
  const { engineer, message } = await adminAddEngineer(
    userName,
    password,
    name,
    email
  );

  if (!engineer) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user: engineer }, message));
});

exports.handleGetAllComplaints = asyncHandler(async (req, res) => {
  const { complaints, message } = await adminGetAllComplaints();

  if (!complaints) {
    return res.status(404).json(
      new ApiResponse(404, {
        message,
      })
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { complaints }, "Complaints retrieved successfully")
    );
});

exports.handleGetAllEngineer = asyncHandler(async (req, res) => {
  const { engineer, message } = await adminGetAllTechnician();

  if (!engineer) {
    return res.status(404).json(
      new ApiResponse(404, {
        message,
      })
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { engineer }, "Engineer retrieved successfully")
    );
});

exports.handleGetSingleComplaint = asyncHandler (async (req, res) => {
  const { id } = req.params;

  const {complaint, message } = await getSingleComplaint(id);

  if (!complaint) {
    return res.status(404).json(
      new ApiResponse(404, {
        message,
      })
    );
  }

  return res.status(200).json(
    new ApiResponse(200, { complaint }, "Complaint retrieved successfully")
  );
})
