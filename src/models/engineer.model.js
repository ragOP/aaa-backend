const mongoose = require("mongoose");

const engineerSchema = new mongoose.Schema({
 userName: {
  type: String,
  required: true
 },
 password: {
  type: String,
  required: true,
 },
 email: {
  type: String,
  required: true,
 },
 name: {
  type: String,
  required: true,
 }
}, {timestamps: true})

const Engineer = mongoose.model("Admin", engineerSchema);
module.exports = Engineer;
