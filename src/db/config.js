const mongoose = require("mongoose");

async function handleConnectionToDB(mongoURI) {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

module.exports = handleConnectionToDB;