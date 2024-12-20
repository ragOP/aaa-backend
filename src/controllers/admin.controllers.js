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
  addProject,
  getAllProjects,
  getSingleProject,
  deleteSingleProject,
} = require("../services/admin.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleAdminLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const { admin, token, message, statusCode } = await adminLogin(
    userName,
    password
  );

  if (!admin) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { token, user: admin }, message));
});

exports.handleAddCustomer = asyncHandler(async (req, res) => {
  const {
    userName,
    password,
    email,
    name,
    address,
    gst,
    contactPerson,
    phoneNumber,
  } = req.body;
  const { customer, message, statusCode } = await adminAddCustomer(
    userName,
    password,
    name,
    email,
    address,
    gst,
    contactPerson,
    phoneNumber
  );

  if (!customer) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { user: customer }, message));
});

exports.handleAddEngineer = asyncHandler(async (req, res) => {
  const { userName, password, email, name, employeeId, phoneNumber } = req.body;
  const { engineer, message, statusCode } = await adminAddEngineer(
    userName,
    password,
    name,
    email,
    employeeId,
    phoneNumber
  );

  if (!engineer) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { user: engineer }, message));
});

exports.handleGetAllComplaints = asyncHandler(async (req, res) => {
  const { complaints, message, statusCode } = await adminGetAllComplaints();

  if (!complaints) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(200)
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
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(200)
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
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
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
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { message }, message));
});

exports.handleGetTechnicanDetails = asyncHandler(async (req, res) => {
  const { technicianId } = req.params;

  const { technician, message, statusCode } = await getTechnicianDetails(
    technicianId
  );

  if (!technician) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
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
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
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
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(statusCode, { stats }, "Stats retrieved successfully")
    );
});

exports.handleGetAllCustomers = asyncHandler(async (req, res) => {
  const { customers, message, statusCode } = await getAllCustomers();
  if (!customers) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        statusCode,
        { customers },
        "Customers retrieved successfully"
      )
    );
});

exports.handleAddProject = asyncHandler(async (req, res) => {
  const { title, panels, customerId, siteLocation, activity } = req.body;
  const warranty = req.files.warranty[0];
  const AMC = req.files.AMC[0];
  const technical_documentation = req.files.technical_documentation[0];

  if(!warranty || !technical_documentation || !AMC){
    return res.status(200).json(
      new ApiResponse(400, {
        message: "All files are required",
      })
    );
  }

  const { project, message, statusCode } = await addProject(
    customerId,
    title,
    panels,
    siteLocation,
    activity,
    warranty,
    AMC,
    technical_documentation
  );

  if (!project) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { project }, message));
});

exports.handleGetAllProjects = asyncHandler(async (req, res) => {
  const { projects, message, statusCode } = await getAllProjects();

  if (!projects) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statusCode, { projects }, message));
});
exports.handleGetSingleProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(200)
      .json(new ApiResponse(400, { messaage: "Please Provide Project Id" }));
  }
  const { project, messaage, statusCode } = await getSingleProject(id);
  if (!project) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        messaage,
      })
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(statusCode, { data: project }, messaage));
});

exports.handleSingleDeleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
     .status(200)
     .json(new ApiResponse(400, { messaage: "Please Provide Project Id" }));
  }
  const { message, statusCode } = await deleteSingleProject(id);
  return res.status(200).json(new ApiResponse(statusCode, { message }));
});
