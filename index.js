const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({
    extended: true
}))

const PRIVATE_APP_ACCESS = `pat-na1-49603e57-83df-4f6e-96f3-0be31511bb2a`;

const headers = {
  authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  // "Content-Type": "application/json",
};

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/test", async (req, res) => {
  const companies = "https://api.hubspot.com/crm/v3/objects/companies";
  try {
    const response = await axios.get(companies, { headers });
    res.json(response.data.results);
  } catch (error) {
    console.error(error);
  }
});

app.get("/getList", async (req, res) => {
  const companies =
    "https://api.hubapi.com/communication-preferences/v3/definitions";
  try {
    const response = await axios.get(companies, { headers });
    return res.json(response.data?.subscriptionDefinitions);
  } catch (error) {
    console.error(error);
  }
});

app.post("/subscribe", async (req, res) => {
  const companies =
    "https://api.hubapi.com/communication-preferences/v3/subscribe";
  const data = {
    emailAddress: req.body.emailAddress,
    subscriptionId: req.body.subscriptionId,
    legalBasis: "LEGITIMATE_INTEREST_PQL",
    legalBasisExplanation: "string",
  };
  try {
    const response = await axios.post(companies, JSON.stringify(data), {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.json(error)
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
