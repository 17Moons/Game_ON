//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hi, i am 17Moons aka vaibhav, i like to play videogames. I always wanted to talk over beauty of video games, so i made this blog";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://vs-45:m21phone@cluster0-shard-00-00.8batv.mongodb.net:27017,cluster0-shard-00-01.8batv.mongodb.net:27017,cluster0-shard-00-02.8batv.mongodb.net:27017/blogDB?ssl=true&replicaSet=atlas-rc6iiq-shard-0&authSource=admin&retryWrites=true&w=majority", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});



app.post("/delete", function(req, res){
  const listname = req.body.listName;
  Post.deleteOne({ title: { $gte: listname } }).then(function(){
      console.log("Data deleted");
       res.redirect("/"); // Success
  }).catch(function(error){
      console.log(error); // Failure
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
