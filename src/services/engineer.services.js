const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Engineer = require("../models/engineer.model");
const Complaint = require("../models/complaint.models");
const Customer = require("../models/customer.models");
const { uploadVoiceNote } = require("../helper/cloudniary.uploads");

exports.engineerLogin = async (userName, password) => {
  const engineer = await Engineer.findOne({ userName });
  if (!engineer) {
    return { engineer: null, token: null, message: "No user found" };
  }
  const comparePassword = await bcrypt.compare(password, engineer.password);
  if (!comparePassword) {
    return { engineer: null, token: null, message: "Password is not correct" };
  }
  const { password: _, ...engineerWithoutPassword } = engineer.toObject();
  const token = jwt.sign(
    { id: engineer._id, role: "engineer" },
    process.env.JWT_SECRET
  );
  return {
    engineer: engineerWithoutPassword,
    token,
    message: "User loggedin successfully",
  };
};

exports.getAllJobs = async (id) => {
  const jobs = await Complaint.find({ technician: id });
  const populatedJobs = await Promise.all(
    jobs.map(async (job) => {
      const customerDetails = await Customer.findById(job.customerId).select(
        "-password"
      );
      return {
        ...job.toObject(),
        customerId: customerDetails || null,
      };
    })
  );
  if (!jobs) {
    return { jobs: null, message: "No jobs found", statusCode: 404 };
  }
  return {
    jobs: populatedJobs,
    message: "Jobs fetched successfully",
    statusCode: 200,
  };
};

exports.startJob = async (id, statusCode, engineerId) => {
  const job = await Complaint.findById(id);

  if (!job) {
    return { job: null, message: "No pending job found", statuscode: 404 };
  }

  if (!job.technician.equals(engineerId)) {
    return {
      job: null,
      message: "Access denied. You are not authorized to view this job",
      statusCode: 403,
    };
  }

  if (job.activity === "Ongoing" || job.activity === "Closed") {
    return {
      job: null,
      message: "Job is already in progress or closed",
      statuscode: 401,
    };
  }

  if (job.statusCode != statusCode) {
    return {
      job: null,
      message: "Status code mismatch. Update not allowed",
      statuscode: 401,
    };
  }
  const happyCode = Math.floor(1000 + Math.random() * 9000);
  const updatedJob = await Complaint.findOneAndUpdate(
    { _id: job._id },
    {
      activity: "Ongoing",
      statusCode: happyCode,
    },
    { new: true }
  );

  return {
    job: updatedJob,
    message: "Job started successfully",
    statuscode: 200,
  };
};

exports.getSingleJobs = async (id, engineerId) => {
  const job = await Complaint.findById(id);

  if (!job) {
    return { job: null, message: "No job found", statusCode: 404 };
  }
  if (!job.technician.equals(engineerId)) {
    return {
      job: null,
      message: "Access denied. You are not authorized to view this job",
      statusCode: 403,
    };
  }
  const customerDetails = await Customer.findById(job.customerId).select(
    "-password"
  );

  return {
    job: { ...job.toObject(), customerId: customerDetails || null },
    message: "Job fetched successfully",
    statusCode: 200,
  };
};

exports.completedJob = async (
  id,
  engineerId,
  repairDescription,
  replacedParts,
  remarks,
  completedVoiceNote,
  statusCode
) => {
  const job = await Complaint.findById(id);

  if (!job) {
    return { job: null, message: "No job found", statuscode: 404 };
  }
  if (!job.technician.equals(engineerId)) {
    return {
      job: null,
      message: "Access denied. You are not authorized to view this job",
      statuscode: 403,
    };
  }

  if (job.activity !== "Ongoing") {
    return {
      job: null,
      message: "Job is not in progress",
      statuscode: 401,
    };
  }

  if (job.activity === "Closed") {
    return {
      job: null,
      message: "Job is already closed",
      statuscode: 401,
    };
  }

  let uploadedAudioUrl = "";
  if (completedVoiceNote) {
    uploadedAudioUrl = await uploadVoiceNote(
      completedVoiceNote.path,
      "complaints/voice_notes"
    );
  }

  if(job.statusCode != statusCode){
    return {
      job: null,
      message: "Happy code mismatch. Update not allowed",
      statuscode: 401,
    };
  }

  const updatedJob = await Complaint.findOneAndUpdate(
    { _id: job._id },
    {
      activity: "Closed",
      repairDescription,
      replacedParts,
      remarks,
      completedVoiceNote: uploadedAudioUrl,
      statusCode: null,
    },
    { new: true }
  );
  return {
    job: updatedJob,
    message: "Job completed successfully",
    statuscode: 200,
  };
};
