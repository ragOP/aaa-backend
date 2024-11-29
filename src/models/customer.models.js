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
 },
 address: {
  type: String,
  required: true,
 },
 gst: {
  type: String,
  required: true,
 },
 contactPerson: {
  type: String,
  required: true,
 },
 phoneNumber: {
  type: String,
  required: true,
 }
}, {timestamps: true})

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
