const mongoose = require("mongoose");

const connectDB = () => {
  const connect = mongoose.connect(process.env.URL, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected`);
};

module.exports = connectDB;
