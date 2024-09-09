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

  const { password: _, ...adminWithoutPassword } = admin.toObject();

  return {
    admin: adminWithoutPassword,
    token,
    message: "Admin loggedIn successfully",
  };
};

exports.adminAddCustomer = async (userName, password, name, email) => {
  let customer = await Customer.findOne({ userName });
  if (customer) {
    return {
      customer: null,
      message: "Customer already exist with this username",
    };
  }
  let customerEmail = await Customer.findOne({ email });
  console.log(customerEmail, userName, password, name, email);
  if (customerEmail) {
    return {
      customer: null,
      message: "Customer already exist with this email",
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newCustomer = await Customer.create({
    userName: userName,
    name: name,
    email: email,
    password: hashedPassword,
  });
  const { password: _, ...customerWithoutPassword } = newCustomer.toObject();
  return { customer: customerWithoutPassword, message: "Customer created" };
};

exports.adminAddEngineer = async (userName, password, name, email) => {
  let engineer = await Engineer.findOne({ userName });
  if (engineer) {
    return {
      engineer: null,
      message: "Engineer already exist with this username",
    };
  }
  let engineerWithEmail = await Engineer.findOne({ email });
  if (engineerWithEmail) {
    return {
      engineer: null,
      message: "Engineer already exist with this email",
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
  const { password: _, ...engineerWithoutPassword } = newEngineer.toObject();
  return { engineer: engineerWithoutPassword, message: "Engineer created" };
};
