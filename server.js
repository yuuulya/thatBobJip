// import { body, validationResult } from "express-validator";
const express = require("express");
const crypto = require("crypto");

const app = express();
var bodyParser = require("body-parser");
const path = require("path");

const server = app.listen(3000, () => {
  console.log("start server : localhost :3000");
});

var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "bobjip_db",
});

conn.connect((err) => {
  if (err) throw err;
});

app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", __dirname + "/views");
//ejs : embedded javascript templates
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(__dirname + "/public"));

app.get("/add", function (req, res) {
  // res.send("hello world");
  res.render("add");
});

app.get("/about", function (req, res) {
  // res.send("about page");
  res.render("about.html");
});

app.get("/complete", function (req, res) {
  // res.send("about page");
  res.render("complete.html");
});

app.get("/db", function (req, res) {
  // Use the connection
  conn.query("SELECT * FROM bobjip", (error, results) => {
    res.write(JSON.stringify(results));
    console.log("results", results);
    // When done with the connection, release it.
    res.end();
  });
});


// conn.connect(function (err) {
// if (err) throw err;
app.post("/add", function (req, res) {
  var userid = req.body.userid;
  var password = req.body.password;
  var nickname = req.body.nickname;
  var email = req.body.email;
  let salt = Math.round(new Date().valueOf() * Math.random()) + "";
  password = crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");

  var sql =
    "insert into bobjip (userid, password, nickname, email, salt) values (?, ?, ? ,?, ?)";
  var params = [userid, password, nickname, email, salt];
  conn.query(sql, params, function (err, results, fields) {
    if (err) {
      throw err;
    }
    console.log("i record inserted");
    res.redirect("/complete");
  });
});
// });
