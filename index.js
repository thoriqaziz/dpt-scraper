const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4001;

app.get("/scrape/:nik", (req, res) => {
    scrapeLogic(req, res);
});

app.get("/", (req, res) => {
    res.send("Render puppeteer server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});