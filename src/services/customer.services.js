const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.models");

exports.customerLogin = async (userName, password) => {
  const customer = await Customer.findOne({ userName });
  if (!customer) {
    return { customer: null, token: null, message: "No user found" };
  }
  const comparePassword = await bcrypt.compare(password, customer.password);
  if (!comparePassword) {
    return { customer: null, token: null, message: "Password is not correct" };
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
  };
};
