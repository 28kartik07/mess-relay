require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const passportlocalmongoose = require("passport-local-mongoose");

const app = express();

app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(
    "mongodb+srv://ayush2022ca016:ayush2022ca016@cluster0.4vonwx6.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

const userschema = new mongoose.Schema({
  username: String,
  password: String,
  registration: String,
  name: String,
  hostel: String,
  gender: String,
});

userschema.plugin(passportlocalmongoose);

const usermodel = mongoose.model("messrecord", userschema);

// passport.use(new LocalStrategy(usermodel.authenticate()));
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

passport.use(usermodel.createStrategy());

app.route("/").get(function (req, res) {
  res.render("home.ejs");
});

app.route("/login")
  .get(function (req, res) {
    res.render("login.ejs",{error : ""});
  })
  .post(function (req, res) {
    const user = new usermodel({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        passport.authenticate("local",function(err,user,info){
            if(err)
                console.log(err);
            if(!user)
            {
                res.render("login.ejs",{error: "Invalid User ID or Password"});
            }
            else    
                res.redirect("/profile");
        })(req,res);
      
      }
    });
  });

app
  .route("/signup")
  .get(function (req, res) {
    res.render("signup.ejs");
  })
  .post(function (req, res) {
    usermodel.register(
      {
        username: req.body.username,
        name: req.body.name,
        registration: req.body.registration,
        hostel: req.body.hostel,
        gender: req.body.inlineRadioOptions,
      },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/signup");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/login");
          });
        }
      }
    );
  });

app
  .route("/profile")
  .get(function (req, res) {
    if (req.isAuthenticated()) {
      res.render("profile.ejs");
    } else {
        res.render("login.ejs",{error: "Login To View Profile"});
    }
  })
  .post(function (req, res) {
    var i = req.body.message;
    console.log(i);
    res.redirect("/profile");
  });

app.listen("3000", function (req, res) {
  console.log("server started");
});
