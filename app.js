const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.set('view-engine','ejs');
app.use(express.static('public'));

app.route("/")
.get(function(req,res){
    res.render("home.ejs");
});

app.route("/login")
.get(function(req,res){
    res.render("login.ejs");
});

app.route("/signup")
.get(function(req,res){
    res.render("signup.ejs");
});

app.route("/profile")
.get(function(req,res){
    res.render("profile.ejs");
});

app.listen("3000",function(req,res){
    console.log("server started");
});