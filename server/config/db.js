const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((error) => {
      console.log("DB cONNECTION FAILED");
      console.error(error);
    });
};
