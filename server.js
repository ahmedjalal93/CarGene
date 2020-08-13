const express = require("express");
const routes = require("./routes");
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 8080;
const db = require("./models");

app.use(fileUpload());
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Start the API server
db.sequelize.sync({}).then(() => {
  app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
});