const nodemailer = require("nodemailer");
const emailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: "cargenemail@gmail.com",
    pass: "!961Mama",
  },
});

module.exports = emailer;
