const { asyncHandler } = require("../common/asyncHandler");
const Complaint = require("../models/complaint.models");
const {
  adminLogin,
  adminAddCustomer,
  adminAddEngineer,
  adminGetAllTechnician,
  adminGetAllComplaints,
  getSingleComplaint,
  adminAddTechnician,
  getTechnicianDetails,
  getCustomerDetails,
  getAllDashboardStats,
  getAllCustomers,
} = require("../services/admin.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleAdminLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const { admin, token, message, statusCode } = await adminLogin(
    userName,
    password
  );

  if (!admin) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { token, user: admin }, message));
});

exports.handleAddCustomer = asyncHandler(async (req, res) => {
  const { userName, password, email, name, address, gst, contactPerson } =
    req.body;
  const { customer, message, statusCode } = await adminAddCustomer(
    userName,
    password,
    name,
    email,
    address,
    gst,
    contactPerson
  );

  if (!customer) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { user: customer }, message));
});

exports.handleAddEngineer = asyncHandler(async (req, res) => {
  const { userName, password, email, name, employeeId } = req.body;
  const { engineer, message, statusCode } = await adminAddEngineer(
    userName,
    password,
    name,
    email,
    employeeId
  );

  if (!engineer) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { user: engineer }, message));
});

exports.handleGetAllComplaints = asyncHandler(async (req, res) => {
  const { complaints, message, statusCode } = await adminGetAllComplaints();

  if (!complaints) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { complaints },
        "Complaints retrieved successfully"
      )
    );
});

exports.handleGetAllEngineer = asyncHandler(async (req, res) => {
  const { engineer, message, statusCode } = await adminGetAllTechnician();

  if (!engineer) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { engineer },
        "Engineer retrieved successfully"
      )
    );
});

exports.handleGetSingleComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { complaint, message, statusCode } = await getSingleComplaint(id);

  if (!complaint) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { complaint },
        "Complaint retrieved successfully"
      )
    );
});

exports.handleAddTechnican = asyncHandler(async (req, res) => {
  const { technicianId } = req.body;
  const { complaintId } = req.params;

  const { message, statusCode } = await adminAddTechnician(
    complaintId,
    technicianId
  );

  if (!message) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { message }, message));
});

exports.handleGetTechnicanDetails = asyncHandler(async (req, res) => {
  const { technicianId } = req.params;

  const { technician, message, statusCode } = await getTechnicianDetails(
    technicianId
  );

  if (!technician) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { technician },
        "Technician retrieved successfully"
      )
    );
});

exports.handleGetCustomerDeatils = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const { customer, message, statusCode } = await getCustomerDetails(
    customerId
  );

  if (!customer) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { customer },
        "Customer retrieved successfully"
      )
    );
});

exports.handleGetDashboardStats = asyncHandler(async (req, res) => {
  const { stats, message, statusCode } = await getAllDashboardStats();
  if (!stats) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(statusCode)
    .json(
      new ApiResponse(statusCode, { stats }, "Stats retrieved successfully")
    );
});

exports.handleGetAllCustomers = asyncHandler(async (req, res) => {
  const { customers, message, statusCode } = await getAllCustomers();
  if (!customers) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { customers },
        "Customers retrieved successfully"
      )
    );
});
