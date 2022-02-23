const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add an title name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description of an event"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },

  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  time: {
    type: Date,
    default: Date.now(),
    required: [true, "Please add a date"],
  },
  emailList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // unique: true,
      required: [true, "Please add invitees"],
    },
  ],
});

module.exports = mongoose.model("Events", eventsSchema);
