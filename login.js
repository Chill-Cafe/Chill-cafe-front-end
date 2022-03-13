const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/kitchenDB');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("user",userSchema);

const cook1 = new User({
    username: "cook01",
    password: "123456"
});
const cook2 = new User({
    username: "cook02",
    password: "654321"
});
const defaultUser = [cook1, cook2];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/login.html");

    User.find({}, function(err, foundUser) {
        if(foundUser.length == 0){
          User.insertMany(defaultUser, function(err){
            if(err){
              console.log(err);
            }
            else{
              console.log("insertion Successful");
            }
          });
        }
    });
});

app.post("/", function(req, res){
    var Username = req.body.uname;
    var Password = req.body.psw;

    User.findOne({username: Username, password: Password}, function(err, foundUser) {
        if(foundUser != null) {
            res.sendFile(__dirname + "/restaurant.html");
        } else {
            res.redirect("/");
        }
    });
});

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});