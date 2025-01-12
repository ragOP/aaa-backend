const express = require('express');
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();


const morganFormat = ":method :url :status :response-time ms";

const port = process.env.PORT || 8000;

const handleConnectionToDB = require('./src/db/config');
const adminRoute = require("./src/routes/admin.routes");
const customerRoute = require("./src/routes/customer.routes");
const engineerRoute = require("./src/routes/engineer.routes");
const logger = require("./logger.js");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Logger
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Database Connection
handleConnectionToDB(process.env.MONGO_URI);

app.use('/api/admin', adminRoute);
app.use('/api/customer', customerRoute);
app.use('/api/engineer', engineerRoute);

app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})