const express = require ("express");
const cors = require("cors");
const httpStatus = require("http-status");
const helmet = require("helmet");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/project.route");
const ApiError = require("./utils/apiError")
const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse json request body
app.use(express.urlencoded({extended: true}));

//enable cors
app.use(cors());
app.options("*", cors());

// Reroute all API request starting with "/v1" route
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

module.exports = app;


