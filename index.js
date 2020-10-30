require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue sur mon serveur" });
});

app.post("/form", (req, res) => {
  console.log(req.fields);

  // Envoi du mail (mailgun)
  const mailgun = require("mailgun-js");
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: DOMAIN,
  });

  const data = {
    from:
      "Mailgun Sandbox <postmaster@sandboxc3cbac11a9724b7eb40e3c2e6bd90ca3.mailgun.org>",
    to: req.fields.email,
    subject: "Hello from Contact Form",
    text: `Hello ${req.fields.firstName} ${req.fields.lastName}, we received your request ! `,
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);

    if (error === undefined) {
      res.json({ message: "Données reçues. Un mail a été envoyé" });
    } else {
      res.json({ message: "An error occurred" });
    }
  });
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "Route introuvable!" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
