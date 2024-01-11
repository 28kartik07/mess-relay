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

user.save();

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
})
.post(function(req,res){
    var i=req.body.message;
    console.log(i);
    res.redirect('/profile')
});

app.listen("3000",function(req,res){
    console.log("server started");
});