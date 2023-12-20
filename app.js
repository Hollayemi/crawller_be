var express = require("express"),
  mongoose = require("mongoose"),
  autoIncrement = require("mongoose-auto-increment"),
  Joi = require("joi"),
  app = express();
jwt = require("jsonwebtoken");
require('dotenv').config()


//connecting to mongodb
let mongoURI = process.env.DATABASEURL;
//seting up jwt token
let jwtKey = process.env.JWTKEY;


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});


mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(mongoURI)
  .then(() => console.log("db connection successful"))
  .catch(err => console.log(err));


//for request body
app.use(express.json());
var crawlSchema = new mongoose.Schema({
  result : { type: Array, required: true },
  url: { type: String, required: true },
});

var CrawlSchema = mongoose.model("crawled", crawlSchema);

app.get("/", (req, res) => {
  res.send("Web Information Extraction tool Crawler Api😀");
});

app.get("/api", (req, res) => {
  res.send("Web Information Extraction tool Crawler Api😀");
});

app.get("/api/crawled", (req, res) => {
  CrawlSchema.find()
    .exec(function (err, rez) {
      res.send(rez);
    });
});

app.post("/api/crawl", (req, res) => {
  console.log(req.body)
    let newCrawl;
    newCrawl = {
      result: req.body.data,
      url: req.body.url
    };

    CrawlSchema.findOneAndUpdate({url: newCrawl.url}, {$set: {...newCrawl}}, {upsert: true}, function (err, role) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(role);
        console.log("new Role Saved");
      }
    });
});

var port = process.env.PORT;
if (port & process.env.IP) {
  app.listen(port, process.env.IP, () => {
    console.log("started");
  });
} else
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
