// from remote
require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// from local
const path = require("path");
const ApiError = require("./utils/ApiError");
const { globalHandleError } = require("./middleware/errorMiddleware");
const {
  connectWithDatabase,
} = require("./middleware/databaseConnectionMiddleware");
const { mountRoutes } = require("./routes");

// to make uploads a static file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// to set other client to access data
app.use(cors());

// connecting with database
connectWithDatabase();

app.use(express.json({ limit: "50kb" }));

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// mount route
app.get("/", (req, res, next) =>
  res.send(
    `welcome in my api use ${process.env.BASE_URL}api/v1/products to show meals`
  )
);

mountRoutes(app);

// handle all routes that not exist
app.all("*", (req, res, next) => {
  return next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
});

// global error function
app.use(globalHandleError);



const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, "0.0.0.0", (err) => {
  if (!err) {
    console.log("app listening on port " + PORT);
  }
});

process.on("unhandledRejection", (err) => {
  console.error(`rejection unhandled error ${err.name} -> ${err.message}`);
  // if have a pending request => server close after end it
  server.close(() => {
    console.log("shutting down application ...");
    // close app
    process.exit(1);
  });
});
