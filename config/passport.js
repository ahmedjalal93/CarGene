const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.User.findOne({
      email: email,
    }).then((dbUser) => {
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect Email",
        });
      } else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect Password",
        });
      } else if (dbUser.active === false) {
        return done(null, false, {
          message: "Account Pending Activation",
        });
      }

      return done(null, dbUser, {
        message: "Login Success!",
      });
    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

module.exports = passport;
