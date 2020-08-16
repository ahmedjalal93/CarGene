const db = require("../models");
const passport = require("../config/passport");
const crypto = require("crypto");
const emailer = require("../lib/emailer");
const router = require("express").Router();

// login route
router.route("/login").post((req, res, next) => {
  console.log("user data req", req.body)
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user !== false) {
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: user.id,
          email: user.email,
          message: info.message,
          success: true
        });
      });
    } else {
      console.log("my user", req.user)
      return res.json({
        message: info.message,
        success: false
      });
    }
  })(req, res, next);
});

// signup route
router.route("/signup").post((req, res) => {
  console.log("post signup", req.files, " body ", req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json('No files were uploaded.');
  }

  let picture = req.files.picture;
  picture.mv('./uploads/' + picture.name, function(err) {
    if (err){
      return res.status(500).json(err);
    }
  });

  const token = crypto.randomBytes(20).toString("hex");
  db.User.create({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    bio: req.body.bio,
    picture: req.body.picture,
    active: 0,
    token: token
  })
    .then(data => {
      emailer.sendMail(
        {
          from: "Recipe Index",
          to: req.body.email,
          subject:
            "Thank you for signing up " +
            req.body.name +
            ", please activate your account",
          html: `Hello ${req.body.name}, <br/> Please click on the link below to activate your account.<br/>
          <a href="https://https://localhost:8080/activate/${data.id}/${token}">ACTIVATE NOW!</a>`
        },
        (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

// logout route
router.route("/logout").get((req, res) => {
  req.logout();
  res.json(true)
});

//reset password
router.route("/reset/send").put((req, res) => {
  const token = crypto.randomBytes(20).toString("hex");
  db.User.findOne({ where: { email: req.body.email.trim() } })
    .then(data => {
      db.User.update(
        {
          token: token
        },
        { where: { id: data.id } }
      );
      emailer.sendMail(
        {
          from: "Recipe Index",
          to: data.email,
          subject:
            "Your reset password form " +
            data.name +
            ", this is your reset password form",
          html: `Hello ${data.name}, <br/> Please click on the link below to reset your password.<br/>
          <a href="https://localhost:8080/reset/${data.id}/${token}">RESET NOW!</a>`
        },
        (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
      res.json(data);
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

router.route("/reset/password").put((req, res) => {
  db.User.findOne({ where: { id: Number(req.body.id) } })
    .then(data => {
      if (req.body.token === data.token) {
        db.User.update(
          {
            password: req.body.password,
            token: null
          },
          { where: { id: data.id } }
        );
        return res.json(true);
      }
      return res.json(false);
    })
    .catch(err => {
      console.log(err);
      res.status(401).json(err);
    });
});

router.route("/activate/:id/:token").get((req, res) => {
  db.User.findOne({ where: { id: Number(req.params.id) } }).then(data => {
    const response = {};
    if (data !== null) {
      if (req.params.token === data.token) {
        db.User.update(
          {
            active: 1,
            token: null
          },
          { where: { id: data.id } }
        );
        response.code = 1;
        response.message = "Your account was successfuly activated";
      } else {
        response.code = 0;
        response.message = "Something went wrong while activating your account, please check your link";
      }
    } else {
      response.code = 0;
      response.message = "Something went wrong while activating your account, please check your link";
    }
    return res.json(response);
  });
});

router.route("/authenticate").get((req, res) => {
  if (req.user) {
    return res.json(true)
  }
  return res.json(false)
})


module.exports = router;
