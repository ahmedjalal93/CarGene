const db = require("../models");
const passport = require("../config/passport");
const crypto = require("crypto");
const emailer = require("../lib/emailer");

module.exports = function (app) {
  // signup route
  app.post("/api/signup", (req, res) => {
    const token = crypto.randomBytes(20).toString("hex");
    db.User.create({
      name: {
        first: req.body.firstnameInput,
        last: req.body.lastnameInput,
      },
      email: req.body.emailInput,
      password: req.body.passwordInput,
      phone: {
        number: req.body.phoneInput,
        verified: false,
      },
      birthday: req.body.birthdayInput,
      address: req.body.addressInput,
      city: req.body.cityInput,
      state: req.body.stateInput,
      zip: req.body.zipInput,
      active: 0,
      token: token,
    })
      .then((data) => {
        emailer.sendMail(
          {
            from: "Car Gene",
            to: req.body.emailInput,
            subject: `Thank you for signing up ${req.body.firstnameInput}, please activate your account`,
            html: `<h3>Hello ${req.body.firstnameInput},</h3> <br/> Please click on the link below to activate your account.<br/>
          <a href="http://localhost:8080/activate/${data.id}/${token}">ACTIVATE NOW!</a>`,
          },
          (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
        res.status(200).json("Successfully signed up");
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          const errors = [];
          Object.keys(err.errors).forEach((key) => {
            errors.push(err.errors[key].message);
          });
          return res.status(400).send(errors);
        }
        res.status(400).json(err);
      });
  });

  //login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (user !== false) {
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.status(200).json(info.message);
        });
      } else {
        return res.status(401).json(info.message);
      }
    })(req, res, next);
  });

  //forgot password
  app.put("/api/forgot", (req, res) => {
    const token = crypto.randomBytes(20).toString("hex");
    db.User.findOne({ where: { email: req.body.email.trim() } })
      .then((data) => {
        if (data) {
          db.User.update(
            {
              token: token,
            },
            { where: { id: data.id } }
          );
          emailer.sendMail(
            {
              from: "Car Gene",
              to: data.email,
              subject: `Your reset password form ${data.firstname}, this is your reset password form`,
              html: `<h3>Hello ${data.firstname},</h3> <br/> Please click on the link below to reset your password.<br/>
              <a href="http://localhost:8080/reset/${data.id}/${token}">RESET NOW!</a>`,
            },
            (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            }
          );
          return res.status(200).json("Reset password email sent!");
        }
        return res.status(401).json("Email not found");
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.status(401).json("Server error");
      });
  });

  //reset route
  app.put("/api/reset", (req, res) => {
    db.User.findOne({ where: { id: req.body.id } })
      .then((data) => {
        if (data) {
          if (req.body.token === data.token) {
            db.User.update(
              {
                password: req.body.password,
                token: null,
              },
              { where: { id: data.id } }
            );
            return res.status(200).json("Password was reset!");
          }
        }
        return res
          .status(401)
          .json("Something went wrong, please check you reset link");
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json(err);
      });
  });
};
