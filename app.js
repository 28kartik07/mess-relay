require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const multer = require("multer");
const app = express();

//storage and filename setting//

const storage = multer.diskStorage({
  destination : "public/uploads",
  filename : function(req,file,cb){
    cb(null,file.originalname)
  }
});
//upload setting//
const upload = multer({
  storage : storage
});



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
    "mongodb+srv://ayush2022ca016:jhaaayus@cluster0.v4icccp.mongodb.net/?retryWrites=true&w=majority"
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
  role: {
    type: String,
    default: "Student",
  },
  tcomplaint: {
    type: Number,
    default: 0,
  },
});

userschema.plugin(passportlocalmongoose);

const usermodel = mongoose.model("messrecord", userschema);

passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

passport.use(usermodel.createStrategy());

const complaintschema = new mongoose.Schema({
  userid: mongoose.Types.ObjectId,
  username: String,
  complaint: String,
  upvote: {
    type: Number,
    default: 0,
  },
  downvote: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "not done",
  },
  hostel:String,
  image: String
});

const complaintmodel = mongoose.model("complaints", complaintschema);

let cond = true;

app.route("/").get(function (req, res) {
  res.render("home.ejs", { islogged, cond });
});

let islogged = false;

app
  .route("/login")
  .get(function (req, res) {
    res.render("login.ejs", { error: "" });
  })
  .post(function (req, res) {
    const user = new usermodel({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local", function (err, user, info) {
          if (err) console.log(err);
          if (!user) {
            res.render("login.ejs", { error: "Invalid User ID or Password" });
          } else {
            usermodel.find({ username: req.body.username }).then((data) => {
              if (data[0].role === "admin") res.redirect("/adminprofile");
              else res.redirect("/userprofile");
            });
          }
        })(req, res);
      }
    });
  });

app.route("/adminprofile").get(function (req, res) {
  cond = false;
  var id = req.user._id;
  // console.log(id);
  usermodel.find({ _id: id }).then((data) => {
    // complaintmodel.find({hostel})
    console.log(data[0].hostel);
  });
  res.render("adminprofile.ejs");
});

app
  .route("/complaint")
  .get(function (req, res) {
    if (req.isAuthenticated()) {
      res.render("complaint.ejs");
    } else {
      res.render("login.ejs", { error: "Login To Add Complaint" });
    }
  })
  .post(upload.single("image"),function (req, res) {
    var id = req.user._id;
    usermodel
      .updateOne({ _id: id }, { $inc: { tcomplaint: 1 } })
      .then((result) => {
        if (!result) console.log("not updated");
      });

    var comp = req.body.message;
    var name = req.user.username;
    const c = new complaintmodel({
      userid: id,
      username: name,
      complaint: comp,
      hostel: req.user.hostel,
      image: req.file.filename
    });

    c.save();
    res.redirect("/userprofile");
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
          res.redirect("/login");
        }
      }
    );
  });

app.get("/logout", (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/login"); // Redirect to the login page after logout
    }
  });
});

app.route("/userprofile").get(function (req, res) {
  cond = true;
  if (req.isAuthenticated()) {
    var id = req.user._id;
    islogged = true;
    complaintmodel
      .find({ userid: id })
      .then((data) => {
        res.render("userprofile.ejs", { complaints: data, islogged });
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    res.render("login.ejs", { error: "Login To View userprofile" });
  }
});

app.listen("3000", function (req, res) {
  console.log("server started");
});

// usermodel.register(
//   {
//     username: "gore@gmail.com",
//     name: "gore lal",
//     registration: "xxxx",
//     hostel: "raman",
//     gender: "male",
//     role: "admin",
//   },
//   "gore",
//   (err, user) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: "Error registering user" });
//     }
//   }
// );
