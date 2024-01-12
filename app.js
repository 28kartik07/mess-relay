const express = require("express");
const bodyparser = require("body-parser");
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://ayush2022ca016:ayush2022ca016@cluster0.4vonwx6.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("mongo connected")).catch(err=>console.log(err));
const app = express();

const userschema=new mongoose.Schema({
    email : String,
    password : String,
    role : String,
    tcomplaint : Number
});

const usermodel=mongoose.model("messrecord",userschema);

app.use(bodyparser.urlencoded({extended:true}));    
app.set('view-engine','ejs');
app.use(express.static('public'));

const user = new usermodel({
    email : "ayush@mail.com",
    password : "12334",
    role : "student",
    tcomplaint : 12
});

// user.save();

app.route("/")
.get(function(req,res){
    res.render("home.ejs");
});

app.route("/login")
.get(function(req,res){
    res.render("login.ejs");
})
.post(function(req,res){
    const user=req.body.email;
    const pass=req.body.password;
    console.log(user,pass);
    res.redirect('/login');
});

app.route("/signup")
.get(function(req,res){
    res.render("signup.ejs");
})
.post(function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const registration=req.body.registration;
    const password=req.body.password;
    const hostel=req.body.hostel;
    console.log(name,email,registration,password,hostel);
    res.redirect('/signup');
});

app.route("/profile")
.get(function(req,res){
    res.render("profile.ejs");
})
.post(function(req,res){
    var i=req.body.message;
    console.log(i);
    res.redirect('/profile')
});

app.listen("3000",function(req,res){
    console.log("server started");
});