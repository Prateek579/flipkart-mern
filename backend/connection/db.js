const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose
    .connect("mongodb://0.0.0.0/e-commerceBackend")
    .then(() => {
      console.log("connected to data base successfully");
    })
    .catch((error) => {
      console.log("failed to connect with database", error);
    });
};

module.exports = connectDb;
