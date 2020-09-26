const express = require("express");
const session = require("express-session");
const handlebars = require("express-handlebars");
const passport = require("./config/passport");
const mongoose = require("mongoose");
//const compression = require("compression");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("public"));
app.use(session({ secret: "Hamoody", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./lib/handlebars-helpers"),
  })
);
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cargene";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
