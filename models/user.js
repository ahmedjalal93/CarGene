const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Users = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: "Email is required",
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    lowercase: true,
  },
  password: {
    type: String,
    required: "Password is required",
    validate: [({ length }) => length >= 8, "Password should be longer."],
  },
  name: {
    first: {
      type: String,
      required: "First name is required",
      trim: true,
    },
    last: {
      type: String,
      required: "Last name is required",
      trim: true,
    },
  },
  phone: {
    verified: {
      type: Boolean,
      default: false,
    },
    number: {
      type: String,
      required: "Phone number is required",
      unique: true,
      //match: [/^[0-9+]$/gi, "Enter a valid phone number"],
      minlength: 9,
      maxlength: 16,
    },
  },
  birthday: {
    type: String,
    required: "Birthday is required",
    //match: [/^[0-9-]$/gi, "Invalid birthday entry"],
    validate: [({ length }) => length === 10, "Invalid birthday entry"],
  },
  address: {
    type: String,
    required: "Address is required",
  },
  city: {
    type: String,
    required: "City is required",
  },
  state: {
    type: String,
    required: "State is required",
  },
  zip: {
    type: Number,
    required: "Zip code is required",
    default: 00000,
    minlength: 1,
    maxlength: 8,
  },
  active: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

Users.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Users.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
  next();
});

module.exports = User = mongoose.model("Users", Users);
