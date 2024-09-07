const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
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

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
