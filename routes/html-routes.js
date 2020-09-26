const isAuthenticated = require("../config/middleware/isAuthenticated");
const db = require("../models");
module.exports = function (app) {
  app.get("/", isAuthenticated, (req, res) => {
    const info = {
      title: "Car Gene",
      authenticated: true,
    };
    res.render("index", info);
  });

  app.get("/request", isAuthenticated, (req, res) => {
    const info = {
      title: "Car Gene",
      authenticated: true,
    };
    res.render("request", info);
  });

  app.get("/login", (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    const info = {
      title: "Car Gene | Login",
    };
    res.render("login", info);
  });

  app.get("/logout", (req, res) => {
    if (req.user) {
      req.logout();
    }
    res.redirect("/");
  });

  app.get("/signup", (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    const info = {
      title: "Car Gene | Signup",
    };
    res.render("signup", info);
  });

  app.get("/forgot", (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    const info = {
      title: "Car Gene | Forgot passowrd",
    };
    res.render("forgot", info);
  });

  app.get("/reset/:id?/:token?", (req, res) => {
    if (req.params && req.params.id && req.params.token) {
      res.render("reset", {
        title: "Car Gene | Password reset",
      });
    } else {
      res.redirect("/forgot");
    }
  });

  app.get("/activate/:id/:token", (req, res) => {
    db.User.findOneAndUpdate(
      { _id: req.params.id, token: req.params.token },
      { $set: { token: null, active: true } },
      { new: true },
      (err, data) => {
        if (err) {
          return console.log(err);
        }
        const info = {
          title: "Activate your account",
        };
        if (data !== null) {
          if (data.token === null) {
            info.message = "Your account was successfuly activated";
          } else {
            info.message =
              "Something went wrong while activating your account, please check your link";
          }
        } else {
          info.message =
            "Something went wrong while activating your account, please check your link";
        }
        res.render("activate", info);
      }
    );
  });
};
