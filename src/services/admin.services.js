const Admin = require("../models/admin.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");
const Engineer = require("../models/engineer.model");
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

  const { password:_, ...adminWithoutPassword } = admin.toObject();

  return {
    admin: adminWithoutPassword,
    token,
    message: "Admin loggedIn successfully",
  };
};

exports.adminAddCustomer = async (userName, password, name, email) => {
  let existingCustomer = await Customer.findOne({
    $or: [{ userName }, { email }]
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
  });
  const { password:_, ...customerWithoutPassword } = newCustomer.toObject();
  return { customer: customerWithoutPassword, message: "Customer created" };
};

exports.adminAddEngineer = async (userName, password, name, email) => {
  let existingEngineer = await Engineer.findOne({
    $or: [{ userName }, { email }]
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
  });
  const { password:_, ...engineerWithoutPassword } = newEngineer.toObject();
  return { engineer: engineerWithoutPassword, message: "Engineer created" };
};
