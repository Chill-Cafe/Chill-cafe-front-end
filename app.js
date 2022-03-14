const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/kitchenDB');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const orderSchema = new mongoose.Schema({
    name: String,
    table: Number,
    number: Number,
    status: String
});

const User = mongoose.model("user",userSchema);
const Order = mongoose.model("order",orderSchema);

const cook1 = new User({
    username: "cook01",
    password: "123456"
});
const cook2 = new User({
    username: "cook02",
    password: "654321"
});
const defaultUser = [cook1, cook2];

const order1 = new Order({
    name: "foods",
    table: 1,
    number: 1,
    status: "Queue"
});

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
      order1.save();
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

app.post("/", function(req, res){
    var Username = req.body.uname;
    var Password = req.body.psw;

    User.findOne({username: Username, password: Password}, function(err, foundUser) {
        if(foundUser != null) {
            Order.find({ status: "Queue" }, function(err, foundItems) {
                res.render("orderList", {
                    listTitle: "Queue",
                    newListItems: foundItems
                });
            });
        } else {
            res.sendFile(__dirname + "/public/login.html");
        }
    });
});

app.get("/Queue", function(req, res){
    Order.find({ status: "Queue" }, function(err, foundItems) {
        res.render("orderList", {
            listTitle: "Queue",
            newListItems: foundItems
        });
    });
});

app.get("/Cooking", function(req, res){
    Order.find({ status: "Cooking" }, function(err, foundItems) {
        res.render("orderList", {
            listTitle: "Cooking",
            newListItems: foundItems
        });
    });
});

app.get("/Done", function(req, res){
    Order.find({ status: "Done" }, function(err, foundItems) {
        res.render("orderList", {
            listTitle: "Done",
            newListItems: foundItems
        });
    });
});

app.get("/Cancel", function(req, res){
    Order.find({ status: "Cancel" }, function(err, foundItems) {
        res.render("orderList", {
            listTitle: "Cancel",
            newListItems: foundItems
        });
    });
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === "Queue") {
      Order.findByIdAndUpdate(checkedItemId, { status: "Cooking" }, function(err){
          if(!err) {
              res.redirect("/Queue");
          } else {
              console.log(err);
          }
      });
    } else if(listName === "Cooking") {
        Order.findByIdAndUpdate(checkedItemId, { status: "Done" }, function(err){
            if(!err) {
                res.redirect("/Cooking");
            } else {
                console.log(err);
            }
        });
    }
});

// app.post("/buttonCancel", function(req, res){
//     const checkedItemId = req.body.button;
//     const listName = req.body.listName;
//     Order.findByIdAndUpdate(checkedItemId, { status: "Cancel" }, function(err){
//         if(!err) {
//             res.redirect("/"+listName);
//         } else {
//             console.log(err);
//         }
//     });
// });

app.listen(3000, function() {
    console.log("Server listening on port 3000");
});