require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

// Config. Mailgun
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue sur mon serveur" });
});

app.post("/form", (req, res) => {
  console.log(req.fields);

  /* OBJET DATA */
  const data = {
    from: `${req.fields.firstName} ${req.fields.lastame} <${req.fields.email}> `, //"Mailgun Sandbox <postmaster@sandboxc3cbac11a9724b7eb40e3c2e6bd90ca3.mailgun.org>"
    to: "claire.lcnt@gmail.com",
    subject: "Hello from Contact Form",
    text: `Hello ${req.fields.firstName} ${req.fields.lastName}, we received your request ! `,
  };

  /* ENVOI DE L'OBJET VIA MAILGUN */
  mg.messages().send(data, function (error, body) {
    if (!error) {
      return res.status(200).json(body);
    } else {
      res.status(401).json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "Route introuvable!" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
