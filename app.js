var express = require("express");
var app = express();

//set up body-parser to receive from data
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//Set up Method override
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Set up PG 
var pg = require("pg");
var models = require("./models/index.js");

app.set("view engine", "ejs");

app.get("/", function(req, res){
  models.User.findAll().done(function(users, error){
    res.render("index", {allUsers: users});
  });
});

app.get("/add", function(req, res){
  res.render("add");
});

app.post("/add", function(req, res){
  models.User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    username: req.body.username
  }).done(function(){
    res.redirect("/"); 
  });
});

// var findUser = function(userId){
//   models.User.findById().done(function(user, error) {
// };

app.get("/edit/:id", function(req, res){
    models.User.findById(req.params.id).done(function(user, error) {
      res.render("edit",{user: user});
  });
});

app.put("/edit/:id", function(req, res){
  models.User.findById(req.params.id).done(function(user, error) {
      user.updateAttributes({
          firstname:req.body.firstname,
          lastname:req.body.lastname,
          age:req.body.age,
          username: req.body.username
      }).done(function() {  //.done is promise vs .success is callback
          res.redirect("/");
      });
  });
});

app.delete("/remove/:id", function(req, res){
  // models.User.findAndDelete(req.params.id).done(function(req, res){
  //   res.redirect("/");
  // });
  models.User.findById(req.params.id).done(function(user, error) {
    user.destroy().done(function(){
      res.redirect("/");
    });
  });
});

app.listen(3000);