const mongoose = require("mongoose");

const notificationInformationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationInformationSchema);
module.exports = Notification;
