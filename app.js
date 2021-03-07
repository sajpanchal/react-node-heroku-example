const express = require("express");
const sendgrid = require("@sendgrid/mail");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

//React build app setup
app.use(express.static(path.join(__dirname, "build"))); // serve all static files from build

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html")); // this will keep our client side routing functional.
});

app.use(bodyParser.json());
// // allows your app to interact with the apps running on different servers.
app.use(cors());
//this will set the http server response header.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Acess-Control-Allow-Headers", "Content-Type , Authorization");
  next();
});
//get request
app.get("/api", (req, res, next) => {
  res.send("API status: OK");
});

//post request
app.post("/api/email", (req, res, next) => {
  sendgrid.setApiKey(
    "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"
  );
  const msg = {
    to: "sajpanchal2020@outlook.com", // Change to your recipient
    from: "sajpanchal@gmail.com", // Change to your verified sender
    subject: req.body.subject,
    text: req.body.message,
    html: `<strong>sender: ${req.body.email}</strong><br>Message: <strong>${req.body.message}</strong>`,
  };
  sendgrid
    .send(msg)
    .then((result) => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");
