const mongoose = require("mongoose");

const notificationInformationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "Notification",
  notificationInformationSchema
);
module.exports = Notification;
