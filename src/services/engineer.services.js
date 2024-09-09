const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Engineer = require("../models/engineer.model");
require("dotenv").config();

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
