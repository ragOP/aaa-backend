const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
  return { admin, token, message: "Admin loggedIn successfully" };
};
