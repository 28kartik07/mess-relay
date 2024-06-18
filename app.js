require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const multer = require("multer");
// const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const GoogleStrategy = require('passport-google-oauth2');
const fs = require("fs");
const app = express();

//storage and filename setting//

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//upload setting//
const upload = multer({
  storage: storage,
});

app.use(bodyparser.json());
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',passport.authenticate("google",{
//   successRedirect: "/adminprofile",
//   failureRedirect: "/login",
// })
// );

// passport.use("google",new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: 'http://localhost:3000/auth/google/callback',
// },(accessToken, refreshToken, profile, cb) => {
//     console.log(profile.email);
//     return cb(null, profile.email);
// }));

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     usermodel.find({ username: username }).then((user) => {
//       // if (err) { return done(err); }
//       if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
//       bcrypt.compare(password, user[0].salt, function(err, result) {
//         if (err) { return done(err); }
//         console.log(user[0].name);
//         if (!result) { return done(null, false, { message: 'Incorrect password.' }); }
//         return done(null, user);
//       });
//     });
//   }
// ));

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

passport.use(usermodel.createStrategy());

const complaintschema = new mongoose.Schema({
  userid: mongoose.Types.ObjectId,
  username: String,
  complaint: String,
  hostel: String,
  upvote: {
    type: Number,
    default: 0,
  },
  downvote: {
    type: Number,
    default: 0,
  },
  like: {
    type: [String], // Array of strings
  },
  dislike: {
    type: [String], // Array of strings
  },
  status: {
    type: String,
    default: "open",
  },
  image: String,
  img64: String,
});

const complaintmodel = mongoose.model("complaints", complaintschema);

let cond = true;
let islogged = false;

app.route("/").get(function (req, res) {
  res.render("home.ejs", { islogged, cond });
});

app
  .route("/login")
  .get(function (req, res) {
    if(req.isAuthenticated()){
      res.redirect("/userprofile");
    }
    else{    
      res.render("login.ejs", { error: "" });
  }
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
            res.render("login.ejs", { error: "Invalid user ID or Password" });
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
  
app.route("/forgot")
  .get(function(req,res){
      res.render("forgot.ejs");
  })
  .post(async function(req,res){
      const email= req.body.username;
      // alert(email);
      try {
        const user = await usermodel.findOne({ username : email });
        // Check if a user with the specified email exists

        if (user) {
            // User found, return a success response
          const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
          const time = Date.now();
          console.log(email,otp);
          req.session.otp = otp;
          req.session.time = time;
          req.session.userid=email;
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mail,
                pass: process.env.password
            }
          });

          const mailOptions = {
            from: process.env.mail,
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please use the following token within the next hour to reset your password:\n\n
               Token: ${otp}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.send('Error sending OTP');
            } else {
                // console.log('Email sent: ' + info.response);
                // Save the OTP in the database or session for verification
                res.redirect('/verify');
            }
          });
            
        } else {
            // User not found, return a failure response
            res.send({ exists: false,user:"This email is not registered!" });
            // res.send("this email is not registered!");
        }
    } catch (err) {
        console.error('Error checking user', err);
        res.status(500).send('Error checking user');
    }

  });

  app.route("/verify")
  .get(function(req,res){
    res.render('verify.ejs',{error:""});
  })
  .post(function(req,res){
    const entered_otp=req.body.otp;
    const otpTimestamp = req.session.time;
    const otpValidityPeriod = 1 * 60 * 1000; // 1 minutes in milliseconds

    console.log(entered_otp);
    if (Date.now() - otpTimestamp > otpValidityPeriod) {
        res.render('verify.ejs',{error:"OTP expired. Please request a new one."});
        // res.send('OTP expired. Please request a new one.');
    } else if (req.session.otp === entered_otp) {
        res.redirect('/reset')
    } else {
      res.render('verify.ejs',{error:"Invalid OTP. Please try again."});
    }
  });

  app.route("/reset")
  .get(function(req,res){
    res.render('reset.ejs',{error:""});
  })
  .post(async function(req,res){
    const newpassword=req.body.newpassword;
    const repassword=req.body.repassword;
    if(newpassword===repassword){
      const username=req.session.userid;
      console.log(newpassword,repassword);
      try {
        // Find the user by username
        const user = await usermodel.findOne({ username });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Set new password using setPassword method
        await user.setPassword(newpassword);
    
        // Save the updated user object
        await user.save();
    
        res.render('login.ejs',{error: "Password reset successfully!"});
        // res.status(200).json({ message: 'Password reset successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    else{
      res.render('reset.ejs',{error:"Please Enter the same password!"});
    }
  });

  app
    .route("/signup")
    .get(function (req, res) {
      if(req.isAuthenticated()){
        res.redirect("/userprofile");
      }
      else    res.render("signup.ejs");
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
              return res.redirect("/signup");
            }
            passport.authenticate('local')(req, res, () => {
              res.redirect('/login');
            });
            //  else {
            //   res.redirect("/login");
            // }
          }
      );
    });
  
    let openu,closeu,inprogressu;
    app
    .route("/userprofile")
    .get(function (req, res) {
      cond = true;
      if (req.isAuthenticated()) {
        var id = req.user._id;
        islogged = true;
        complaintmodel
          .find({ userid: id })
          .then((data) => {
            openu=closeu=inprogressu=0;
            for (let i = 0; i < data.length; i++) {
              // for(let j=0;j<data.dislike.length;j++){
                  // console.log(data[i].dislike);
              // }
                if(data[i].status==="open")
                    openu++;
                else if(data[i].status==="close")
                    closeu++;
                else
                    inprogressu++;
            }
            // console.log(data);
            res.render("userprofile.ejs", { complaints: data,openu,closeu,inprogressu });
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        res.render("login.ejs", { error: "Login To View userprofile" });
      }
    })
    .post(function (req, res) {
      async function fetchData() {
        let arr=req.body.likedata;
        if(arr && arr.length > 0){
          console.log(arr);
          arr.forEach(i => {
            const update = {
              $set: { upvote: i.upvote }
            };
            
            if (i.add && i.add.length > 0) {
              update.$push = { like: i.add };
            }

            if (i.remove && i.remove.length > 0) {
              update.$pull = { like: i.remove };
            }
            complaintmodel
            .updateOne({ _id: i.userid },update)
            .then((result) => {
              if (!result) console.log("not updated");
            });
          });
        }
        
      }
      fetchData().then(result => {
        if(result)     console.log("updated");
      });
      var a=req.body.dislikedata;
      if(a && a.length > 0){
        console.log(a);
        a.forEach(i => {
          const update = {
            $set: {  downvote: i.downvote }
          };
          
          if (i.add && i.add.length > 0) {
            update.$push = { dislike: i.add };
          }

          if (i.remove && i.remove.length > 0) {
            update.$pull = { dislike: i.remove };
          }
          complaintmodel
          .updateOne({ _id: i.userid },update)
          .then((result) => {
            if (!result) console.log("not updated");
          });
        });
      }
      const v = req.body.choose;  
      var id=req.user._id;
      if (v === "All") {
        complaintmodel.find({ hostel: req.user.hostel }).then((data) => {
          res.render("userprofile.ejs", { complaints: data,openu,closeu,inprogressu });
        });
      } else {
        complaintmodel.find({ userid: id }).then((data) => {
          res.render("userprofile.ejs", { complaints: data,openu,closeu,inprogressu });
        });
      }
    });
    
let opena,closea,inprogressa;
var view=0;
app.route("/adminprofile")
.get(function (req, res) {
  if(req.isAuthenticated()){
  cond = false;
  islogged = true;
  complaintmodel.find({}).then((data) => {
    opena=closea=inprogressa=0;
    for (let i = 0; i < data.length; i++) {
        if(data[i].status==="open")
            opena++;
        else if(data[i].status==="close")
            closea++;
        else
            inprogressa++;
    }
    return complaintmodel.find({ status: "open" });
  }).then((openComplaints) => {
      // Render admin profile with data from both find operations
      res.render("adminprofile.ejs", { complaints: openComplaints, view, opena, closea, inprogressa });
  }).catch((error) => {
      console.error(error);
  });
}
else
    res.redirect('/login');
  // });
  // complaintmodel.find({status : "open"}).then((data) => {
  //   res.render("adminprofile.ejs", { complaints: data,view,opena,closea,inprogressa });
  // });
})
.post(async function(req,res){
  try {
    var status = req.body.choose;
    var c = req.body.formData;
    console.log("FormData:", c);

    if (c && c.length) {
      let result;
      if (c[0] === "tick1") {
        result = await complaintmodel.updateOne({ _id: c[1] }, { $set: { status: "in-progress" } });
      } else {
        result = await complaintmodel.updateOne({ _id: c[1] }, { $set: { status: "close" } });
      }

      if (!result) {
        console.log("Data not updated");
      } 
    }

    let data;
    if (status == "all") {
      view=0;
      data = await complaintmodel.find({ status: "open" });
    } else if (status == "initiated") {
      data = await complaintmodel.find({ status: "in-progress" });
      view = 1;
    } else {
      view = 2;
      data = await complaintmodel.find({ status: "close" });
    }

    res.render("adminprofile.ejs", { complaints: data, view, opena, closea, inprogressa });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.route("/menu")
  .get(function (req,res){
      res.render("menu.ejs");
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
  .post(upload.single("image"), function (req, res) {
    var id = req.user._id;
    var imgpath = req.file.path;
    console.log(imgpath);
    //converting image  to base 64 //
    const img = fs.readFileSync(imgpath, { encoding: "base64" });

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
      image: req.file.filename,
      img64: img,
    });

    c.save().then(() => {
      fs.unlinkSync(imgpath);
      res.redirect("/userprofile");
    });
  });

app.get("/logout", (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      islogged = false;
      res.redirect("/login"); // Redirect to the login page after logout
    }
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
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
