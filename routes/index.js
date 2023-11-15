var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");

/* GET home page. */
router.get("/", function (req, res, next) {
res.send("Index Page")
});


router.get("/alluserpost", async function (req, res, next) {
  try {
    let userdetail = await userModel.findOne({_id: "65537cf566650c9e4fabc81a"}).populate('posts');
    if (!userdetail) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(userdetail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/createuser", async function (req, res, next) {
  let createdUser = await userModel.create({
    username: "faizan",
    password: "faizan",
    posts: [],
    email: "faizan@gmail.com",
    fullname: "faizan ali akbar",
  });
  res.send(createdUser);
});

router.get("/createpost", async function (req, res, next) {
  let createdPost = await postModel.create({
    postText: "Join Us!",
    user : '65537cf566650c9e4fabc81a'
  });

 let user = await userModel.findOne({_id: "65537cf566650c9e4fabc81a"});
 user.posts.push(createdPost._id);
 await user.save();
 res.send("Post Created");
});

module.exports = router;
