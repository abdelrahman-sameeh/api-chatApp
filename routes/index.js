const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const friendRoute = require("./friendRoute");
const chatRoute = require("./chatRoute");

exports.mountRoutes = (app) => {
  app.use("/api/v1", authRoute);
  app.use("/api/v1", userRoute);
  app.use("/api/v1", friendRoute);
  app.use("/api/v1", chatRoute);
};
